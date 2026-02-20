# Development Execution Plan — Dashboard Financeiro

**Status:** All 12 stories READY ✅
**Total Estimate:** 42-58 hours (1 dev: 6-7 dias | 2 devs: 3-4 dias)
**Validated By:** @po Pax
**Date:** 2026-02-20

---

## 🚀 QUICK START

**Para @dev iniciar:**

```bash
# FASE 1 (dia 1-2): Escolha seu caminho
@dev *develop-story 1.1    # OR paralelo com:
@dev *develop-story 2.1

# Quando Fase 1 completa → passar para Fase 2, etc
```

---

## 📋 EXECUTION ROADMAP (5 Fases)

### **FASE 1: FOUNDATION (Dia 1-2)** ⏱️ 7-10 horas

**Status:** `Ready`
**Devs:** 2 (paralelo máximo)
**Bloqueador:** Nenhum

| Prioridade | Story | Descrição | Horas | Points | Dev |
|-----------|-------|-----------|-------|--------|-----|
| 🔴 CRÍTICO | **1.1** | Setup Supabase & Google Sheets | 4-6h | 8-10 | @dev-1 |
| 🟢 INDEPENDENTE | **2.1** | Layout Base & Componentes UI | 3-4h | 6-8 | @dev-2 |

**Dependências:**
- 1.1 e 2.1 = completamente independentes
- 1.1 bloqueia: 1.2, 1.3, Epic 2.2+
- 2.1 bloqueia: 2.2-2.9

**Go/No-Go Criteria (Fase 1 → Fase 2):**
- [ ] 1.1: Projeto Supabase criado, 5 tabelas com schema
- [ ] 1.1: Google Sheets API testada (leitura OK)
- [ ] 1.1: .env.example + .env.local setup
- [ ] 2.1: Next.js 14 com App Router
- [ ] 2.1: Tailwind + Shadcn/ui instalado
- [ ] 2.1: Componentes base renderizando (Card, Button, Badge, Progress)

**Commands:**
```bash
@dev *develop-story 1.1
@dev *develop-story 2.1  # em paralelo
```

---

### **FASE 2: SYNCHRONIZATION & SELECTORS (Dia 3-5)** ⏱️ 9-13 horas

**Status:** `Waiting on Fase 1`
**Devs:** 2 (paralelo)
**Bloqueador:** Fase 1 (1.1 + 2.1) ✅

#### **Bloco 2A: Sincronização de Dados (Serial)**

| Story | Descrição | Horas | Points | Espera | Dev |
|-------|-----------|-------|--------|--------|-----|
| **1.2** | Budget Sync (Orçamento2026) | 2-3h | 5-7 | 1.1 ✅ | @dev-1 |
| **1.3** | Cron Sync Diária (Lancamentos2026) | 4-6h | 8-10 | 1.1 ✅ | @dev-1 |

**Timeline:** 1.2 → 1.3 (serial, ~6-9h total)

#### **Bloco 2B: Seletor de Período (Paralelo)**

| Story | Descrição | Horas | Points | Espera | Dev |
|-------|-----------|-------|--------|--------|-----|
| **2.3** | Seletor Período (Mensal/Trimestral/etc) | 3-4h | 5-7 | 1.1 ✅, 2.1 ✅ | @dev-2 |

**Timeline:** Paralelo com 1.2+1.3

**Go/No-Go Criteria (Fase 2 → Fase 3):**
- [ ] 1.2: Script lê Orçamento2026, insere 360 linhas em `monthly_budgets`
- [ ] 1.2: Re-sincronização funciona (DELETE + INSERT)
- [ ] 1.3: Vercel Cron Job em vercel.json
- [ ] 1.3: Rota `/api/sync/cron` respondendo
- [ ] 1.3: Upsert de transações funciona, duplicatas evitadas
- [ ] 2.3: PeriodContext criado
- [ ] 2.3: DashboardHeader com buttons + dropdown
- [ ] 2.3: Período padrão = período atual

**Commands:**
```bash
@dev *develop-story 1.2
# Quando 1.2 completa:
@dev *develop-story 1.3

# Em paralelo com 1.2:
@dev *develop-story 2.3
```

---

### **FASE 3: CORE DASHBOARD (Dia 6-10)** ⏱️ 13-17 horas

**Status:** `Waiting on Fase 2`
**Devs:** 3 (máxima paralelização)
**Bloqueador:** Fase 2 (1.1, 1.3, 2.1, 2.3) ✅

| Prioridade | Story | Descrição | Horas | Points | Dev | Espera |
|-----------|-------|-----------|-------|--------|-----|--------|
| 🔴 CRÍTICO | **2.2** | KPIs (Receitas, Despesas, Saldo) | 4-5h | 6-8 | @dev-1 | 1.3 ✅ |
| 🔴 CRÍTICO | **2.4** | Gráficos (Donuts + Barras) | 6-8h | 10-12 | @dev-2 | 2.2 ✅ |
| 🟡 IMPORTANTE | **2.5** | Top 5 (Gastos & Entradas) | 3-4h | 5-6 | @dev-3 | 1.3 ✅ |

**Sequência Crítica:**
- 2.2 deve completar ANTES de 2.4 iniciar (gráficos dependem de KPI context)
- 2.5 pode rodar em paralelo (independente)

**Timeline Recomendada:**
```
Dia 6-7:   2.2 (KPIs) + 2.5 (Top 5) paralelo
Dia 8-10:  2.4 (Gráficos) APÓS 2.2
```

**Go/No-Go Criteria (Fase 3 → Fase 4):**
- [ ] 2.2: 3 cards exibindo Receitas, Despesas, Saldo
- [ ] 2.2: Cálculo % realização com cores corretas
- [ ] 2.2: Badge de variação vs período anterior
- [ ] 2.4: Donuts para Receitas + Despesas
- [ ] 2.4: Bar Chart para evolução de saldo
- [ ] 2.4: Responsivo em mobile/tablet/desktop
- [ ] 2.5: Tabelas Top 5 lado a lado
- [ ] 2.5: Ordenação correta (maior primeiro)

**Commands:**
```bash
@dev *develop-story 2.2
# Quando 2.2 completa:
@dev *develop-story 2.4

# Em paralelo com 2.2:
@dev *develop-story 2.5
```

---

### **FASE 4: META TRACKING & SYNC UI (Dia 11-14)** ⏱️ 5-7 horas

**Status:** `Waiting on Fase 3`
**Devs:** 2 (paralelo)
**Bloqueador:** Fase 2 (1.2) ✅ + Fase 1 (1.1) ✅

| Story | Descrição | Horas | Points | Espera | Dev |
|-------|-----------|-------|--------|--------|-----|
| **2.6** | Metas (Progress Bars Mensal + Anual) | 3-4h | 5-6 | 1.2 ✅, 2.1 ✅ | @dev-1 |
| **2.8** | Botão Resincronizar Metas | 2-3h | 4-5 | 1.2 ✅, 2.1 ✅ | @dev-2 |

**Dependências:**
- 2.6 e 2.8 = completamente independentes
- Ambas podem rodar em paralelo
- 2.6 bloqueia: nada (independente)
- 2.8 bloqueia: nada (independente)

**Go/No-Go Criteria (Fase 4 → Fase 5):**
- [ ] 2.6: 2 progress bars renderizando
- [ ] 2.6: Cálculo de progresso correto
- [ ] 2.6: Cores por threshold (verde/amarelo/vermelho)
- [ ] 2.8: Botão visível no canto superior direito
- [ ] 2.8: Clique dispara `/api/sync/budgets`
- [ ] 2.8: Toast feedback (sucesso/erro)

**Commands:**
```bash
@dev *develop-story 2.6
@dev *develop-story 2.8  # em paralelo
```

---

### **FASE 5: AI & ERROR HANDLING (Dia 15-18)** ⏱️ 8-11 horas

**Status:** `Waiting on Fase 4`
**Devs:** 2 (paralelo)
**Bloqueador:** Fase 1 (1.1, 1.3) ✅ + Fase 3 (2.1, 2.4) ✅

| Story | Descrição | Horas | Points | Espera | Dev |
|-------|-----------|-------|--------|--------|-----|
| **2.7** | Chat com IA (Claude API) | 6-8h | 10-12 | 1.3 ✅, 2.1 ✅ | @dev-1 |
| **2.9** | Badge Erro & Alertas Sync | 2-3h | 4-5 | 1.3 ✅, 2.1 ✅ | @dev-2 |

**Dependências:**
- 2.7 e 2.9 = independentes
- Ambas podem rodar em paralelo
- 2.7 = "nice-to-have" sofisticado
- 2.9 = completar error handling

**Go/No-Go Criteria (Fase 5 = MVP COMPLETO):**
- [ ] 2.7: Widget flutuante exibido
- [ ] 2.7: Modal abre/fecha
- [ ] 2.7: Histórico persistido em `chat_messages`
- [ ] 2.7: Claude API respondendo com contexto
- [ ] 2.9: Badge "Últimos dados: [data-hora]"
- [ ] 2.9: Cores corretas por threshold (24-48h)
- [ ] 2.9: Clique resincroniza

**Commands:**
```bash
@dev *develop-story 2.7
@dev *develop-story 2.9  # em paralelo
```

---

## 🎯 DEPENDENCY GRAPH (Visual Reference)

```
┌──────────────────────┐
│   FASE 1 (Dia 1-2)   │
├──────────────────────┤
│  1.1 ✅  │  2.1 ✅   │  (paralelo)
└────┬─────┴────┬──────┘
     │          │
     ├─► 1.2    │      ┌─────────────────┐
     │          │      │  FASE 2 (Dia 3-5)│
     ├─► 1.3    ├────► ├─────────────────┤
     │          │      │ 1.2+1.3 || 2.3   │
     └──────────┴──────┴─────┬───────────┬─┘
                             │           │
    ┌────────────────────────┘           │
    │  ┌───────────────────────────────┐ │
    │  │     FASE 3 (Dia 6-10)        │ │
    └─►├───────────────────────────────┤◄┘
       │ 2.2 ✅ → 2.4 ✅ && 2.5 ✅    │
       └───────────────────────────────┘
               │          │
    ┌──────────┘          └────────┐
    │  ┌──────────────────────────┐ │
    │  │   FASE 4 (Dia 11-14)    │ │
    └─►├──────────────────────────┤◄┘
       │   2.6 ✅ && 2.8 ✅     │
       └──────────┬───────────────┘
                  │
    ┌─────────────┘
    │  ┌──────────────────────────┐
    │  │   FASE 5 (Dia 15-18)    │
    └─►├──────────────────────────┤
       │   2.7 ✅ && 2.9 ✅     │
       │                          │
       │  🎉 MVP COMPLETO 🎉    │
       └──────────────────────────┘
```

---

## ✅ PRÉ-REQUISITOS ANTES DE INICIAR

**Para toda a equipe @dev:**

- [ ] Clone repo + branches configuradas
- [ ] Node.js 18+ instalado
- [ ] npm/yarn/pnpm configurado
- [ ] `.env.example` criado (Fase 1)
- [ ] `.env.local` configurado (local, não commitado)
- [ ] Supabase account criada (Fase 1)
- [ ] Google Cloud Console com Google Sheets API ativada (Fase 1)
- [ ] Anthropic API key disponível (Fase 5, Story 2.7)
- [ ] CodeRabbit configurado (todas as fases)
- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa

---

## 📊 MILESTONES & GATES

| Milestone | Data | Fase | Gate Verdict |
|-----------|------|------|--------------|
| **Fase 1 Completa** | Dia 2 | 1.1 ✅, 2.1 ✅ | @po validates → Fase 2 GO |
| **Fase 2 Completa** | Dia 5 | 1.2 ✅, 1.3 ✅, 2.3 ✅ | @qa spot-check → Fase 3 GO |
| **Fase 3 Completa** | Dia 10 | 2.2 ✅, 2.4 ✅, 2.5 ✅ | @qa full-review → Fase 4 GO |
| **Fase 4 Completa** | Dia 14 | 2.6 ✅, 2.8 ✅ | @qa → Fase 5 GO |
| **Fase 5 Completa** | Dia 18 | 2.7 ✅, 2.9 ✅ | @qa gate → **MVP READY** |

---

## 🔄 DAILY WORKFLOW (Para @dev)

**Morning:**
1. `git pull origin main` (latest)
2. Check which story is assigned
3. `@dev *develop-story {story-id}`
4. Work on acceptance criteria

**Afternoon:**
1. Run CodeRabbit: `npm run lint` + `npm run typecheck`
2. Write/run tests
3. Commit changes
4. Alert @po when story done

**Evening:**
1. Wait for @qa gate decision
2. If FAIL: Fix issues, re-test
3. If PASS: Ready for merge

---

## 🛠️ HELPFUL COMMANDS

```bash
# Para listar histórias by status
grep -r "Status:" docs/stories/*.md

# Para checar dependências
grep -r "Bloqueador\|Bloqueia" docs/stories/*.md

# Para validar CodeRabbit
npm run lint
npm run typecheck

# Para testar uma story localmente
npm test -- {story-id}

# Para submeter uma story ao @qa
@qa *qa-gate {story-id}
```

---

## 📝 STORY ACCEPTANCE TEMPLATE

**Quando uma story ficar PRONTA:**

```markdown
## Story {ID} Completa ✅

**Desenvolvedor:** @dev-X
**Data:** YYYY-MM-DD
**Duração:** X horas
**Commits:** {lista de commits}

### Acceptance Criteria
- [x] Todos os 10-13 ACs passed
- [x] Tests escritos e passando
- [x] CodeRabbit: CRITICAL/HIGH fixed
- [x] `npm run typecheck` ✅
- [x] `npm run lint` ✅
- [x] Documentação atualizada

### Ready para QA Gate
```

---

## 🚨 TROUBLESHOOTING

| Problema | Solução |
|----------|---------|
| Story bloqueado por dependência | Check FASE acima, aguarde bloqueador completar |
| CodeRabbit falha | Rodar `npm run lint` localmente, fix issues |
| API endpoint não respondendo | Verificar `.env.local` + secrets configuradas |
| Teste de integração falha | Check database connection + seed data |
| Merge conflict em story file | Aguardar @po resolve (não edit AC manualmente) |

---

## 📞 ESCALATION

- **Dúvida sobre story:** Pergunte @po (Pax)
- **Bloqueado em dependência:** Notifique @po para parallelizar
- **CodeRabbit issue:** Rodar manual: `npm run lint`
- **QA gate falha:** @qa retorna feedback, re-trabalhe
- **Não consegue completar:** Escalate para @aios-master

---

**Prepared by:** @po Pax
**Approved:** ✅ 2026-02-20
**Last Updated:** 2026-02-20

Boa sorte! 🚀 Vamos entregar um MVP incrível! 🎉

— Pax, equilibrando prioridades 🎯
