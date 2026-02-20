# System Architecture — Dashboard Financeiro Pessoal

**Documento:** System Architecture Design
**Projeto:** Dashboard Financeiro Pessoal
**Data:** 2026-02-20
**Arquiteto:** Aria (@architect)
**Status:** Ready para implementação

---

## 📐 Executive Summary

Arquitetura **Full-Stack Monolítica com Next.js** — solução pragmática, escalável e pronta para portfolio.

**Stack Selecionado:**
- **Frontend:** Next.js 14+ (App Router) + React + TypeScript
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL gerenciado)
- **UI Components:** Shadcn/ui (design system moderno)
- **Charts:** Recharts (visualizações responsivas)
- **IA:** Claude API (Plano Pro Anthropic)
- **Integração:** Google Sheets API + Vercel Cron Jobs
- **Deploy:** Vercel (gratuito, otimizado para Next.js)

**Por que essa stack?**
- ✅ Prototipagem rápida (MVP 46-62h)
- ✅ Sem servidor (zero DevOps, escalável automaticamente)
- ✅ Custo zero (Vercel free, Supabase free tier, Claude via plano existente)
- ✅ Portfolio profissional (stack moderno e demandado)
- ✅ Escalável (fácil adicionar funcionalidades Phase 2)

---

## 🏗️ Arquitetura em Camadas

### Layer 1: Presentation (Frontend)
```
Frontend (React + Next.js)
├── Pages (Dashboard page)
├── Components
│   ├── Dashboard (layout principal)
│   ├── KPICards (receitas, despesas, saldo)
│   ├── Charts (Donuts, Bar Chart)
│   ├── TopMovements (Top 5 gastos/entradas)
│   ├── Goals (metas com progress bars)
│   └── ChatIA (drawer flutuante)
├── Hooks (useData, usePeriod, useChat)
├── Context (PeriodContext para estado global)
└── Styles (Tailwind CSS via Shadcn/ui)
```

**Responsabilidades:**
- Renderizar componentes visuais
- Capturar input de usuário (seletor de período, chat)
- Chamar API backend
- Exibir dados em gráficos/tabelas
- Gerenciar estado local (período selecionado, aba ativa)

---

### Layer 2: Business Logic (API Routes)
```
API Routes (/app/api)
├── /dashboard/route.ts       # GET: KPIs, gráficos, dados agregados
├── /chat/route.ts            # POST: Enviar mensagem, receber resposta IA
├── /sync/budgets/route.ts     # POST: Re-sincronizar Orçamento2026 (Fase 0)
└── /sync/cron/route.ts        # GET: Cron job diário (Vercel Cron)
```

**Responsabilidades:**
- Validar requests do frontend
- Orquestrar chamadas a banco de dados
- Integrar com APIs externas (Google Sheets, Claude)
- Calcular agregações (KPIs, variações, percentuais)
- Gerenciar contexto de dados para IA

---

### Layer 3: Data Access (Database)
```
Supabase (PostgreSQL)
├── transactions      # Lançamentos (entrada/saída)
├── monthly_budgets   # Metas Projetadas (por mês/categoria)
├── metas             # Metas anuais/mensais de economia
├── chat_messages     # Histórico de chat com IA
└── sync_log          # Auditoria de sincronização
```

**Responsabilidades:**
- Armazenar dados financeiros
- Indexar por período/categoria para queries rápidas
- Manter integridade referencial
- Registrar sincronizações

---

### Layer 4: Integrations (External APIs)
```
External Services
├── Google Sheets API        # Ler: Lancamentos2026, Orçamento2026
├── Claude API               # Chat com contexto, análises
└── Vercel Cron             # Executar sync diária
```

**Responsabilidades:**
- Sincronizar dados de Sheets
- Processar mensagens com IA
- Executar jobs automáticos

---

## 📊 Fluxo de Dados

### Fluxo 1: Carregamento do Dashboard
```
1. User abre dashboard → /dashboard page carrega
2. Frontend faz GET /api/dashboard?periodo=2026-01&tipo=mensal
3. Backend:
   - Valida parâmetros
   - Query Supabase (transactions, monthly_budgets)
   - Calcula KPIs (Realizado, Projetado, % de realização)
   - Calcula variação vs período anterior
   - Prepara dados para gráficos
   - Retorna JSON
4. Frontend renderiza componentes com dados
5. Gráficos (Recharts) renderizam interativamente
```

### Fluxo 2: Re-sincronização de Metas (Fase 0)
```
1. User clica botão "↻ Resincronizar Metas"
2. Frontend faz POST /api/sync/budgets
3. Backend:
   - Lê Google Sheets (Orçamento2026)
   - Valida e normaliza dados
   - Upsert em monthly_budgets (atualiza ou insere)
   - Log em sync_log (status=success)
   - Retorna: {status: 'success', message: '...', updated_count: 12}
4. Frontend exibe toast "Metas atualizadas com sucesso"
5. Dashboard re-renderiza com novos dados
```

### Fluxo 3: Sincronização Diária Automática (Vercel Cron)
```
Diariamente (ex: 8h da manhã):
1. Vercel Cron dispara GET /api/sync/cron
2. Backend:
   - Lê Google Sheets (Lancamentos2026)
   - Normaliza e valida cada linha
   - Upsert em transactions
   - Log em sync_log (rows_inserted, rows_updated)
   - Retry automático 3x se falhar
3. Se sucesso: sync_log com status=success
4. Se erro > 24h: Frontend exibe badge "⚠️ Sincronização atrasada"
```

### Fluxo 4: Chat com IA
```
1. User digita pergunta no chat → clica Send
2. Frontend faz POST /api/chat
   - Payload: {message: "...", periodo: "2026-01", tipo: "mensal", kpis: {...}}
3. Backend:
   - Valida mensagem
   - Busca histórico anterior em chat_messages
   - Prepara contexto: "Usuário visualizando [período]. Receitas: R$X, Despesas: R$Y..."
   - Chama Claude API com contexto
   - Salva em chat_messages (user_message, ai_response, periodo_contexto)
4. Frontend exibe resposta em drawer do chat
5. Próxima mensagem carrega histórico automaticamente
```

---

## 📁 Estrutura de Pastas

```
dashboard-financas/
├── .aios-core/                      # Framework AIOS
├── .claude/                         # Configurações Claude Code
├── docs/
│   ├── prd/                         # PRD (requirements)
│   │   └── prd-dashboard-financeiro.md
│   ├── stories/                     # Development stories
│   │   ├── 1.1.story.md             # Setup Supabase
│   │   ├── 1.2.story.md             # Sync Google Sheets
│   │   ├── 2.1.story.md             # Dashboard frontend
│   │   └── ...
│   ├── architecture/                # Este arquivo
│   │   └── ARCHITECTURE.md
│   └── qa/
│       └── coderabbit-reports/
│
├── app/                             # Next.js App Router
│   ├── (dashboard)/                 # Route group: dashboard layout
│   │   ├── layout.tsx               # Dashboard layout
│   │   ├── page.tsx                 # Main dashboard page
│   │   └── loading.tsx              # Loading skeleton
│   │
│   ├── api/                         # API Routes (backend)
│   │   ├── dashboard/
│   │   │   └── route.ts             # GET KPIs + dados agregados
│   │   ├── chat/
│   │   │   └── route.ts             # POST enviar mensagem, GET histórico
│   │   ├── sync/
│   │   │   ├── budgets/
│   │   │   │   └── route.ts         # POST re-sincronizar metas (Fase 0)
│   │   │   └── cron/
│   │   │       └── route.ts         # GET cron job diário
│   │   └── health/
│   │       └── route.ts             # GET status da API
│   │
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
│
├── components/                      # React Components (Shadcn/ui)
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx       # Header com seletor período
│   │   ├── KPICard.tsx               # Card individual (receitas/despesas/saldo)
│   │   ├── KPISection.tsx            # Container 3 cards
│   │   ├── DistributionCharts.tsx    # Donuts lado-a-lado
│   │   ├── BalanceChart.tsx          # Bar chart evolução saldo
│   │   ├── TopMovements.tsx          # Top 5 gastos/entradas
│   │   ├── GoalsSection.tsx          # Progress bars metas
│   │   ├── ChatDrawer.tsx            # Drawer chat flutuante
│   │   └── SyncButton.tsx            # Botão re-sincronizar
│   │
│   ├── ui/                          # Shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── input.tsx
│   │   ├── scroll-area.tsx
│   │   └── ...
│   │
│   └── charts/
│       ├── DonutChart.tsx            # Wrapper Recharts donut
│       └── BarChart.tsx              # Wrapper Recharts bar
│
├── lib/                             # Utilities & Helpers
│   ├── db.ts                        # Supabase client + queries
│   │   ├── getKPIs()
│   │   ├── getChartData()
│   │   ├── getChatMessages()
│   │   ├── saveChatMessage()
│   │   └── getSyncLog()
│   │
│   ├── google-sheets.ts             # Google Sheets API client
│   │   ├── fetchLancamentos2026()    # Ler transações
│   │   ├── fetchOrcamento2026()      # Ler metas
│   │   └── validateSheetData()
│   │
│   ├── claude.ts                    # Claude API client
│   │   ├── createChatMessage()       # Enviar mensagem com contexto
│   │   └── formatContextPrompt()
│   │
│   ├── utils.ts                     # Helper functions
│   │   ├── formatCurrency()
│   │   ├── calculatePercentage()
│   │   ├── formatDate()
│   │   ├── aggregateByPeriod()
│   │   └── normalizeCategoryName()
│   │
│   └── types.ts                     # TypeScript types
│       ├── Transaction
│       ├── Budget
│       ├── KPI
│       ├── ChatMessage
│       └── ...
│
├── hooks/                           # React Custom Hooks
│   ├── useData.ts                   # Buscar dados do dashboard
│   ├── usePeriod.ts                 # Gerenciar período selecionado
│   ├── useChat.ts                   # Gerenciar chat com IA
│   └── useSyncBudgets.ts            # Gerenciar sincronização
│
├── context/                         # React Context
│   ├── PeriodContext.tsx            # Compartilhar período entre componentes
│   └── DataContext.tsx              # Compartilhar dados globalmente
│
├── public/                          # Static assets
│   ├── logo.svg
│   └── ...
│
├── .env.example                     # Exemplo de variáveis (sem valores)
├── .env.local                       # NUNCA commit! Variáveis reais
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔐 Variáveis de Ambiente (.env.local)

```bash
# Google Sheets API
GOOGLE_SHEETS_API_KEY=xxx
GOOGLE_SHEETS_LANCAMENTOS_ID=xxx  # Sheet ID de Lancamentos2026
GOOGLE_SHEETS_ORCAMENTO_ID=xxx    # Sheet ID de Orçamento2026

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx     # Backend-only, nunca expor ao cliente

# Claude API
ANTHROPIC_API_KEY=xxx             # Plano Pro token

# Vercel (deployment apenas)
VERCEL_TOKEN=xxx                  # Para deploy automático

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🗄️ Schema Supabase (PostgreSQL)

### Tabela: transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('entrada', 'saída')),
  category VARCHAR(50) NOT NULL,
  value DECIMAL(12, 2) NOT NULL CHECK (value > 0),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  synced_from_sheets BOOLEAN DEFAULT TRUE,
  sheet_row_id INT
);

CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_type ON transactions(type);
```

### Tabela: monthly_budgets
```sql
CREATE TABLE monthly_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saída')),
  projetado DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(mes, ano, categoria, tipo)
);

CREATE INDEX idx_budgets_periodo ON monthly_budgets(mes, ano);
```

### Tabela: metas
```sql
CREATE TABLE metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('mensal', 'anual')),
  valor DECIMAL(12, 2) NOT NULL,
  mes INT CHECK (mes IS NULL OR (mes BETWEEN 1 AND 12)),
  ano INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: chat_messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  periodo_contexto VARCHAR(20),  -- "2026-01" ou "Q1-2026"
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_periodo ON chat_messages(periodo_contexto);
```

### Tabela: sync_log
```sql
CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_date TIMESTAMP DEFAULT NOW(),
  rows_processed INT,
  rows_inserted INT,
  rows_updated INT,
  status VARCHAR(20) CHECK (status IN ('success', 'error', 'partial')),
  error_message TEXT
);

CREATE INDEX idx_sync_status ON sync_log(status);
```

---

## 🔄 API Endpoints

### GET /api/dashboard
**Retorna:** KPIs, dados para gráficos, top movimentos, metas

```json
{
  "periodo": "2026-01",
  "tipo": "mensal",
  "kpis": {
    "receitas": { "realizado": 35000, "projetado": 40000, "percentual": 87.5 },
    "despesas": { "realizado": 8500, "projetado": 10000, "percentual": 85 },
    "saldo": { "realizado": 26500, "projetado": 30000, "percentual": 88.3 }
  },
  "variacao": { "receitas": "+5%", "despesas": "-2%" },
  "chart_data": [
    { "nome": "Alimentação", "realizado": 8400, "projetado": 7000 },
    ...
  ],
  "top_gastos": [
    { "categoria": "Aluguel", "valor": 1500 },
    ...
  ],
  "metas": { "mensal": 2000, "anual": 50000, "progresso": "45%" }
}
```

### POST /api/chat
**Envia:** Mensagem do usuário com contexto
**Retorna:** Resposta da IA

```json
Request:
{
  "message": "Qual minha categoria com maior gasto?",
  "periodo": "2026-01",
  "tipo": "mensal",
  "kpis": { ... }
}

Response:
{
  "id": "uuid",
  "user_message": "...",
  "ai_response": "Sua maior despesa em janeiro é Alimentação...",
  "periodo_contexto": "2026-01",
  "created_at": "2026-02-20T10:30:00Z"
}
```

### POST /api/sync/budgets
**Função:** Re-sincronizar metas de Orçamento2026
**Retorna:** Status da sincronização

```json
Response:
{
  "status": "success",
  "message": "Metas atualizadas com sucesso",
  "updated_count": 12,
  "timestamp": "2026-02-20T10:35:00Z"
}
```

### GET /api/sync/cron
**Função:** Cron job diário (Vercel)
**Disparo:** Automático via Vercel Cron

```json
Response:
{
  "status": "success",
  "rows_processed": 150,
  "rows_inserted": 42,
  "rows_updated": 108,
  "timestamp": "2026-02-20T08:00:00Z"
}
```

---

## 🎯 Fases de Implementação

### Fase 1: Setup & Infra (6-8h)
- [ ] **Story 1.1:** Setup Supabase (criar projeto, tabelas, chaves)
- [ ] **Story 1.2:** Configurar Google Sheets API (OAuth2, leitura)
- [ ] **Story 1.3:** Setup Next.js (boilerplate, Shadcn/ui, Tailwind)
- [ ] **Story 1.4:** Variáveis de ambiente (.env, deploy secrets)

**Output:** Repositório pronto com infra e auth configurados

---

### Fase 2: Sincronização de Dados (8-10h)
- [ ] **Story 2.1:** Implementar lib/google-sheets.ts (fetch Lancamentos2026, Orçamento2026)
- [ ] **Story 2.2:** Sincronização Fase 0 (importar metas um única vez)
- [ ] **Story 2.3:** API route /api/sync/budgets (re-sincronização manual)
- [ ] **Story 2.4:** API route /api/sync/cron (sincronização diária automática)
- [ ] **Story 2.5:** Validação e normalização de dados
- [ ] **Story 2.6:** Error handling e retry automático (3 tentativas)

**Output:** Dados de Google Sheets fluem para Supabase automaticamente

---

### Fase 3: Dashboard Frontend (14-18h)
- [ ] **Story 3.1:** Dashboard layout (header, seletor período, estrutura)
- [ ] **Story 3.2:** Componentes KPI (receitas, despesas, saldo com % de realização)
- [ ] **Story 3.3:** Gráficos Donuts (distribuição por categoria)
- [ ] **Story 3.4:** Gráfico Bar Chart (evolução saldo por dia/mês)
- [ ] **Story 3.5:** Tabelas Top 5 (gastos e entradas)
- [ ] **Story 3.6:** Metas com Progress Bars
- [ ] **Story 3.7:** Responsive design (mobile + desktop)
- [ ] **Story 3.8:** API Integration (buscar dados em /api/dashboard)
- [ ] **Story 3.9:** Loading states e error handling

**Output:** Dashboard visual renderiza dados em tempo real

---

### Fase 4: Chat com IA (6-8h)
- [ ] **Story 4.1:** Componente ChatDrawer (flutuante, aberto/fechado)
- [ ] **Story 4.2:** lib/claude.ts (Claude API client com contexto)
- [ ] **Story 4.3:** API route /api/chat (backend que chama Claude)
- [ ] **Story 4.4:** Histórico de chat (persistência em Supabase)
- [ ] **Story 4.5:** Context awareness (período, KPIs no prompt)
- [ ] **Story 4.6:** Streaming responses (exibir resposta em tempo real)

**Output:** Chat funcional com análises contextuais de dados

---

### Fase 5: Validação & Refinamento (6-8h)
- [ ] **Story 5.1:** Testes integração (Google Sheets + Supabase + API)
- [ ] **Story 5.2:** Testes UI (responsividade, gráficos, interatividade)
- [ ] **Story 5.3:** Testes chat IA (contexto, histórico, respostas)
- [ ] **Story 5.4:** Performance tuning (< 2s dashboard, < 5s chat)
- [ ] **Story 5.5:** Lint e typecheck (npm run lint, npm run typecheck)
- [ ] **Story 5.6:** Deploy em Vercel (setup auto-deploy, Cron)
- [ ] **Story 5.7:** QA final e documentação

**Output:** MVP pronto para produção

---

## 🔌 Dependências Externas

| Serviço | Propósito | Configuração | Custo |
|---------|-----------|--------------|-------|
| **Google Sheets API** | Ler Lancamentos2026 e Orçamento2026 | API Key + OAuth2 | Free tier |
| **Supabase** | Database PostgreSQL gerenciado | Projeto + chaves | Free tier |
| **Claude API** | Chat com IA | Token Plano Pro Anthropic | Incluído no plano |
| **Vercel** | Deploy + Cron Jobs | GitHub integration | Free tier |

---

## 📈 Padrões de Código

### TypeScript Types (lib/types.ts)
```typescript
export interface Transaction {
  id: string;
  date: Date;
  type: 'entrada' | 'saída';
  category: string;
  value: number;
  description?: string;
  created_at: Date;
}

export interface KPI {
  realizado: number;
  projetado: number;
  percentual: number;
}

export interface DashboardData {
  periodo: string;
  tipo: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  kpis: {
    receitas: KPI;
    despesas: KPI;
    saldo: KPI;
  };
  chart_data: any[];
  top_gastos: any[];
  metas: any;
}
```

### API Route Pattern
```typescript
// app/api/[feature]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Validate input
    const params = new URL(req.url).searchParams;
    const periodo = params.get('periodo');

    // Query database
    const data = await db.getKPIs(periodo);

    // Return response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Component Pattern (Shadcn/ui)
```typescript
// components/dashboard/KPICard.tsx
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KPICardProps {
  title: string;
  realizado: number;
  projetado: number;
  percentual: number;
  variacao: string;
}

export function KPICard({
  title,
  realizado,
  projetado,
  percentual,
  variacao
}: KPICardProps) {
  const color = percentual >= 100 ? 'green' : percentual >= 80 ? 'yellow' : 'red';

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-bold">
          {realizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <Badge variant="outline" className={`text-${color}-600`}>
          {variacao}
        </Badge>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Projetado: {projetado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
      <p className={`mt-1 text-sm font-semibold text-${color}-600`}>
        {percentual.toFixed(1)}%
      </p>
    </Card>
  );
}
```

---

## 🚀 Deployment Checklist

### Pre-Deploy
- [ ] Todas as stories completadas e em QA
- [ ] Testes passando (npm test)
- [ ] Lint sem warnings (npm run lint)
- [ ] TypeCheck passing (npm run typecheck)
- [ ] Performance < 2s (Lighthouse)
- [ ] Variáveis .env configuradas em Vercel

### Deploy em Vercel
- [ ] GitHub repo criado e sincronizado
- [ ] Vercel projeto conectado (auto-deploy on push)
- [ ] Environment variables configuradas em Vercel
- [ ] Build preview funcionando
- [ ] Deploy para production

### Post-Deploy
- [ ] Supabase sync status OK
- [ ] Google Sheets connection OK
- [ ] Claude API responding
- [ ] Cron job executado com sucesso
- [ ] Dashboard carregando dados reais

---

## 📝 Decisões Arquiteturais

| Decisão | Opção Escolhida | Justificativa |
|---------|-----------------|---------------|
| **Frontend Framework** | Next.js 14+ App Router | Full-stack, SSR, serverless, otimizado Vercel |
| **UI Component Library** | Shadcn/ui + Tailwind | Profissional, acessível, customizável, design system |
| **Charts** | Recharts | Interativo, responsivo, integração React natural |
| **Backend** | Next.js API Routes | Sem servidor extra, integrado, escalável |
| **Database** | Supabase (PostgreSQL) | Gerenciado, realtime, RLS, free tier generous |
| **IA** | Claude API (Plano Pro) | Melhor análise contextual, custo zero incremental |
| **Sync** | Google Sheets API + Vercel Cron | Confiável, automático, barato |
| **Deploy** | Vercel | Nativo Next.js, gratuito, rápido, serverless |
| **Authentication** | Nenhuma (MVP) | Acesso pessoal apenas, pode adicionar depois |
| **State Management** | React Context | Simples para MVP, sem libs extras |

---

## 🎨 Design Principles

1. **Simplicity First** — Nada desnecessário, cada componente serve um propósito
2. **TypeScript Everywhere** — Type safety em frontend, backend, database queries
3. **Error Handling** — Explicit errors, graceful fallbacks, user feedback claro
4. **Performance** — < 2s dashboard, < 5s chat, cache agressivo onde faz sentido
5. **Accessibility** — Shadcn/ui components seguem a11y, cores inclusivas
6. **Responsiveness** — Mobile-first, desktop optimizado
7. **Maintainability** — Componentes pequenos, tipos explícitos, testes claros

---

## 🔗 Próximos Passos

1. **@sm (River):** Quebrar em stories (já tem fases acima)
2. **@dev (Dex):** Implementar conforme stories na ordem de fases
3. **@qa (QA):** QA gate em cada story (testes, performance, accessibility)
4. **@devops (Gage):** Deploy em Vercel, setup Cron, monitoramento

---

**Status:** ✅ Pronto para implementação
**Última atualização:** 2026-02-20
**Próxima revisão:** Após Phase 1 (setup infra)

— Aria, arquitetando o futuro 🏗️
