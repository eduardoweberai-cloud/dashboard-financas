# 📚 Dashboard Financeiro - Stories

**Projeto:** Dashboard Financeiro Pessoal (MVP)
**Total Stories:** 12
**Status:** All Draft (aguardando validação @po)
**Data Criação:** 2026-02-20
**Criado por:** River (@sm)

---

## 📋 Índice de Stories

### Fase 1: Infraestrutura (Infra)

| Story | Nome | Estimativa | Status | Bloqueador |
|-------|------|-----------|--------|-----------|
| 1.1 | Setup Supabase & Google Sheets API | 4-6h | Draft | — |
| 1.2 | Sincronização Fase 0 (Orçamento2026) | 2-3h | Draft | 1.1 |
| 1.3 | Sincronização Cron Diária (Lancamentos2026) | 4-6h | Draft | 1.1 |

**Subtotal:** 10-15h
**Output:** Infraestrutura pronta com conexões validadas

---

### Fase 2: Frontend Dashboard (UI + Integração)

| Story | Nome | Estimativa | Status | Bloqueador |
|-------|------|-----------|--------|-----------|
| 2.1 | Layout Base & Componentes UI | 3-4h | Draft | 1.1*, 2.1* |
| 2.2 | KPIs (Receitas \| Despesas \| Saldo) | 4-5h | Draft | 1.1, 1.3, 2.1 |
| 2.3 | Seletor de Período | 3-4h | Draft | 1.1, 2.1 |
| 2.4 | Gráficos (Donuts + Barras) | 6-8h | Draft | 1.1, 1.3, 2.1, 2.3 |
| 2.5 | Top 5 Gastos & Entradas | 3-4h | Draft | 1.1, 1.3, 2.1 |
| 2.6 | Metas (Progress Bars) | 3-4h | Draft | 1.1, 1.2, 1.3, 2.1 |
| 2.7 | Chat com IA (Claude API) | 6-8h | Draft | 1.1, 1.3, 2.1 |
| 2.8 | Botão Resincronizar Metas | 2-3h | Draft | 1.1, 1.2, 2.1 |
| 2.9 | Badge de Erro & Alertas | 2-3h | Draft | 1.1, 1.3, 2.1 |

**Subtotal:** 32-43h
**Output:** Dashboard funcional com dados em tempo real + Chat IA

---

## 🎯 Sequência Recomendada (Otimizada)

```
📍 PARALELO 1:
   ├─ Story 1.1 (Setup Supabase + Google Sheets API)
   └─ Story 2.1 (Layout Base & Componentes UI)
      ↓
📍 PARALELO 2:
   ├─ Story 1.2 (Sync Fase 0)
   └─ Story 1.3 (Sync Cron)
      ↓
📍 PARALELO 3:
   ├─ Story 2.2 (KPIs)
   └─ Story 2.3 (Seletor Período)
      ↓
📍 PARALELO 4:
   ├─ Story 2.4 (Gráficos)
   ├─ Story 2.5 (Top 5)
   └─ Story 2.6 (Metas)
      ↓
📍 SEQUENCIAL:
   ├─ Story 2.7 (Chat IA)
   ↓
📍 PARALELO 5:
   ├─ Story 2.8 (Botão Resincronizar)
   └─ Story 2.9 (Badge Erro)
      ↓
✅ MVP Completo!
```

**Tempo Total Estimado:** 42-58h (dentro do 46-62h do PRD)

---

## 📊 Estatísticas

- **Total Stories:** 12
- **Stories Infra:** 3 (10-15h)
- **Stories Frontend:** 9 (32-43h)
- **Total Estimado:** 42-58h
- **Complexidade Média:** Medium
- **Tipos:** 3 Backend, 9 Frontend

---

## 🔄 Ciclo de Vida de Uma Story

Cada story segue este ciclo:

```
Draft
  ↓ (validação @po)
Ready
  ↓ (assinação @dev)
InProgress
  ↓ (conclusão @dev)
InReview
  ↓ (aprovação @qa)
Done
```

---

## 📝 Como Usar

### Para @dev (Desenvolvedor)

1. Ler a story completa
2. Validar todos os Acceptance Criteria
3. Trabalhar conforme sequência recomendada
4. Atualizar "File List" conforme progresso
5. Marcar AC como completos [x]
6. Testar conforme "Criteria of Done"
7. Marcar story como "Ready" no status

### Para @qa (QA)

1. Ler "Acceptance Criteria" da story
2. Testar cada AC manualmente ou com testes automatizados
3. Verificar "Criteria of Done"
4. Executar testes listados em PRD
5. Validar CodeRabbit integration requirements
6. Gate decision: PASS / CONCERNS / FAIL

### Para @po (Product Owner)

1. Validar story draft com checklist 10-pontos
2. Confirmar alinhamento com PRD
3. Marcar status de Draft → Ready
4. Priorizar sequência de desenvolvimento

---

## 🔗 Referências

- **PRD:** `docs/prd/prd-dashboard-financeiro.md`
- **Arquitetura:** `docs/architecture/ARCHITECTURE.md`
- **Design System:** `docs/design/design-system.md`
- **Story Breakdown (rascunho):** `docs/stories/dashboard-financeiro-breakdown.md`

---

## 📌 Notas Importantes

- ⚠️ Story 1.1 é bloqueadora principal (setup infra)
- ⚠️ Story 2.1 pode ser paralelo com 1.1 (layout não precisa de dados vivos)
- ⚠️ Stories em "Fase 2" (paralelo) podem ser executadas simultaneamente por diferentes devs
- ✅ Testes devem ser executados em cada story antes de marcar "Ready"
- ✅ CodeRabbit integration deve ser aplicada conforme configuração em cada story

---

## 🎯 Acceptance Criteria Globais

Antes de marcar story como **Done**, validar:

- [ ] Todos os AC da story foram testados e passaram
- [ ] Código passa em `npm run typecheck`
- [ ] Código passa em `npm run lint` (sem warnings)
- [ ] Testes unitários implementados e passando
- [ ] CodeRabbit foi executado (auto-fix ou documentação)
- [ ] PR criada e revisada
- [ ] Story file atualizada com mudanças (Change Log)

---

**Próximo Passo:** @po valida stories com checklist 10-pontos → @dev pode começar com Story 1.1 + 2.1

