# Sincronização Cron Diária — Guia de Troubleshooting

## 📚 Visão Geral

A sincronização automática lê transações de `Lancamentos2026` (Google Sheets) e as insere/atualiza em `transactions` (Supabase) diariamente às **8h da manhã (UTC)**.

**Arquivo Principal:** `/app/api/sync/cron/route.ts`

---

## 🔧 Configuração

### 1. Vercel Cron Job (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/sync/cron",
      "schedule": "0 8 * * *"
    }
  ]
}
```

- **Schedule:** `0 8 * * *` = 8h UTC todos os dias
- **Timezone:** UTC (Vercel não suporta timezones customizadas)
- Para ajustar o horário: altere o primeiro valor (0-59 horas, 0-23)

### 2. Variáveis de Ambiente

Certifique-se de que estão configuradas em `.env` ou no Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_SHEETS_API_KEY=your-api-key
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

---

## ✅ Validação de Dados

A sincronização valida cada linha da Google Sheets:

| Campo | Regra | Exemplos Válidos |
|-------|-------|------------------|
| **Data** | ISO (YYYY-MM-DD) ou BR (DD/MM/YYYY) | `2026-02-20`, `20/02/2026` |
| **Tipo** | `Entrada` ou `Saída` (exato) | ✓ `Entrada`, ✗ `entrada` |
| **Categoria** | Conhecida em `INCOME_CATEGORIES` ou `EXPENSE_CATEGORIES` | ✓ `F5`, ✗ `F5_AI` |
| **Valor** | Número > 0 (suporta `,` ou `.`) | `100`, `100.50`, `1500,00` |
| **Descrição** | Qualquer texto (opcional) | `F5 IA payment` |

### Exemplo de Linha Válida

```
| Data       | Tipo   | Categoria | Valor   | Descrição        |
|-----------|--------|-----------|---------|------------------|
| 20/02/2026 | Entrada | F5        | 500,00  | F5 IA pagamento  |
```

---

## 🔄 Lógica de Upsert

A sincronização usa **upsert com chave composta** para evitar duplicatas:

**Chave única:** `(date, category, type)`

- Se essa combinação já existe → **atualiza** `description` e `amount`
- Se não existe → **insere** como nova transação

### Exemplo

```
Primeira sync:
  INSERT: 2026-02-20 | Entrada | F5 | 500 | "Original"

Segunda sync (mesmo dia, mesma categoria/tipo):
  UPDATE: 2026-02-20 | Entrada | F5 | 600 | "Updated"
```

---

## 🔁 Retry Logic

Cada transação tenta ser inserida/atualizada **até 3 vezes** com backoff exponencial:

- Tentativa 1: falha → aguarda **1 segundo**
- Tentativa 2: falha → aguarda **2 segundos**
- Tentativa 3: falha → marca como erro e continua

### Código

```typescript
await retryWithBackoff(async () => {
  await transactionService.upsert(dbTransaction);
}, 3, [1000, 2000, 4000]);
```

---

## 📊 Logging

Cada execução é registrada em `sync_log`:

```sql
SELECT * FROM sync_log ORDER BY started_at DESC LIMIT 1;
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `source` | `google_sheets` | Sempre `google_sheets` |
| `status` | `success` \| `error` | Sucesso ou falha |
| `rows_processed` | INT | Total de linhas lidas |
| `rows_inserted` | INT | Novas transações inseridas |
| `rows_updated` | INT | Transações atualizadas |
| `error_message` | TEXT | Detalhes do erro (se houver) |
| `started_at` | TIMESTAMP | Início da sincronização |
| `completed_at` | TIMESTAMP | Fim da sincronização |

### Exemplo de Log de Sucesso

```json
{
  "id": "uuid-123",
  "source": "google_sheets",
  "status": "success",
  "rows_processed": 15,
  "rows_inserted": 10,
  "rows_updated": 5,
  "error_message": null,
  "started_at": "2026-02-20T08:00:00Z",
  "completed_at": "2026-02-20T08:00:03Z"
}
```

### Exemplo de Log de Erro Parcial

```json
{
  "id": "uuid-456",
  "source": "google_sheets",
  "status": "error",
  "rows_processed": 3,
  "rows_inserted": 2,
  "rows_updated": 0,
  "error_message": "Row 5: Invalid categoria 'UnknownCategory'\nRow 8: Invalid date 'invalid'",
  "started_at": "2026-02-20T08:01:00Z",
  "completed_at": "2026-02-20T08:01:02Z"
}
```

---

## 🚨 Troubleshooting

### Problema: Nenhuma transação foi sincronizada

**Possíveis Causas:**

1. **Google Sheets vazio**
   - Verifique se `Lancamentos2026` tem dados
   - Verifique se o cabeçalho está na linha 1

2. **Variáveis de ambiente faltando**
   ```bash
   # No Vercel Dashboard → Settings → Environment Variables
   # Certifique-se que todos estão presentes e corretos
   ```

3. **Problema de permissões na Google Sheets API**
   - Vá para [Google Cloud Console](https://console.cloud.google.com)
   - Verifique se Sheets API está habilitada
   - Verifique se a API Key tem permissão de leitura

**Solução:**

1. Teste localmente com `npm run test:sync`
2. Verifique o log no Vercel Dashboard → Logs
3. Verifique `sync_log` em Supabase

---

### Problema: Algumas transações falharam

**Identifique o Erro:**

```sql
-- Busque o último log com erro
SELECT status, rows_processed, rows_inserted, error_message
FROM sync_log
WHERE status = 'error'
ORDER BY started_at DESC LIMIT 1;
```

**Erros Comuns:**

| Erro | Causa | Solução |
|------|-------|---------|
| `Invalid date "20/02/26"` | Formato de ano incompleto | Use `DD/MM/YYYY` com 4 dígitos |
| `Unknown categoria "F5_AI"` | Categoria não existe | Verifique `lib/category-map.ts` |
| `Invalid amount "abc"` | Texto não é número | Verifique coluna Valor |
| `Tipo deve ser "Entrada" ou "Saída"` | Case-sensitive | Use exatamente: `Entrada` ou `Saída` |

---

### Problema: Cron não está executando

**Verificar Status:**

1. **Vercel Dashboard**
   - Vá para Settings → Crons
   - Verifique se está listado e **ativo**

2. **Verificar Execuções Anteriores**
   - Vá para Logs → Filter by `GET /api/sync/cron`
   - Procure por `200`, `206` (sucesso) ou `5xx` (erro)

3. **Teste Manual**
   ```bash
   # Simule a execução
   curl https://your-app.vercel.app/api/sync/cron
   ```

**Causas Possíveis:**

- Cron desabilitado no `.vercel` ou não deployd
- Projeto em free tier sem suporte a crons (mude para Hobby)
- Vercel DNS não configurado corretamente

---

### Problema: Muitas duplicatas sendo criadas

**Causa:** Lógica de upsert não está funcionando.

**Diagnóstico:**

```sql
-- Busque transações com mesma data, categoria e tipo
SELECT date, category, type, COUNT(*) as count
FROM transactions
WHERE source_sheet = 'Lancamentos2026'
GROUP BY date, category, type
HAVING COUNT(*) > 1
ORDER BY count DESC;
```

**Solução:**

1. Verifique se tabela tem constraint UNIQUE em `(date, category, type)`
2. Se não tiver, pode precisar limpar duplicatas manualmente
3. Contate o DBA para adicionar constraint

---

### Problema: Google Sheets API quota excedida

**Sintoma:** Erro `401 Unauthorized` ou `403 Forbidden`

**Causas:**

- Limite diário de 5 milhões de cells/dia foi excedido
- Múltiplas sincronizações rodando em paralelo

**Solução:**

1. **Verificar quota:**
   - [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Quotas
   - Filtre por "Sheets API"

2. **Aumentar quota (para Google Cloud paid projects):**
   - Settings → Quotas → Sheets API → Edit Quota
   - Aumente para > 10M cells/dia

3. **Evitar sync duplicadas:**
   - Certifique-se que apenas UM cron está configurado
   - Remova sintomas de múltiplas invocações

---

## 🧪 Testes Locais

### Teste Unitário (Validação)

```bash
npm run test -- tests/sync-cron.test.ts
```

Testa:
- Validação de datas (ISO, DD/MM/YYYY, inválidas)
- Validação de categorias
- Validação de valores
- Retry logic

### Teste Manual (Integração)

```bash
npx ts-node scripts/test-sync-cron.ts
```

Testa:
- Processamento de transações
- Comportamento de upsert
- Logging
- (Opcional) Conexão real com Google Sheets API

### Teste do Endpoint

```bash
# Local (com `npm run dev`)
curl http://localhost:3000/api/sync/cron

# Production
curl https://your-app.vercel.app/api/sync/cron
```

---

## 📈 Monitoramento

### Métricas Importantes

```sql
-- Total de transações sincronizadas
SELECT COUNT(*) as total FROM transactions WHERE source_sheet = 'Lancamentos2026';

-- Última sincronização
SELECT * FROM sync_log ORDER BY started_at DESC LIMIT 1;

-- Taxa de sucesso
SELECT
  COUNT(*) as total_syncs,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
  ROUND(100.0 * SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM sync_log
WHERE started_at > NOW() - INTERVAL '7 days';
```

### Alertas Recomendados

1. **Se sync_log.status = 'error' por > 1 dia**
   - Notifique desenvolvedor

2. **Se duration > 10 segundos**
   - Verifique se Google Sheets tem muitas linhas

3. **Se rows_processed = 0 por > 3 dias**
   - Verifique se Google Sheets ainda está conectada

---

## 🔐 Segurança

### Boas Práticas

- ✅ Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (read-only públicas)
- ✅ Não exponha `GOOGLE_SHEETS_API_KEY` no frontend
- ✅ Use RLS (Row Level Security) em Supabase para proteger dados
- ✅ Validate todas as entradas (já feito em `validateTransaction`)
- ✅ Use parameterized queries (Supabase SDK faz isso)

### Proteção contra SQL Injection

O Supabase SDK usa parameterized queries automaticamente. Exemplo seguro:

```typescript
// ✅ SEGURO - parâmetro é bindado
const { data } = await supabase
  .from('transactions')
  .select()
  .eq('category', userInput); // userInput é vinculado com segurança

// ❌ INSEGURO - nunca use string interpolation
const data = await client.query(`SELECT * FROM transactions WHERE category = '${userInput}'`);
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o log em **Vercel Dashboard → Logs**
2. Verifique `sync_log` em **Supabase → SQL**
3. Rode testes locais com `npm run test:sync`
4. Verifique variáveis de ambiente
5. Abra uma issue com logs detalhados

---

## 📝 Histórico de Mudanças

| Data | Versão | Mudança |
|------|--------|---------|
| 2026-02-20 | 1.0 | Implementação inicial |
| — | — | — |
