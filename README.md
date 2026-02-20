# 💰 Dashboard de Finanças Pessoais

Sistema de análise financeira integrado com Google Sheets e Supabase.

## 🎯 Objetivo

Dashboard dinâmico que sincroniza dados de planilhas Google Sheets com banco de dados Supabase para análise e visualização de finanças pessoais em tempo real.

## 🚀 Setup Inicial

### 1. Pré-requisitos

- Node.js 18+ instalado
- Projeto Supabase criado
- Google Cloud Project com Sheets API habilitada

### 2. Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

Variáveis **obrigatórias**:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase (backend)

Variáveis **para Google Sheets**:
- `GOOGLE_SHEETS_API_KEY` - API Key do Google Cloud
- `GOOGLE_SHEETS_SPREADSHEET_ID` - ID da planilha (extrair da URL)

### 3. Configurar Supabase

#### 3.1 Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha dados do projeto
4. Copie `NEXT_PUBLIC_SUPABASE_URL` e chaves para `.env.local`

#### 3.2 Executar Migrations

1. Vá para **SQL Editor** no dashboard Supabase
2. Crie uma nova query
3. Copie e execute cada arquivo em `supabase/migrations/`:
   - `001_create_transactions.sql`
   - `002_create_monthly_budgets.sql`
   - `003_create_metas.sql`
   - `004_create_chat_messages.sql`
   - `005_create_sync_log.sql`

Ou use o script automático (em desenvolvimento):
```bash
node run-migrations.js
```

### 4. Configurar Google Sheets API

#### 4.1 Criar Google Cloud Project

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Habilite **Google Sheets API**:
   - Menu superior > APIs & Services > Enable APIs and Services
   - Procure "Google Sheets API"
   - Clique em "Enable"

#### 4.2 Criar API Key

1. Vá para **Credentials** (Credenciais)
2. Clique em "Create Credentials" > "API Key"
3. Copie a chave e adicione a `.env.local`:
   ```
   GOOGLE_SHEETS_API_KEY=sua_chave_aqui
   ```

#### 4.3 Configurar Spreadsheet ID

1. Abra sua planilha Google Sheets
2. A URL será: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. Copie o `{SPREADSHEET_ID}` para `.env.local`:
   ```
   GOOGLE_SHEETS_SPREADSHEET_ID=seu_id_aqui
   ```

### 5. Verificar Conexões

```bash
npm run test
# ou
npm run test:db
```

Teste esperado:
```
✅ Supabase: Connection successful
✅ Google Sheets: Connection successful
   Spreadsheet: Meu Dashboard 2026
   Sheets: Lancamentos2026, Orçamento2026
```

## 📁 Estrutura do Projeto

```
.
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   └── layout.tsx                # Layout raiz
├── lib/
│   ├── db.ts                     # Cliente Supabase
│   ├── google-sheets.ts          # Cliente Google Sheets
│   ├── types.ts                  # TypeScript Types
│   └── tests/
│       └── connection.test.ts    # Testes de conexão
├── public/                        # Assets estáticos
├── supabase/
│   └── migrations/                # Database migrations
│       ├── 001_create_transactions.sql
│       ├── 002_create_monthly_budgets.sql
│       ├── 003_create_metas.sql
│       ├── 004_create_chat_messages.sql
│       └── 005_create_sync_log.sql
├── .env.local                     # Variáveis de ambiente (local, não commitado)
├── .env.example                   # Exemplo de variáveis
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md                      # Este arquivo
```

## 📊 Database Schema

### transactions
Armazena todas as transações financeiras.
- `id`: UUID
- `date`: Data da transação
- `description`: Descrição
- `amount`: Valor
- `category`: Categoria
- `type`: 'income' ou 'expense'
- `source_sheet`: Fonte (Lancamentos2026, etc)

### monthly_budgets
Orçamentos mensais por categoria.
- `id`: UUID
- `month`: YYYY-MM
- `category`: Categoria
- `budgeted_amount`: Valor orçado
- UNIQUE constraint: (month, category)

### metas
Metas financeiras anuais/mensais.
- `id`: UUID
- `title`: Título
- `type`: 'monthly' ou 'annual'
- `target_amount`: Meta
- `current_amount`: Valor atual

### chat_messages
Histórico de conversas com IA.
- `id`: UUID
- `role`: 'user' ou 'assistant'
- `content`: Mensagem
- `context`: JSON com contexto

### sync_log
Auditoria de sincronizações.
- `id`: UUID
- `source`: 'google_sheets' ou 'manual'
- `status`: 'success', 'error', 'pending'
- `rows_processed`: Linhas processadas

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev       # Inicia servidor Next.js em localhost:3000

# Produção
npm run build     # Build para produção
npm start         # Inicia servidor em produção

# Qualidade
npm run lint      # Type checking (TypeScript)
npm run typecheck # Alias para lint

# Testes
npm test          # Testa conexões Supabase e Google Sheets
npm run test:db   # Alias para test
```

## 🔐 Segurança

- **Nunca commite `.env.local`** com credenciais reais
- Use variáveis de ambiente para dados sensíveis
- Supabase RLS (Row Level Security) habilitado em todas as tabelas
- Keys anônimas são seguras para operações públicas

## 📝 Próximos Passos

1. ✅ Story 1.1: Setup Supabase e Google Sheets (atual)
2. 📋 Story 1.2: Sync budget Orçamento2026 para DB
3. 📋 Story 1.3: Daily cron sync Lancamentos2026
4. 📋 Story 2.1: Layout base e componentes UI
5. 📋 Story 2.2+: KPIs, gráficos e funcionalidades

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📞 Suporte

Para questões sobre setup:
1. Verifique `.env.local` tem todas variáveis
2. Execute `npm run test` para diagnosticar conexões
3. Verifique logs no Supabase Dashboard
4. Consulte documentação oficial das APIs

---

**Last Updated:** 2026-02-20
**Status:** Setup (Story 1.1 - In Development)
