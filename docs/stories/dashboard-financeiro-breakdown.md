# Story Breakdown: Dashboard Financeiro Pessoal

**Baseado em:** PRD Dashboard Financeiro Pessoal v1.2.1
**Data:** 2026-02-20
**Criado por:** Pax (@po)
**Status:** Breakdown Planejado (Aguardando @sm para criar stories oficiais)

---

## 📋 Visão Geral da Quebra

**Total de Stories:** 10 principais
**Sequência:** Dependência de infraestrutura → Backend → Frontend → Integração IA
**Estimativa Total:** 46-62h (alinhado com PRD)

---

## 🎯 Story 1: Setup Supabase & Google Sheets API

**Objetivo:** Configurar infraestrutura de dados

**Descrição:**
- Criar projeto Supabase (db, tabelas, chaves)
- Configurar Google Sheets API (OAuth2, scope de leitura)
- Validar conexão bidirecional

**Acceptance Criteria (AC):**
- [ ] Supabase criado com tabelas: `transactions`, `monthly_budgets`, `chat_messages`, `sync_log`
- [ ] Google Sheets API configurada e autenticada
- [ ] Teste: Ler dados de Lancamentos2026 via API
- [ ] Teste: Ler dados de Orçamento2026 via API
- [ ] Documentar: Variáveis de ambiente (.env.example)

**Scope:**
- **IN:** Setup infra, migrations, validação de conexão
- **OUT:** Dados sincronizados (será outra story)

**Estimativa:** 4-6h
**Bloqueador:** Nenhum
**Bloqueia:** Stories 2, 3, 4

---

## 🔄 Story 2: Sincronização Fase 0 (Orçamento2026 → Supabase)

**Objetivo:** Importar metas projetadas (uma única vez)

**Descrição:**
- Script que lê Orçamento2026
- Mapeia 9 categorias entrada + 21 categoria saída
- Insere em `monthly_budgets` (normalizado)
- Registra em `sync_log`

**Acceptance Criteria (AC):**
- [ ] Script executa sem erros
- [ ] 12 meses × 30 categorias = ~360 linhas em `monthly_budgets`
- [ ] Categorias normalizadas (lowercase)
- [ ] Re-sincronização possível (limpa + insere novamente)
- [ ] Log de sucesso em `sync_log`

**Scope:**
- **IN:** Sincronização Fase 0, normalizações, logging
- **OUT:** Cron diário (Story 3), UI do botão (Story 5)

**Estimativa:** 2-3h
**Bloqueador:** Story 1
**Bloqueia:** Stories 5, 6

---

## 📊 Story 3: Sincronização Cron Diária (Lancamentos2026 → Supabase)

**Objetivo:** Manter transações atualizadas automaticamente

**Descrição:**
- Vercel Cron job roda 1x/dia
- Lê Lancamentos2026
- Upsert em `transactions` (valida, normaliza)
- Log sucesso/erro em `sync_log`
- Retry automático 3x em caso de erro

**Acceptance Criteria (AC):**
- [ ] Cron job configurado no Vercel (via vercel.json)
- [ ] Leitura de 5 colunas: Data, Tipo, Categoria, Valor, Descrição
- [ ] Validação: categoria conhecida, data válida, valor > 0
- [ ] Upsert funciona (atualiza se existe, insere se novo)
- [ ] Teste: 10 transações inseridas/atualizadas corretamente
- [ ] Log registra: rows_processed, rows_inserted, rows_updated, status
- [ ] Retry automático 3x antes de marcar erro

**Scope:**
- **IN:** Cron diário, validação, upsert, logging
- **OUT:** Badge de erro (Story 7), alertas (Phase 2)

**Estimativa:** 4-6h
**Bloqueador:** Story 1
**Bloqueia:** Stories 5, 6, 7, 8

---

## 🎨 Story 4: Layout Base & Componentes UI (Shadcn/ui)

**Objetivo:** Criar estrutura visual do dashboard

**Descrição:**
- Setup Next.js TypeScript
- Integrar Shadcn/ui
- Criar layouts responsivos (desktop + mobile)
- Componentes base: Card, Button, Badge, Progress

**Acceptance Criteria (AC):**
- [ ] Projeto Next.js 14+ rodando localmente
- [ ] Shadcn/ui instalado e funcionando
- [ ] Layout principal responsivo (breakpoints: mobile < 640px, tablet 640-1024px, desktop > 1024px)
- [ ] Componentes de card, button, badge criados e estilizados
- [ ] Typography profissional (portfolio-ready)
- [ ] Dark/light mode suportado (se aplicável)

**Scope:**
- **IN:** Setup, layout, componentes base
- **OUT:** Componentes específicos (gráficos, KPIs — outras stories)

**Estimativa:** 3-4h
**Bloqueador:** Nenhum
**Bloqueia:** Stories 5, 6, 7, 8

---

## 📈 Story 5: KPIs (Cards Receitas | Despesas | Saldo)

**Objetivo:** Exibir métricas principais com Realizado | Projetado | %

**Descrição:**
- 3 cards lado a lado
- Cada card com 3 linhas:
  - Linha 1: R$ (Realizado) + Variação vs período anterior
  - Linha 2: Projetado: R$ (cinza)
  - Linha 3: % de realização (verde/amarelo/vermelho)
- Cores: Verde (100%+), Amarelo (80-99%), Vermelho (<80%)

**Acceptance Criteria (AC):**
- [ ] 3 cards exibidos lado a lado (Receitas, Despesas, Saldo)
- [ ] Linha 1: Valor grande + badge % variação (↑ verde / ↓ vermelho)
- [ ] Linha 2: Projetado em cinza, subtil
- [ ] Linha 3: % realização com cores corretas
- [ ] Cálculo: % = (Realizado / Projetado) * 100
- [ ] Teste: Janeiro Receitas R$35k realizado vs R$40k projetado = 87.5%
- [ ] Responsivo: Cards empilham em mobile

**Scope:**
- **IN:** Cards KPIs, cálculos, cores
- **OUT:** Seletor de período (Story 6), taxa de economia (Story 7)

**Estimativa:** 4-5h
**Bloqueador:** Stories 1, 4
**Bloqueia:** Stories 6, 7, 8

---

## 🎛️ Story 6: Seletor de Período (Mensal | Trimestral | Semestral | Anual)

**Objetivo:** Permitir navegar entre períodos e atualizar todos dados

**Descrição:**
- Buttons: [Mensal] [Trimestral] [Semestral] [Anual]
- Dropdown dinâmico:
  - Mensal: meses (Janeiro, Fevereiro, etc)
  - Trimestral: Q1, Q2, Q3, Q4
  - Semestral: Semestre 1, Semestre 2
  - Anual: Ano selecionado
- Ao mudar: KPIs, gráficos, top 5, metas atualizam

**Acceptance Criteria (AC):**
- [ ] Buttons exibem 4 opções (Mensal, Trimestral, Semestral, Anual)
- [ ] Dropdown dinâmico aparece ao selecionar tipo
- [ ] Mensal dropdown: 12 meses com labels em português
- [ ] Trimestral dropdown: Q1, Q2, Q3, Q4
- [ ] Semestral dropdown: Semestre 1, Semestre 2
- [ ] Anual dropdown: Anos disponíveis nos dados
- [ ] Clique atualiza estado React
- [ ] Teste: Selecionar Janeiro → KPIs mostram dados de janeiro
- [ ] Teste: Selecionar Q1 → KPIs agregam jan+fev+mar

**Scope:**
- **IN:** Seletor UI, lógica de mudança de período
- **OUT:** Backend query otimizado (ser executado em KPIs/Gráficos)

**Estimativa:** 3-4h
**Bloqueador:** Stories 1, 4, 5
**Bloqueia:** Stories 7, 8, 9, 10

---

## 📊 Story 7: Gráficos (Donuts Categorias + Barras Evolução)

**Objetivo:** Visualizar distribuição e evolução de saldo

**Descrição:**
- **Donut 1: Despesas por Categoria** (Realizado)
  - Cada fatia = categoria
  - Label: "Alimentação: R$ 8.400 (35%)"
- **Donut 2: Receitas por Categoria** (Realizado)
  - Mesmo layout
- **Barras: Evolução de Saldo**
  - Mensal: dias do mês (01-31)
  - Trimestral/Semestral/Anual: mês-a-mês
  - Y-axis: R$, X-axis: dias/meses
  - Cores: Verde (positivo), Vermelho (negativo)

**Acceptance Criteria (AC):**
- [ ] Donuts renderizam com Recharts
- [ ] Cada fatia tem label + valor + %
- [ ] Cores diferentes por categoria
- [ ] Gráfico barras exibe corretamente por período
- [ ] Mensal: 31 barras (dias)
- [ ] Trimestral: 3 barras (meses de Q1)
- [ ] Teste: Janeiro mensal mostra 31 barras
- [ ] Teste: Q1 trimestral mostra 3 barras (jan, fev, mar)
- [ ] Responsivo: Gráficos ajustam width em mobile

**Scope:**
- **IN:** Gráficos Donuts + Barras, Recharts integração
- **OUT:** Toggle Realizado/Projetado nos Donuts (Phase 2)

**Estimativa:** 6-8h
**Bloqueador:** Stories 1, 4, 6
**Bloqueia:** Stories 9, 10

---

## 🏆 Story 8: Top 5 Gastos & Top 5 Entradas

**Objetivo:** Exibir maiores transações em tabelas lado a lado

**Descrição:**
- **Top 5 Gastos:** Tabela com despesas maiores ordenadas descendo
- **Top 5 Entradas:** Tabela com receitas maiores ordenadas descendo
- Formato: `Categoria | R$ Valor`
- Se < 5 entradas, exibir vazios

**Acceptance Criteria (AC):**
- [ ] 2 tabelas lado a lado (Top 5 Gastos | Top 5 Entradas)
- [ ] Ordenação: maior para menor (descending)
- [ ] Teste: Mensais mostra top 5 do mês
- [ ] Teste: Trimestral mostra top 5 agregado de 3 meses
- [ ] Linhas vazias se < 5 entradas
- [ ] Responsivo: Tabelas empilham em mobile

**Scope:**
- **IN:** Tabelas, lógica top 5, formatação
- **OUT:** Filtros avançados (Phase 2)

**Estimativa:** 3-4h
**Bloqueador:** Stories 1, 4, 6
**Bloqueia:** Story 10

---

## 🎯 Story 9: Metas (Progress Bar Mensal + Anual)

**Objetivo:** Exibir progresso contra metas de economia

**Descrição:**
- Meta Mensal: Quanto economizar/mês
- Meta Anual: R$ 50.000 (exemplo)
- Progress bar com % visual
- Texto: "R$ X restante | Progresso: Y%"

**Acceptance Criteria (AC):**
- [ ] Progress bar exibido com valor numérico (%)
- [ ] Meta Mensal calculada: Receitas - Despesas do período
- [ ] Meta Anual mostra progresso de economia YTD
- [ ] Cores: Verde se atingiu, Amarelo se 80-99%, Vermelho se <80%
- [ ] Teste: Economizou R$ 12.5k em janeiro vs meta R$ 10k = 125% (verde)
- [ ] Comparação com meta mensal também exibida

**Scope:**
- **IN:** Progress bars, cálculos de meta
- **OUT:** Alertas "Meta atingida!" (Phase 2)

**Estimativa:** 3-4h
**Bloqueador:** Stories 1, 4, 6, 5
**Bloqueia:** Story 10

---

## 💬 Story 10: Chat com IA (Claude API Plano Pro)

**Objetivo:** Análises inteligentes com contexto de dados

**Descrição:**
- Flutuante canto inferior direito
- Modal/drawer ao clicar
- Input para mensagens
- Histórico scrollable
- Contexto automático: período selecionado
- Respostas análise de Realizado vs Projetado

**Acceptance Criteria (AC):**
- [ ] Chat widget flutuante exibido
- [ ] Clique abre modal/drawer
- [ ] Input + botão enviar funciona
- [ ] Histórico mantém mensagens prévias
- [ ] Backend envia contexto: `{periodo, kpis, categorias}`
- [ ] Claude API responde com análises contextuais
- [ ] Teste: User pergunta "Qual categoria maior gasto?" → IA retorna categoria + R$ + %
- [ ] Teste: User pergunta "Quanto economizei?" → IA calcula Receitas - Despesas
- [ ] Histórico salvo em `chat_messages` com campo `periodo_contexto`
- [ ] Latência resposta < 5s

**Scope:**
- **IN:** Chat UI, backend endpoint, Claude API integração, histórico
- **OUT:** Análise de tendências (Phase 2), sazonalidade (Phase 2)

**Estimativa:** 6-8h
**Bloqueador:** Stories 1, 4, 6
**Bloqueia:** Nenhuma (final da Fase 1)

---

## 🔧 Story 11: Sincronização Fase 0 - UI (Botão + Toast)

**Objetivo:** Permitir re-sincronização de metas manualmente

**Descrição:**
- Botão "↻ Resincronizar Metas" (canto superior direito)
- Clique dispara Story 2 (script sincronização)
- Toast feedback: "Metas atualizadas com sucesso" ou "Erro ao sincronizar"
- Fallback se Orçamento2026 inacessível

**Acceptance Criteria (AC):**
- [ ] Botão visível e acessível (canto superior direito)
- [ ] Clique dispara sincronização (Story 2)
- [ ] Loading spinner enquanto sincroniza
- [ ] Toast exibido: sucesso ou erro
- [ ] Timeout: 30s máximo
- [ ] KPIs e gráficos atualizam após sucesso
- [ ] Erro tratado: usuário vê mensagem clara

**Scope:**
- **IN:** Botão UI, toast, chamada backend
- **OUT:** Integração com Vercel Cron (já em Story 3)

**Estimativa:** 2-3h
**Bloqueador:** Stories 1, 2, 4, 5
**Bloqueia:** Nenhuma

---

## 🚨 Story 12: Badge de Erro & Alertas de Sincronização

**Objetivo:** Avisar usuário se dados estão desatualizados

**Descrição:**
- Badge "⚠️ Últimos dados: [data-hora]" se sincronização falha > 24h
- Exibido no canto superior direito (próximo a Resincronizar)
- Cores: Amarelo (< 48h), Vermelho (> 48h)

**Acceptance Criteria (AC):**
- [ ] Badge exibido se última sincronização > 24h
- [ ] Tooltip mostra data/hora últimaática sincronização sucesso
- [ ] Cor amarela: 24-48h desatualizado
- [ ] Cor vermelha: > 48h desatualizado
- [ ] Clique na badge = tenta resincronizar (Story 11)
- [ ] Desaparece quando sincronização bem-sucedida

**Scope:**
- **IN:** Badge UI, lógica de check de tempo
- **OUT:** Email alertas (Phase 2)

**Estimativa:** 2-3h
**Bloqueador:** Stories 1, 3
**Bloqueia:** Nenhuma

---

## 📊 Sequência de Desenvolvimento Recomendada

```
1. Story 1 (Setup Supabase + Google Sheets API)
   ↓
2. Story 4 (Layout Base & Componentes UI)
   ↓
3. Story 2 (Sincronização Fase 0) + Story 3 (Cron Diária) [Paralelo]
   ↓
4. Story 5 (KPIs) + Story 6 (Seletor Período) [Paralelo]
   ↓
5. Story 7 (Gráficos) + Story 8 (Top 5) + Story 9 (Metas) [Paralelo]
   ↓
6. Story 10 (Chat IA)
   ↓
7. Story 11 (Botão Resincronizar) + Story 12 (Badge Erro) [Paralelo]
   ↓
8. ✅ MVP Completo
```

---

## 📋 Resumo de Estimativas

| Story | Horas | Sequência |
|-------|-------|-----------|
| 1 | 4-6h | 1º |
| 2 | 2-3h | 3º |
| 3 | 4-6h | 3º |
| 4 | 3-4h | 2º |
| 5 | 4-5h | 4º |
| 6 | 3-4h | 4º |
| 7 | 6-8h | 5º |
| 8 | 3-4h | 5º |
| 9 | 3-4h | 5º |
| 10 | 6-8h | 6º |
| 11 | 2-3h | 7º |
| 12 | 2-3h | 7º |
| **TOTAL** | **46-62h** | — |

---

## 🎯 Próximos Passos

1. **@sm (River):** Validar esta quebra, criar 12 stories oficiais em `docs/stories/`
2. **@dev (Dex):** Trabalhar conforme sequência acima
3. **@qa (Quinn):** Preparar teste plan baseado em AC de cada story

---

**Documento preparado por:** Pax (@po)
**Status:** Ready para @sm criar stories oficiais
**Data:** 2026-02-20

