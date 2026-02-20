# 📚 Stories Index — Dashboard Financeiro MVP

**All 12 Stories** | **Status: Ready for Development** | **Updated: 2026-02-20**

---

## 📊 OVERVIEW

| Epic | Stories | Total | Status |
|------|---------|-------|--------|
| **Epic 1** | 1.1, 1.2, 1.3 | 3 | ✅ Ready |
| **Epic 2** | 2.1-2.9 | 9 | ✅ Ready |
| **TOTAL** | **12** | **42-58h** | **✅ Ready** |

---

## 🎬 EPIC 1: INFRAESTRUTURA DE DADOS (3 Stories)

### **1.1: Setup Supabase & Google Sheets API** ✅ Ready
- **Objective:** Configurar infraestrutura base (Supabase, Google Sheets API)
- **Complexity:** High | **Points:** 8-10 | **Hours:** 4-6h
- **Status:** Draft → **Ready**
- **Dependencies:** ❌ Nenhum (bloqueador de 9 histórias)
- **File:** `docs/stories/1.1.story.md`
- **AC:** 14 critérios (tabelas, conexões bidirecionais, setup .env)
- **Key:** Supabase migrations SQL, Google Sheets OAuth2
- **Go/No-Go:**
  - ✅ Projeto Supabase criado
  - ✅ 5 tabelas com schema + índices
  - ✅ Google Sheets API testada (OAuth2)
  - ✅ `.env.example` + `.env.local` setup

---

### **1.2: Sincronização Fase 0 (Orçamento2026 → Supabase)** ✅ Ready
- **Objective:** Importar metas do Orçamento2026 uma única vez
- **Complexity:** Medium | **Points:** 5-7 | **Hours:** 2-3h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1 (Supabase setup)
- **File:** `docs/stories/1.2.story.md`
- **AC:** 10 critérios (leitura Orçamento2026, mapeamento 30 categorias, 360 linhas)
- **Key:** Script sincronização, validação dados, re-sync (DELETE + INSERT)
- **Go/No-Go:**
  - ✅ Script lê Orçamento2026 com 30 categorias
  - ✅ 360 linhas inseridas em `monthly_budgets`
  - ✅ Re-sincronização sem duplicatas
  - ✅ Log em `sync_log` table

---

### **1.3: Sincronização Cron Diária (Lancamentos2026 → Supabase)** ✅ Ready
- **Objective:** Implementar sincronização automática diária via Vercel Cron Job
- **Complexity:** High | **Points:** 8-10 | **Hours:** 4-6h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1 (Supabase + Google Sheets API)
- **File:** `docs/stories/1.3.story.md`
- **AC:** 11 critérios (Vercel Cron Job, upsert, retry 3x automático)
- **Key:** `/api/sync/cron` endpoint, retry logic, timestamp ISO, upsert by sheet_row_id
- **Go/No-Go:**
  - ✅ Vercel Cron Job em vercel.json
  - ✅ `/api/sync/cron` rota funcionando
  - ✅ Upsert de transações + evita duplicatas
  - ✅ Retry automático 3x antes de erro
  - ✅ Log estruturado em `sync_log`

---

## 🎨 EPIC 2: DASHBOARD UI & FUNCIONALIDADES (9 Stories)

### **2.1: Layout Base & Componentes UI (Shadcn/ui)** ✅ Ready
- **Objective:** Setup visual base com componentes reutilizáveis
- **Complexity:** Medium | **Points:** 6-8 | **Hours:** 3-4h
- **Status:** Draft → **Ready**
- **Dependencies:** ❌ Nenhum (pode ser paralelo com 1.1)
- **File:** `docs/stories/2.1.story.md`
- **AC:** 13 critérios (Next.js 14, TypeScript, Tailwind, dark mode, responsividade)
- **Key:** Shadcn/ui components, layout groups ((dashboard)), design tokens, typography
- **Go/No-Go:**
  - ✅ Next.js 14 com App Router
  - ✅ Tailwind CSS + dark mode
  - ✅ Shadcn/ui base components (Card, Button, Badge, Progress, Input, Tabs)
  - ✅ Responsividade mobile/tablet/desktop
  - ✅ Design tokens aplicados

---

### **2.2: KPIs (Cards Receitas | Despesas | Saldo)** ✅ Ready
- **Objective:** Exibir métricas principais com Realizado, Projetado, % realização
- **Complexity:** Medium | **Points:** 6-8 | **Hours:** 4-5h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 1.3 (dados) + 2.1 (layout)
- **File:** `docs/stories/2.2.story.md`
- **AC:** 13 critérios (3 cards, badge variação, % com cores, formatação BRL)
- **Key:** KPICard component, KPISection container, `/api/dashboard` endpoint, colors by percentage
- **Go/No-Go:**
  - ✅ 3 cards lado a lado (Receitas, Despesas, Saldo)
  - ✅ Cálculo % realização com cores (verde/amarelo/vermelho)
  - ✅ Badge de variação vs período anterior
  - ✅ Formatação currency BRL
  - ✅ Responsivo + skeleton loading

---

### **2.3: Seletor de Período (Mensal | Trimestral | Semestral | Anual)** ✅ Ready
- **Objective:** Implementar seletor dinâmico de período para filtrar dados
- **Complexity:** Medium | **Points:** 5-7 | **Hours:** 3-4h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 2.1 (layout)
- **File:** `docs/stories/2.3.story.md`
- **AC:** 13 critérios (4 tipo período, dropdown dinâmico, Context, keyboard a11y)
- **Key:** PeriodContext, DashboardHeader component, dropdown opções, localStorage persistence
- **Go/No-Go:**
  - ✅ PeriodContext criado (estado global)
  - ✅ Buttons + dropdown dinâmico
  - ✅ Default = período atual
  - ✅ Keyboard navigation (arrow keys, Enter)
  - ✅ Visual feedback período selecionado

---

### **2.4: Gráficos (Donuts Categorias + Barras Evolução)** ✅ Ready
- **Objective:** Visualizar distribuição de categorias e evolução de saldo
- **Complexity:** High | **Points:** 10-12 | **Hours:** 6-8h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 1.3 (dados) + 2.1 (layout) + 2.3 (período)
- **File:** `docs/stories/2.4.story.md`
- **AC:** 13 critérios (Recharts donuts + bar chart, tooltips, responsivo, performance < 500ms)
- **Key:** Recharts integration, DistributionCharts + BalanceChart, data aggregation, color palette
- **Go/No-Go:**
  - ✅ 2 Donuts (Receitas + Despesas) com labels
  - ✅ Bar Chart evolução de saldo
  - ✅ Mensal: 31 barras (1 por dia)
  - ✅ Trimestral/Semestral/Anual: agregação correta
  - ✅ Responsivo + performance < 500ms

---

### **2.5: Top 5 Gastos & Top 5 Entradas** ✅ Ready
- **Objective:** Exibir maiores transações em tabelas lado a lado
- **Complexity:** Low-Medium | **Points:** 5-6 | **Hours:** 3-4h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 1.3 (dados) + 2.1 (layout)
- **File:** `docs/stories/2.5.story.md`
- **AC:** 12 critérios (2 tabelas, ordenação descending, BRL formatting, zebra stripes)
- **Key:** TopMovements component, TopTable reusável, sorting accuracy, responsive layout
- **Go/No-Go:**
  - ✅ 2 tabelas lado a lado
  - ✅ Ordenação maior → menor (descending)
  - ✅ Limpar para < 5 linhas
  - ✅ Zebra stripes + hover effects
  - ✅ Responsivo (empilha em mobile)

---

### **2.6: Metas (Progress Bar Mensal + Anual)** ✅ Ready
- **Objective:** Exibir progresso contra metas de economia com progress bars
- **Complexity:** Low-Medium | **Points:** 5-6 | **Hours:** 3-4h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 1.2 (dados metas) + 1.3 + 2.1
- **File:** `docs/stories/2.6.story.md`
- **AC:** 11 critérios (2 progress bars, % cálculo, cores por status, animação)
- **Key:** GoalsSection component, GoalProgressBar, color logic (verde/amarelo/vermelho)
- **Go/No-Go:**
  - ✅ 2 progress bars renderizando
  - ✅ Meta Mensal = Receitas - Despesas
  - ✅ Meta Anual = R$ 50k (ou configurable)
  - ✅ Cores: verde ≥80%, amarelo 60-79%, vermelho <60%
  - ✅ Animação suave (< 800ms)

---

### **2.7: Chat com IA (Claude API Plano Pro)** ✅ Ready
- **Objective:** Implementar chat inteligente com contexto de dados financeiros
- **Complexity:** High | **Points:** 10-12 | **Hours:** 6-8h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 1.3 (dados) + 2.1 (layout)
- **File:** `docs/stories/2.7.story.md`
- **AC:** 13 critérios (widget flutuante, modal, histórico, Claude API context, latência < 5s)
- **Key:** Claude API integration, ChatWidget + ChatDrawer, `/api/chat` endpoint, chat_messages persistence
- **Go/No-Go:**
  - ✅ Widget flutuante no canto inferior direito
  - ✅ Modal abre/fecha
  - ✅ Claude API respondendo com contexto
  - ✅ Histórico persistido em `chat_messages`
  - ✅ Latência < 5s, loading indicator

---

### **2.8: Botão Resincronizar Metas (Fase 0 - UI)** ✅ Ready
- **Objective:** Permitir re-sincronização manual com UI feedback
- **Complexity:** Low-Medium | **Points:** 4-5 | **Hours:** 2-3h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 1.2 (API implementada) + 2.1
- **File:** `docs/stories/2.8.story.md`
- **AC:** 13 critérios (botão, spinner, toast feedback, timeout 30s, refetch)
- **Key:** SyncButton component, `/api/sync/budgets` call, Toast notifications, loading state
- **Go/No-Go:**
  - ✅ Botão visível canto superior direito
  - ✅ Loading spinner durante sync
  - ✅ Toast sucesso/erro
  - ✅ Timeout 30s implementado
  - ✅ KPIs + gráficos atualizam após sucesso

---

### **2.9: Badge de Erro & Alertas de Sincronização** ✅ Ready
- **Objective:** Avisar usuário se dados estão desatualizados por > 24h sem sync bem-sucedido
- **Complexity:** Low-Medium | **Points:** 4-5 | **Hours:** 2-3h
- **Status:** Draft → **Ready**
- **Dependencies:** ⬅️ 1.1, 1.3 (sync_log) + 2.1 (layout)
- **File:** `docs/stories/2.9.story.md`
- **AC:** 11 critérios (badge condicional, cores por threshold, tooltip, clique resincroniza)
- **Key:** SyncErrorBadge component, useSyncStatus hook, polling (5min), time calculation
- **Go/No-Go:**
  - ✅ Badge aparece APENAS se > 24h sem sync bem-sucedido
  - ✅ Cores: amarelo (24-48h), vermelho (> 48h)
  - ✅ Tooltip com data/hora última sincronização
  - ✅ Clique resincroniza (integra 2.8)
  - ✅ Badge desaparece após sucesso

---

## 📁 QUICK FILE REFERENCE

```
docs/stories/
├── 1.1.story.md  (Setup Supabase)
├── 1.2.story.md  (Budget Sync)
├── 1.3.story.md  (Cron Sync)
├── 2.1.story.md  (Layout Base)
├── 2.2.story.md  (KPIs)
├── 2.3.story.md  (Período)
├── 2.4.story.md  (Gráficos)
├── 2.5.story.md  (Top 5)
├── 2.6.story.md  (Metas)
├── 2.7.story.md  (Chat IA)
├── 2.8.story.md  (Botão Resync)
├── 2.9.story.md  (Badge Erro)
│
└── 📄 ÍNDEX.md (este arquivo)
└── 📄 DEVELOPMENT-EXECUTION-PLAN.md (detalhado)
└── 📄 DEV-QUICK-REFERENCE.md (quick reference)
```

---

## 🚀 WHERE TO START?

### **For @dev starting NOW:**
1. Read this file (you're reading it! ✅)
2. Read full story: `docs/stories/1.1.story.md`
3. Command: `@dev *develop-story 1.1`

### **For @po managing progress:**
1. Track status in story files (Status field)
2. Reference: `DEVELOPMENT-EXECUTION-PLAN.md`
3. Update @dev with next phase when current done

### **For @qa reviewing:**
1. Read AC in each story file (Acceptance Criteria section)
2. Check codereabbit_integration settings
3. Use task: `@qa *qa-gate {story-id}`

---

## 📊 DEPENDENCY MATRIX

| Story | Bloqueador | Bloqueia | Paralelo Com |
|-------|-----------|----------|--------------|
| 1.1 | ❌ Nenhum | 1.2, 1.3, Epic 2 | 2.1 |
| 1.2 | 1.1 | 2.8 | 1.3, 2.3 |
| 1.3 | 1.1 | Epic 2 core | 1.2, 2.3 |
| 2.1 | ❌ Nenhum | 2.2-2.9 | 1.1 |
| 2.2 | 1.3, 2.1 | 2.3, 2.4 | 2.5 |
| 2.3 | 1.1, 2.1 | 2.4 | 1.2, 1.3, 2.5 |
| 2.4 | 2.2, 2.3, 1.3, 2.1 | 2.7 | none |
| 2.5 | 1.3, 2.1 | ❌ Nenhum | 2.2, 2.6, 2.8, 2.9 |
| 2.6 | 1.2, 2.1 | ❌ Nenhum | 2.8 |
| 2.7 | 1.3, 2.1 | ❌ Nenhum | 2.9 |
| 2.8 | 1.2, 2.1 | ❌ Nenhum | 2.6, 2.9 |
| 2.9 | 1.3, 2.1 | ❌ Nenhum | 2.7, 2.8 |

---

## ✅ VALIDATION STATUS

**All 12 Stories:**
- ✅ Status: Ready (Draft → Ready, 2026-02-20)
- ✅ Validated: 10-point checklist
- ✅ Score: 9.2/10 (média)
- ✅ Dependencies: Mapped
- ✅ CodeRabbit: Configured (light mode)
- ✅ Ready for: Development

**Approve by:** @po Pax
**Date:** 2026-02-20
**Verdict:** GO ✅

---

## 🎯 KEY STATS

- **Total Points:** 73-91 (balance for 2-3 sprints)
- **Total Hours:** 42-58h
- **Critical Path:** 1.1 → Epic 2
- **Parallelizable:** 60% of work
- **Max Teams:** 3 devs simultaneously
- **MVP Completion:** ~3-4 weeks (2 devs steady)

---

## 📞 NAVIGATION

- **Detailed Plan:** → Read `DEVELOPMENT-EXECUTION-PLAN.md`
- **Quick Cheat Sheet:** → Read `DEV-QUICK-REFERENCE.md`
- **Individual Story:** → Open `docs/stories/{ID}.story.md`
- **Ask Questions:** → Contact @po (Pax)
- **Escalate Issue:** → Contact @aios-master

---

**Last Updated:** 2026-02-20 by @po Pax
**Status:** ✅ READY FOR DEVELOPMENT
**Next Step:** `@dev *develop-story 1.1`

— Pax, equilibrando prioridades 🎯
