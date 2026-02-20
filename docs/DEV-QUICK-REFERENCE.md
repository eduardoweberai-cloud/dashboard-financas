# 🚀 DEV QUICK REFERENCE — Ordem de Execução

**Imprima isto! Coloque na parede! 📋**

---

## TODAY'S STORY? 👇

### **FASE 1** (Dia 1-2) — INICIAR AGORA ✅

```
┌─────────────────────────────────────────┐
│  @dev *develop-story 1.1                │
│  (4-6h, 8-10pt)                        │
│  Setup Supabase & Google Sheets API    │
└─────────────────────────────────────────┘

PARALELO COM:

┌─────────────────────────────────────────┐
│  @dev *develop-story 2.1                │
│  (3-4h, 6-8pt)                         │
│  Layout Base & Componentes UI          │
└─────────────────────────────────────────┘

✅ GO → FASE 2 (quando ambos completos)
```

---

## FULL EXECUTION ORDER (Copy & Paste)

```
╔════════════════════════════════════════════════════════════╗
║                    FASE 1 (Dia 1-2)                        ║
╠════════════════════════════════════════════════════════════╣
║  1️⃣  @dev *develop-story 1.1  (paralelo)                  ║
║  2️⃣  @dev *develop-story 2.1  (paralelo)                  ║
║  ✅ Criteria: Supabase + Layout base prontos              ║
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║                    FASE 2 (Dia 3-5)                        ║
╠════════════════════════════════════════════════════════════╣
║  3️⃣  @dev *develop-story 1.2  (2-3h, serial)             ║
║  4️⃣  @dev *develop-story 1.3  (4-6h, serial após 1.2)   ║
║  5️⃣  @dev *develop-story 2.3  (3-4h, paralelo com 1.2)  ║
║  ✅ Criteria: Sincronização + Período seletor            ║
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║                    FASE 3 (Dia 6-10)                       ║
╠════════════════════════════════════════════════════════════╣
║  6️⃣  @dev *develop-story 2.2  (4-5h, crítico)            ║
║  7️⃣  @dev *develop-story 2.4  (6-8h, APÓS 2.2)          ║
║  8️⃣  @dev *develop-story 2.5  (3-4h, paralelo)          ║
║  ✅ Criteria: KPIs, Gráficos, Top 5                      ║
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║                    FASE 4 (Dia 11-14)                      ║
╠════════════════════════════════════════════════════════════╣
║  9️⃣  @dev *develop-story 2.6  (3-4h, paralelo)          ║
║  🔟 @dev *develop-story 2.8  (2-3h, paralelo)           ║
║  ✅ Criteria: Metas + Botão Resincronizar               ║
╚════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════╗
║                    FASE 5 (Dia 15-18)                      ║
╠════════════════════════════════════════════════════════════╣
║  1️⃣1️⃣ @dev *develop-story 2.7  (6-8h, paralelo)        ║
║  1️⃣2️⃣ @dev *develop-story 2.9  (2-3h, paralelo)        ║
║  ✅ Criteria: Chat IA + Badge Erro                       ║
║                                                            ║
║  🎉 MVP COMPLETO! Pronto para produção! 🎉              ║
╚════════════════════════════════════════════════════════════╝
```

---

## STORY DETAILS (TL;DR)

### FASE 1
- **1.1:** Supabase setup (migrations, Google Sheets auth)
- **2.1:** Next.js + Tailwind + Shadcn components

### FASE 2
- **1.2:** Budget sync script (Orçamento2026 → DB)
- **1.3:** Daily cron sync (Lancamentos2026 → DB)
- **2.3:** Period selector (Mensal/Trimestral/etc)

### FASE 3
- **2.2:** KPI cards (Receitas, Despesas, Saldo)
- **2.4:** Charts (Donuts + Bar evolution)
- **2.5:** Top 5 tables (Gastos & Entradas)

### FASE 4
- **2.6:** Progress bars (Metas Mensal + Anual)
- **2.8:** Resync button (UI feedback)

### FASE 5
- **2.7:** AI chat (Claude API context)
- **2.9:** Error badge (Sync alerts)

---

## ⏱️ TIME ESTIMATES

| Fase | Stories | Total | 1 Dev | 2 Devs |
|------|---------|-------|-------|--------|
| 1 | 1.1, 2.1 | 7-10h | 2 dias | 1 dia |
| 2 | 1.2, 1.3, 2.3 | 9-13h | 3 dias | 2 dias |
| 3 | 2.2, 2.4, 2.5 | 13-17h | 3 dias | 2 dias |
| 4 | 2.6, 2.8 | 5-7h | 1 dia | 1 dia |
| 5 | 2.7, 2.9 | 8-11h | 2 dias | 1 dia |
| **TOTAL** | **12** | **42-58h** | **6-7 dias** | **3-4 dias** |

---

## 🎯 PARALLELIZATION CHEAT SHEET

✅ **PODE FAZER EM PARALELO:**
- 1.1 + 2.1 (diferentes layers)
- 1.2 + 1.3 + 2.3 (após 1.1)
- 2.2 + 2.5 (ambos precisam 1.3)
- 2.4 APÓS 2.2 (depende)
- 2.6 + 2.8 (independentes)
- 2.7 + 2.9 (independentes)

❌ **NÃO PODE EM PARALELO:**
- Qualquer coisa antes de 1.1 (bloqueador)
- Qualquer Epic 2 antes de 2.1 (layout base)
- 2.4 antes de 2.3 (precisa período)
- 2.4 antes de 2.2 (precisa KPI context)

---

## 🔐 SECRETS & SETUP CHECKLIST

**Before starting:**

- [ ] `.env.local` created (NOT committed)
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_ANON_KEY` set
- [ ] `GOOGLE_SHEETS_API_KEY` set (Fase 1)
- [ ] `ANTHROPIC_API_KEY` set (Fase 5, Story 2.7)
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in git history

**Check:**
```bash
cat .env.local | grep -E "URL|KEY|TOKEN"  # Verify all set
git log --all -p -- ".env" | grep -c "SUPABASE_URL"  # Should be 0
```

---

## 📋 DAILY CHECKLIST

**When starting a story:**
- [ ] Read FULL story file (all 12 AC)
- [ ] Understand dependencies
- [ ] Check `npm run typecheck` passes
- [ ] Check `npm run lint` passes

**When finishing a story:**
- [ ] All AC checkboxes ticked ✅
- [ ] Tests written + passing
- [ ] CodeRabbit fixed CRITICAL/HIGH
- [ ] `npm run typecheck` ✅
- [ ] `npm run lint` ✅
- [ ] Documentation updated
- [ ] Commit message descriptive
- [ ] Alert @po story is done

**When ready for QA:**
```bash
@qa *qa-gate 1.1  # Example for story 1.1
```

---

## 🆘 BLOCKED? HERE'S WHAT TO DO

| Issue | Action |
|-------|--------|
| Waiting for blocker story | Notify @po, see if other stories parallelizable |
| CodeRabbit failing | Run `npm run lint` locally, fix issues |
| Can't find API docs | Use Context7: `*research [library-name]` |
| Need to research | Ask @analyst for research via `*research` |
| Story too big | Split with @po: `*backlog-split {story}` |
| Stuck > 30min | Escalate to @aios-master |

---

## 🎬 QUICK START (Copy & Paste First Command)

```bash
# RIGHT NOW - Start Fase 1
@dev *develop-story 1.1

# When 1.1 done, parallel:
@dev *develop-story 2.1

# Story file location:
docs/stories/1.1.story.md

# Full plan:
cat docs/DEVELOPMENT-EXECUTION-PLAN.md
```

---

## 🔄 LIFECYCLE (Per Story)

```
START
  ↓
Read story file
  ↓
Understand AC (10-13 criteria)
  ↓
Implement feature
  ↓
Write tests
  ↓
CodeRabbit check (npm run lint)
  ↓
All tests pass ✅
  ↓
@qa *qa-gate {story-id}
  ↓
QA verdict: PASS → merge ✅
            FAIL → fix → re-test → @qa again
```

---

## 💡 TIPS FOR SUCCESS

1. **Read the FULL story file** — Don't skip Dev Notes or Scope
2. **Understand dependencies** — Check what blocks you
3. **Test frequently** — Don't wait until end
4. **Commit often** — Small, atomic commits
5. **Use CodeRabbit** — Run lint early + often
6. **Ask @po questions** — Better to clarify than assume
7. **Track time** — Log hours for Agile metrics
8. **Celebrate wins** — Each story is a milestone! 🎉

---

**Questions?** Ask @po (Pax)
**Stuck?** Escalate to @aios-master
**Ready to code?** `@dev *develop-story 1.1` NOW! 🚀

— Pax, equilibrando prioridades 🎯
