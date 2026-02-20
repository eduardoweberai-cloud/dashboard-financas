# PRD: Dashboard Financeiro Pessoal

**Documento:** Product Requirements Document
**Projeto:** Dashboard Financeiro Pessoal
**Data:** 2026-02-20
**Status:** ✅ Ready (Validado @po - 2026-02-20)
**PM:** Morgan (@pm)
**PO:** Pax (@po)

---

## 📋 Executive Summary

Criar um dashboard web inteligente que integre dados de uma planilha Google Sheets, oferecendo visualizações claras de saúde financeira pessoal com análises reais via IA.

O usuário hoje usa uma planilha desorganizada no Google Sheets para registrar receitas e despesas. O dashboard modernizará essa experiência, oferecendo gráficos, métricas de saúde financeira e análise inteligente via chat com IA, enquanto serve como portfólio para redes sociais (Instagram/LinkedIn).

---

## 🎯 Objetivo Geral

Transformar dados financeiros brutos (planilha) em insights visuais e análises inteligentes que:
1. Tragam **clareza visual** ao estado financeiro pessoal
2. Permitam **análise em tempo real** via chat com IA
3. Sirvam como **portfólio** de desenvolvimento web profissional
4. Sejam **atualizadas frequentemente** (sincronização diária)

---

## 👤 Usuário-Alvo

**Perfil Principal:**
- **Nome:** [Usuário Pessoal]
- **Contexto:** Empreendedor/Desenvolvedor que quer organizar melhor suas finanças
- **Goal:** Ter visão clara de receitas, despesas, economias e metas
- **Frustração:** Planilha desorganizada, sem visualizações, análise manual
- **Benefício esperado:** Dashboard profissional, análises inteligentes, uso como portfolio

**Perfil Secundário:**
- Pessoas que veem no Instagram/LinkedIn (portfolio appeal)

---

## 📊 Funcionalidades MVP (Fase 1)

### Core Features

#### 1. **Seletor de Período**
- Buttons: `[Mensal]` `[Trimestral]` `[Semestral]` `[Anual]`
- Dropdown dinâmico para seleção específica:
  - Mensal: dropdown com meses (Janeiro, Fevereiro, etc)
  - Trimestral: Q1, Q2, Q3, Q4
  - Semestral: Semestre 1, Semestre 2
  - Anual: Ano selecionado
- Comportamento: Ao mudar período, todos gráficos/dados se atualizam

#### 2. **KPIs Principais (Cards)**
Ordem: **Receitas | Despesas | Saldo**

Cada card mostra **3 linhas de informação:**

**Linha 1: Realizado (valor principal)**
- Valor em R$ (grande, destaque)
- **Variação vs período anterior** (badge com % e seta: ↑ verde / ↓ vermelho)
- Exemplo: `R$ 35.000 ↑ +5% vs mês anterior`

**Linha 2: Projetado (meta)**
- Valor planejado em cinza/subtil
- Exemplo: `Projetado: R$ 40.000`

**Linha 3: % de Realização**
- Percentual: Realizado / Projetado
- Cores: Verde (100%+), Amarelo (80-99%), Vermelho (<80%)
- Exemplo: `87.5% (economizou R$ 5.000)`

**Adicionalmente (não em card, mas visível):**
- **Taxa de Economia %**: `Poupança: R$ 12.500 (35.7% das receitas)`

#### 3. **Gráficos de Distribuição (Donuts)**
Logo abaixo dos KPIs, lado a lado:

**Donut 1: Despesas por Categoria (Realizado)**
- Cada fatia = 1 categoria
- Cada fatia mostra: nome categoria + `R$ X.XXX (XX%)`
- Exemplo: `Alimentação: R$ 8.400 (35%)`
- Cores diferentes por categoria

**Donut 2: Receitas por Categoria (Realizado)**
- Mesmo layout que despesas
- Exemplo: `Salário: R$ 33.000 (94.3%)`

**Modo Toggle (Futuro - MVP simples):**
- Usuário pode selecionar botões: `[Realizado]` `[Projetado]`
- Donuts atualizam para mostrar distribuição de Projetado vs Realizado
- Permite comparação visual de planejamento vs execução

#### 4. **Gráfico de Evolução do Saldo (Barras)**
- **Mensal:** Barras por dia do mês (01-31)
- **Trimestral/Semestral/Anual:** Barras por MÊS (comparativo mês-a-mês)
- Y-axis: Valores em R$
- X-axis: Dias (mensal) ou Meses (períodos maiores)
- Mostra evolução do saldo ao longo do tempo
- Cores: Verde (positivo) / Vermelho (negativo) ou tom único

#### 5. **Top 5 Gastos e Top 5 Entradas**
Lado a lado (2 tabelas):

**Top 5 Gastos:**
```
1. Aluguel      R$ 1.500
2. Alimentação  R$ 800
3. Transporte   R$ 450
4. Internet     R$ 250
5. Streaming    R$ 180
```

**Top 5 Entradas:**
```
1. Salário      R$ 30.000
2. Freelance    R$ 5.000
3. Bonus        R$ -
4. [vazio]      R$ -
5. [vazio]      R$ -
```

#### 6. **Metas (Progress Bar)**
Mostrar 2 metas:
- **Meta Mensal:** Quanto economizar/gastar por mês
- **Meta Anual:** Valor total a atingir (ex: R$ 50.000)

Formato:
```
Meta Mensal: R$ 2.000 restante | Anual: R$ 50.000
Progress: 45% ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Faltam: R$ 27.500 para atingir a meta anual
```

Adicionar: Comparação com meta mensal também (quanto alcançou/faltou)

#### 7. **Chat com IA (Anthropic Claude)**
- **Posição:** Flutuante no canto inferior direito
- **Comportamento:**
  - Ícone/badge que abre modal/drawer ao clicar
  - Mostra histórico de conversa (scrollable)
  - Input para digitar novas mensagens
  - Botões: Fechar, Minimizar
- **Funcionalidade:**
  - Contexto automático: IA sabe qual período está visualizando
  - Histórico de conversa (mantém memória da sessão)
  - Análises customizadas: usuário pode perguntar sobre dados
  - Exemplos de perguntas: "Qual minha categoria com maior gasto?", "Quanto economizei esse trimestre?", "Por que meu saldo caiu?", "Qual a meta mais viável?"
- **Integração Técnica Detalhada:**
  - Contexto enviado ao backend: `{ periodo: "2026-01", tipo_periodo: "mensal", kpis: {...}, categorias: {...} }`
  - Frontend envia período selecionado como payload junto à mensagem do usuário
  - Backend monta prompt com contexto: "Usuário visualizando [período]. Dados: Receitas R$X, Despesas R$Y, Projetado R$Z..."
  - IA responde com análises contextuais, comparando Realizado vs Projetado
  - Resposta salva em `chat_messages` com campo `periodo_contexto`
  - Exemplo: Pergunta: "Por que meu realizado é menor que projetado?" → IA analisa período específico e retorna insights por categoria
- **Integração:** Claude API via plano Pro Anthropic
  - Chave API: env var `ANTHROPIC_API_KEY` (token do plano Pro)
  - Modelo: `claude-3-5-sonnet` (ou superior conforme disponível)
- **Custo:** Zero incremental — uso incluído no plano Pro mensal existente

---

## 📱 Comportamento por Período

### Mensal (ex: Janeiro)
```
- KPIs: Saldo, Receitas, Despesas (do mês)
- Gráfico Saldo: Dias do mês (01-31) - evolução diária
- Top 5: Do mês específico
- Donuts: Categorização do mês
- Metas: Mensal (meta do mês) + Anual (progresso anual)
- Variação: Comparação com MÊS ANTERIOR (Jan vs Dez)
  - Exemplo: "R$ 35.000 ↑ +5% vs dezembro"
```

### Trimestral/Semestral/Anual (ex: Q1, Semestre 1, 2026)
```
- KPIs: Saldo total, Receitas, Despesas (agregadas do período)
- Gráfico Saldo: MÊS A MÊS (barras comparando cada mês)
- Top 5: Dos 3/6/12 meses agregados
- Donuts: Todas as categorias JUNTADAS (não por mês)
- Metas: Mensal (média do período) + Anual (progresso)
- Variação: Comparação com PERÍODO ANTERIOR (mesmo tipo, período anterior)
  - Exemplo Trimestral: "Q1-2026 vs Q4-2025"
  - Exemplo Semestral: "Semestre 1 2026 vs Semestre 2 2025"
  - Exemplo Anual: "2026 vs 2025 (se dados disponíveis)"
  - Fallback: Se período anterior não houver dados, variação não é exibida
```

---

## 🚀 Funcionalidades Futuro (Fase 2+)

| Feature | Descrição | Prioridade |
|---------|-----------|-----------|
| Comparação com meses anteriores | Seleção lado-a-lado de períodos | Medium |
| Filtros avançados | Por data customizada, por categoria | Medium |
| Alertas/Badges | "Ultrapassou meta!", "Poupança excelente!" | Low |
| Sazonalidade | "Gastos aumentam em fins de semana" | Low |
| Previsão simples | "Se continuar, economizará R$15k" | Low |
| Exportação de relatórios | PDF, CSV dos dados | Low |
| Categoria customizável | Criar/editar categorias | Medium |
| Sub-categorias | Quebrar categorias em sub-grupos | Low |
| Visualização anual histórica | Ver anos anteriores | Medium |

---

## 🔌 Integração Técnica

### Fluxo de Dados

```
Google Sheets (Lancamentos2026)      Google Sheets (Orçamento2026)
        ↓                                     ↓
   Google Sheets API           Google Sheets API
        ↓                                     ↓
Vercel Cron Job                    Sync Fase 0 (Uma única vez)
(diariamente)                      (ou manual se atualizar)
        ↓                                     ↓
    Supabase (PostgreSQL)
   - transactions table
   - monthly_budgets table
   - chat_messages table
        ↓
Next.js API Routes
        ↓
Frontend (React Components + Recharts)
        ↓
    Dashboard Web
        ↓
   Anthropic Claude API
        ↓
    Chat com IA
```

### Detalhes de Integração

**Fase 0: Sincronização Inicial de Metas (Uma única vez)**
- Ler planilha Orçamento2026
- Extrair valores "Projetado" por mês e categoria
- Inserir em tabela `monthly_budgets` no Supabase
- **Execução Inicial:** Script de setup durante deploy (automático uma única vez)
- **Re-sincronização (após usuário atualizar Orçamento2026):** Botão "↻ Resincronizar Metas" na Dashboard
  - Posição: Canto superior direito (próximo a seletor de período)
  - Comportamento: Clique → Lê Orçamento2026 novamente → Atualiza `monthly_budgets` → Exibe toast "Metas atualizadas com sucesso"
  - Fallback: Caso erro, exibe "Erro ao sincronizar. Verifique se Orçamento2026 está acessível"

**Google Sheets (Lancamentos2026) → Supabase:**
- Cron job Vercel sincroniza dados **diariamente** (ou maior frequência)
- Lê as colunas: Data, Tipo (Entrada/Saída), Categoria, Valor, Descrição
- Validação: Categorias conhecidas, datas válidas, valores > 0
- Normalização: categoria lowercase, data ISO format
- Upsert em Supabase transactions (atualiza se existe, insere se novo)
- Log de sincronização em `sync_log` table
- **Erro Handling:**
  - Sucesso: Registra em `sync_log` (rows_processed, rows_inserted, rows_updated)
  - Erro parcial: Registra quais linhas falharam, continua processamento
  - Erro total: Log com `status=error`, email notificado (se configurado)
  - Retry: 3 tentativas automáticas antes de marcar como falha
  - Feedback usuário: Dashboard exibe badge "⚠️ Últimos dados: [data-hora]" se sincronização falhar por > 24h

**Supabase → Frontend:**
- REST API automático (Supabase fornece)
- Realtime Subscriptions (WebSocket) para dados em tempo real
- Query por período selecionado

**Chat IA:**
- Endpoint Backend que chama Anthropic Claude API
- Envia contexto de dados (período selecionado, KPIs, todas categorias com Realizado vs Projetado)
- Histórico de conversa salvo em Supabase (messages table)
- Chave API configurável (via env var)

**Exemplos de Conversa Esperada:**

| User Input | Context Enviado | Expected Response |
|-----------|-----------------|------------------|
| "Qual minha categoria com maior gasto?" | `{periodo: "2026-01", receitas: R$35k, despesas: R$8.5k, categorias: {alimentacao: R$8.4k, ...}}` | "Sua maior despesa em janeiro é Alimentação (R$ 8.400, 35% do total). Acima da meta de R$ 7.000." |
| "Quanto economizei esse trimestre?" | `{periodo: "Q1-2026", agregado: 3 meses, receitas_total: R$105k, despesas_total: R$25k}` | "Você economizou R$ 80.000 no Q1 (76% de taxa de economia). Meta anual: R$ 50k — já atingiu 160%!" |
| "Por que meu realizado é menor que o projetado?" | `{periodo: "2026-01", receitas_realizado: R$35k, receitas_projetado: R$40k, diferenca: -R$5k}` | "Suas receitas em janeiro foram R$ 5.000 abaixo da meta. Possível causa: [Freelance: apenas R$ 2.5k vs R$ 5k projetado]. Recomendação: revisar pipeline de projetos." |
| "Qual é a tendência de gastos?" | `{periodo: "Q1-2026", mes_a_mes: {jan: R$7.5k, fev: R$8.2k, mar: R$8.9k}}` | "Seus gastos aumentaram 18% ao longo do Q1 (tendência crescente). Maior aumento em Alimentação. Recomendação: revisar decisões de consumo em março." |

---

## 🛠️ Tech Stack

| Layer | Tecnologia | Justificativa |
|-------|-----------|--------------|
| **Frontend** | Next.js 14+ (TypeScript) | Full-stack, SSR, excelente portfolio |
| **UI Components** | Shadcn/ui | Profissional, acessível, responsivo |
| **Gráficos** | Recharts | Interativo, responsivo, visual bonito |
| **Backend** | Next.js API Routes | Sem servidor extra, integrado |
| **Database** | Supabase (PostgreSQL) | Gerenciado, realtime, free tier, RLS |
| **Sync** | Google Sheets API + Vercel Cron | Automático, confiável |
| **IA** | Claude API (Plano Pro Anthropic) | Chat, análises, contexto — custo incluído no plano |
| **Deploy** | Vercel | Gratuito, Next.js nativo, rápido |
| **Auth** | Nenhuma (MVP) | Acesso pessoal local apenas |

---

## 📊 Schema Supabase (Revisado)

### Tabelas Principais

**transactions** (Lançamentos - fonte primária)
```sql
id (PK)
date (DATE) NOT NULL
type (VARCHAR: 'entrada' | 'saída') NOT NULL
category (VARCHAR) NOT NULL
value (DECIMAL(12,2)) NOT NULL
description (TEXT)
created_at (TIMESTAMP DEFAULT NOW())
updated_at (TIMESTAMP DEFAULT NOW())
synced_from_sheets (BOOLEAN DEFAULT TRUE)
sheet_row_id (INT) -- rastrear origem
```

**monthly_budgets** (Metas Projetadas - importado de Orçamento2026)
```sql
id (PK)
mes (INT: 1-12) NOT NULL
ano (INT) NOT NULL
categoria (VARCHAR) NOT NULL
tipo (VARCHAR: 'entrada' | 'saída') NOT NULL
projetado (DECIMAL(12,2)) NOT NULL
created_at (TIMESTAMP DEFAULT NOW())
updated_at (TIMESTAMP DEFAULT NOW())
UNIQUE(mes, ano, categoria, tipo) -- evita duplicatas
```

**metas** (Metas Anuais - soma do que economizar)
```sql
id (PK)
tipo (VARCHAR: 'mensal' | 'anual') NOT NULL
valor (DECIMAL(12,2)) NOT NULL
mes (INT: 1-12, nullable para anual)
ano (INT) NOT NULL
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**chat_messages** (Histórico de conversa com IA)
```sql
id (PK)
user_message (TEXT) NOT NULL
ai_response (TEXT) NOT NULL
periodo_contexto (VARCHAR) -- "2026-01" ou "Q1-2026"
created_at (TIMESTAMP DEFAULT NOW())
```

**sync_log** (Auditoria de sincronização)
```sql
id (PK)
sync_date (TIMESTAMP DEFAULT NOW())
rows_processed (INT)
rows_inserted (INT)
rows_updated (INT)
status (VARCHAR: 'success' | 'error' | 'partial')
error_message (TEXT)
```

---

## ✅ Critérios de Sucesso (MVP)

1. **Funcionalidade:**
   - [ ] Dashboard carrega dados do Google Sheets via Supabase
   - [ ] Todos os gráficos renderizam corretamente
   - [ ] Seletor de período funciona e atualiza dados
   - [ ] Chat com IA responde com contexto correto
   - [ ] Histórico de chat persiste e mantém contexto
   - [ ] KPIs mostram Realizado | Projetado | % de realização
   - [ ] Metas Projetadas sincronizam de Orçamento2026 (Fase 0)
   - [ ] % de realização calcula corretamente: Realizado / Projetado
   - [ ] Botão "↻ Resincronizar Metas" funciona e atualiza dashboard
   - [ ] Badge de erro aparece se sincronização falhar por > 24h

2. **Performance:**
   - [ ] Dashboard carrega em < 2s
   - [ ] Gráficos renderizam suavemente
   - [ ] Chat responde em < 5s (incluindo latência API)
   - [ ] Cálculos de Projetado vs Realizado são rápidos (< 500ms)
   - [ ] Resincronização Fase 0 completa em < 10s

3. **UX/Design:**
   - [ ] Layout responsivo (mobile + desktop)
   - [ ] Cores e tipografia profissionais (portfolio-ready)
   - [ ] Dados claramente legíveis
   - [ ] Diferença visual clara entre Projetado e Realizado (cores, tamanhos)
   - [ ] Toast de sucesso/erro exibido para ações de re-sincronização

4. **Data:**
   - [ ] Sincronização diária funciona automaticamente
   - [ ] Sincronização Fase 0 (Orçamento2026) funciona corretamente
   - [ ] Variações de período anterior calculadas corretamente (mensal vs mês anterior, trimestral vs trimestre anterior, etc)
   - [ ] Metas Projetadas e Realizadas conferem com Google Sheets
   - [ ] Sync_log registra sucesso/erro corretamente

---

## 🧪 Plano de Testes de Integração (Detalhado)

### Testes Críticos (MUST-PASS)

**1. Google Sheets API Integration**
- [ ] Mock Google Sheets API: Mock leitura de Lancamentos2026 com 10 lançamentos de teste
- [ ] Mock leitura de Orçamento2026: 12 meses x 30 categorias (metas Projetadas)
- [ ] Teste: Dados carregados no Supabase conferem com Google Sheets

**2. Realizado vs Projetado (KPIs)**
- [ ] Teste caso Realizado = Projetado (100%, verde)
- [ ] Teste caso Realizado < Projetado (80%, amarelo)
- [ ] Teste caso Realizado > Projetado (120%, verde)
- [ ] Verificar: % de realização calcula exatamente: (Realizado / Projetado) * 100

**3. Variações de Período Anterior**
- [ ] Mensal: Janeiro (R$ 35k) vs Dezembro (R$ 33k) = +5%
- [ ] Trimestral: Q1-2026 (R$ 100k) vs Q4-2025 (R$ 95k) = +5%
- [ ] Semestral: S1-2026 vs S2-2025 (se dados existem)
- [ ] Anual: 2026 vs 2025 (se dados históricos existem)

**4. Chat IA com Contexto**
- [ ] User pergunta em Mensal: "Qual categoria maior gasto?"
  - Backend envia contexto: `{periodo: "2026-01", type: "mensal", ...}`
  - IA retorna: "Alimentação: R$ 8.400 (35%)" — resposta correta para janeiro
- [ ] User pergunta em Trimestral: "Quanto economizei?"
  - Backend envia contexto agregado de Q1
  - IA calcula: Receitas - Despesas = saldo trimestral
- [ ] Histórico mantém contexto entre mensagens

**5. Re-sincronização Fase 0**
- [ ] Clique em botão "↻ Resincronizar Metas"
- [ ] Novos dados de Orçamento2026 carregados
- [ ] Tabela `monthly_budgets` atualizada
- [ ] KPIs refletem novas metas Projetadas
- [ ] Toast exibido: "Metas atualizadas com sucesso"

**6. Erro Handling**
- [ ] Sincronização falha (API indisponível):
  - Registra em `sync_log` (status=error)
  - Badge "⚠️ Últimos dados: [data-hora]" aparece
- [ ] Retry automático funciona (3 tentativas)
- [ ] Usuário informado após 24h sem sincronização

### Testes Adicionais (SHOULD-PASS)
- [ ] Gráficos (Donuts, Barras) renderizam dados corretos
- [ ] Top 5 Gastos/Entradas ordenados descendo
- [ ] Responsividade em mobile (viewport < 640px)
- [ ] Metas com Progress Bar exibem porcentagem corretamente

---

## 🎯 Scope - IN vs OUT

### IN (Dentro do Escopo MVP)
- ✅ Dashboard com visualizações de receitas/despesas (Realizado)
- ✅ Seletor de períodos (mensal, trimestral, semestral, anual)
- ✅ Gráficos: Donuts (categorias) + Barras (evolução saldo)
- ✅ Top 5 gastos e entradas
- ✅ Metas mensal/anual com progress (meta anual de economia)
- ✅ **Projetado vs Realizado** nos KPIs
- ✅ **% de Realização** (Realizado / Projetado) nos KPIs
- ✅ **Sincronização de Orçamento2026** (Fase 0 - metas Projetadas)
- ✅ Taxa de economia %
- ✅ Variação vs período anterior
- ✅ Chat com IA (contexto de dados, pode perguntar sobre Projetado vs Realizado)
- ✅ Integração Google Sheets (ambas) → Supabase
- ✅ Sincronização diária (Lancamentos2026)
- ✅ Suporta categorias da planilha

### OUT (Fora do Escopo MVP - Futuro)
- ❌ Login/Autenticação multi-user
- ❌ Comparação lado-a-lado de períodos
- ❌ Filtros avançados (data customizada, múltiplas categorias)
- ❌ Alertas/notificações (ex: "Ultrapassou meta!")
- ❌ Exportação de relatórios (PDF, CSV)
- ❌ Previsão inteligente de saldo
- ❌ Interface para criar/editar metas no dashboard (usuário edita em Orçamento2026)
- ❌ Sub-categorias
- ❌ Dashboard escrever de volta na planilha
- ❌ Toggle Realizado/Projetado nos Donuts (será adicionado depois)

---

## ⚠️ Dependências & Restrições

### Dependências Externas
1. **Google Sheets API** - Requer OAuth2, chave de API (Lancamentos2026 + Orçamento2026)
2. **Supabase** - Requer projeto criado, chaves públicas/privadas
3. **Claude API (Plano Pro Anthropic)** - Requer chave de API do plano Pro (modelo: claude-3-5-sonnet ou superior)
4. **Vercel** - Para deploy e cron jobs

### Restrições Técnicas
1. **Custo Zero:** Usar apenas free tiers para Supabase, Vercel. Claude API via plano Pro Anthropic — custo incluído no plano mensal existente
2. **Atualização diária:** Cron job roda 1x por dia (Vercel tem limite free)
3. **Histórico:** Chat salva em Supabase (limite de storage)
4. **Realtime:** Supabase Realtime pode ter latência pequena
5. **Sincronização Orçamento2026:** Fase 0 é manual (via botão) — metas mudam com menos frequência que transações

### Análise de Viabilidade: Estrutura Google Sheets

**✅ O que funciona bem:**
- Estrutura Lancamentos2026 é excelente para migração (normalizada, simples)
- Orçamento2026 tem dados Projetado bem organizados por mês/categoria
- Google Sheets API consegue ler ambas as planilhas confiável
- Supabase consegue armazenar e calcular tudo eficientemente

**⚠️ Considerações técnicas:**
- Categorias case-sensitive em Google Sheets → Normalizar lowercase
- Range fixo (~9.996 linhas) → Subabase sem limite, melhor escalabilidade
- Fórmulas SUMPRODUCT em Google Sheets → Reimplementar como queries SQL (mais rápido)

**🔄 Estratégia de Migração:**
1. **Fase 0:** Sincronizar metas de Orçamento2026 (única vez na setup)
2. **Diariamente:** Sincronizar lançamentos de Lancamentos2026 (Vercel Cron)
3. **Dashboard:** Calcula Projetado vs Realizado em SQL/backend

---

### ⚠️ Observações de Segurança e Privacidade

**MVP (Sem Autenticação):**
- Dashboard é **acesso pessoal local apenas** — não há login multi-user
- Dados financeiros são **públicos na Supabase** (sem Row Level Security ativa)
- **IMPORTANTE:** MVP destina-se a demo pessoal/portfolio apenas
- **NÃO recomendado** compartilhar em produção pública sem autenticação

**Roadmap Segurança (Phase 1.1):**
- [ ] Adicionar autenticação (Supabase Auth com Google/GitHub)
- [ ] RLS (Row Level Security) na Supabase
- [ ] Chaves API separadas (Google Sheets API key, Anthropic API key) com acesso restrito
- [ ] Criptografia de dados sensíveis em repouso
- [ ] Audit log de acessos

**Para Fase 1 (Demo Pessoal):** Deployer deve entender riscos de dados públicos e aceitar.

---

## 📈 Métricas de Sucesso

| Métrica | Target |
|---------|--------|
| Tempo de carregamento | < 2s |
| Taxa de uptime | 99% |
| Latência chat IA | < 5s |
| Sincronização Google Sheets | 100% sucesso diário |
| Responsividade | Funcional em mobile + desktop |

---

## 📅 Estimativa de Esforço

| Atividade | Esforço Estimado |
|-----------|-----------------|
| Setup Supabase + Google Sheets API | 4-6h |
| Sincronização Lancamentos2026 (Fase 0 + Cron) | 4-6h |
| Sincronização Orçamento2026 (Fase 0 - metas Projetadas) | 2-3h |
| Frontend Dashboard (componentes) | 14-18h |
| KPIs com Projetado + Realizado + % | 4-5h |
| Gráficos (Recharts integração) | 6-8h |
| Chat IA (backend + frontend) | 6-8h |
| Validação + Testes integração | 6-8h |
| **TOTAL** | **46-62h** |

---

## 💾 Sincronização de Orçamento2026 (Fase 0)

### Mapeamento de Categorias

**Entradas (Orçamento2026 linhas 5-13):**
```
F5 IA → f5_ai
F5 → f5
Pilar AI (AI) → ai_pilar
SPR → spr
Clientes → clientes
Renda Extra → renda_extra
Proventos → proventos
Cashback / Racha → cashback_racha
Outras → outros_entrada
```

**Despesas (Orçamento2026 linhas 17-37):**
```
Moradia → moradia
Faculdade → faculdade
Gasolina → gasolina
Corpo → corpo
Estudos → estudos
Saúde → saude
Livros → livros
Cuidados Pessoais → cuidados_pessoais
Alimentação → alimentacao
Mercado → mercado
Compras → compras
Lazer → lazer
Assinaturas → assinaturas
IA → ia
Ofertas → ofertas
Doações → doacoes
Presentes → presentes
Carro (Outros) → carro_outros
Transporte → transporte
Impostos → impostos
Outras → outros_saida
```

### Fluxo de Sincronização Fase 0

```
1. Ler Orçamento2026
2. Para cada mês (1-12):
   - Para cada categoria (Receitas + Despesas):
     - Extrair valor "Projetado" (coluna)
     - Normalizar categoria (lowercase)
     - Inserir em monthly_budgets:
       {mes, ano=2026, categoria, tipo, projetado}
3. Salvar log de sucesso
4. Usuário pode re-sincronizar se atualizar metas
```

### Cálculo de % de Realização

```javascript
// Backend Query
SELECT
  mb.categoria,
  mb.projetado,
  COALESCE(SUM(t.value), 0) as realizado,
  ROUND((COALESCE(SUM(t.value), 0) / mb.projetado * 100), 2) as percentual_realizado
FROM monthly_budgets mb
LEFT JOIN transactions t ON
  mb.categoria = t.category
  AND mb.tipo = t.type
  AND MONTH(t.date) = mb.mes
  AND YEAR(t.date) = mb.ano
WHERE mb.mes = $1 AND mb.ano = 2026
GROUP BY mb.categoria, mb.projetado
```

### Exibição no Dashboard

**KPI Card (exemplo Receitas):**
```
┌─────────────────────────────────┐
│ RECEITAS                        │
├─────────────────────────────────┤
│ R$ 35.000 ↑ +5% vs mês ant.     │
│ Projetado: R$ 40.000            │
│ 87.5% ✓ (R$ 5k economizados)   │
└─────────────────────────────────┘

Cores:
- Verde: > 100% da meta
- Amarelo: 80-99% da meta
- Vermelho: < 80% da meta
```

**Tabela de Comparação (Futuro, mas visibilidade):**
```
Categoria      Projetado  Realizado  %       Diferença
─────────────────────────────────────────────────────
Salário        R$ 30k     R$ 30k     100%    0
Freelance      R$ 5k      R$ 2.5k    50%     -R$ 2.5k
Bonus          R$ -       R$ 3k      ∞       +R$ 3k
```

---

## 🎨 Visual Reference

Ver arquivo separado: `docs/design/dashboard-wireframe.md` (será criado em fase de design)

---

## 📝 Próximos Passos

1. **@po (Pax):** Validar PRD com checklist de 10 pontos
2. **@sm (River):** Quebrar em stories para desenvolvimento
3. **@dev (Dex):** Implementar conforme stories
4. **@qa (QA Agent):** Testar e validar gates de qualidade

---

## 👥 Stakeholders

| Papel | Nome | Responsabilidade |
|------|------|-----------------|
| Product Manager | Morgan (@pm) | Escreveu este PRD |
| Product Owner | Pax (@po) | Validará PRD |
| Story Manager | River (@sm) | Criará stories |
| Developer | Dex (@dev) | Implementará |
| QA | QA Agent (@qa) | Testará |

---

## 📋 Histórico de Mudanças

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-02-20 | Morgan (@pm) | PRD inicial criado (Draft) |
| 2026-02-20 | Morgan (@pm) | Adicionado Projetado vs Realizado, sincronização Orçamento2026 (Fase 0), tabela monthly_budgets, mapeamento categorias |
| 2026-02-20 | Pax (@po) | **v1.2 Refinement:** Detalhado fluxo contexto IA com payload examples; adicionado UI/UX para re-sincronização Fase 0 (botão, toast); clarificado variação por período anterior (mensal vs anterior, trimestral vs anterior); adicionado erro handling com badge de alertas; expandido plano testes integração (6 testes críticos); adicionados exemplos de conversa IA esperada; aumentada visibilidade custos API Anthropic; adicionadas observações segurança/privacidade para MVP sem auth |
| 2026-02-20 | Pax (@po) | **v1.2.1 API Update:** Alterado de "Anthropic API own key" para "Claude API via Plano Pro Anthropic" — custo zero incremental, usa token do plano Pro existente do usuário |

---

**Status:** ✅ Ready (Validado @po)
**Última atualização:** 2026-02-20
**Documento:** Dashboard Financeiro Pessoal v1.2.1 (Ready para quebra de Stories)
