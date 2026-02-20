# Database Schema - Dashboard Financeiro Pessoal

**Domain:** Personal Finance Dashboard
**Technology:** Supabase (PostgreSQL)
**Generated:** 2026-02-20

---

## Domain Context

The Personal Finance Dashboard enables users to:
1. Track income and expenses with Google Sheets sync (daily)
2. Set and monitor monthly budgets per category
3. Define monthly/yearly financial goals
4. Chat with AI context-aware assistant about financial data
5. Audit all data synchronizations

---

## Core Entities

### 1. TRANSACTIONS
Stores financial transactions (income/expenses) synced from Google Sheets or entered manually.

**Table:** `transactions`
**Scope:** User-owned
**Lifecycle:** Mutable, soft-deletable
**Access Patterns:** By user + date range, by category, aggregations

**Schema:**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core attributes
  amount DECIMAL(15, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'google_sheets')),

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,

  -- Sync reference
  external_id TEXT, -- For Google Sheets row tracking
  sync_id UUID REFERENCES sync_logs(id) ON DELETE SET NULL
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_created ON transactions(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_external_id ON transactions(external_id) WHERE deleted_at IS NULL;

COMMENT ON TABLE transactions IS 'Financial transactions (income/expense), synced from Google Sheets or manually entered';
COMMENT ON COLUMN transactions.amount IS 'Transaction amount in currency units (always positive, type determines direction)';
COMMENT ON COLUMN transactions.external_id IS 'Reference to source row in Google Sheets for sync idempotence';
```

---

### 2. BUDGETS
Monthly budget limits per category to track spending.

**Table:** `budgets`
**Scope:** User-owned
**Lifecycle:** Mutable, soft-deletable
**Access Patterns:** By user + month, by category, month-over-month analysis

**Schema:**
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Budget definition
  year_month DATE NOT NULL, -- First day of month (YYYY-MM-01)
  category TEXT NOT NULL,
  limit_amount DECIMAL(15, 2) NOT NULL,
  notes TEXT,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,

  CONSTRAINT valid_budget_amount CHECK (limit_amount > 0),
  CONSTRAINT unique_user_month_category UNIQUE (user_id, year_month, category) WHERE deleted_at IS NULL
);

CREATE INDEX idx_budgets_user_month ON budgets(user_id, year_month DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_budgets_user_category ON budgets(user_id, category) WHERE deleted_at IS NULL;

COMMENT ON TABLE budgets IS 'Monthly budget limits per spending category';
COMMENT ON COLUMN budgets.year_month IS 'Month target - always first day of month (YYYY-MM-01)';
COMMENT ON COLUMN budgets.limit_amount IS 'Maximum allowed spending for this category in this month';
```

---

### 3. GOALS
Financial goals (monthly or yearly targets).

**Table:** `goals`
**Scope:** User-owned
**Lifecycle:** Mutable, statusable
**Access Patterns:** By user + status, by period, progress tracking

**Schema:**
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Goal definition
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,

  -- Timeline
  period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  completion_date TIMESTAMPTZ,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,

  CONSTRAINT valid_goal_amount CHECK (target_amount > 0),
  CONSTRAINT valid_current_amount CHECK (current_amount >= 0),
  CONSTRAINT valid_dates CHECK (start_date < end_date),
  CONSTRAINT completion_requires_date CHECK (
    (status != 'completed') OR (completion_date IS NOT NULL)
  )
);

CREATE INDEX idx_goals_user_status ON goals(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_user_period ON goals(user_id, period, start_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_user_created ON goals(user_id, created_at DESC) WHERE deleted_at IS NULL;

COMMENT ON TABLE goals IS 'Financial goals tracked monthly or yearly';
COMMENT ON COLUMN goals.current_amount IS 'Calculated progress toward target (updated via trigger or batch job)';
COMMENT ON COLUMN goals.period IS 'Goal duration: monthly or yearly';
```

---

### 4. CHAT_MESSAGES
Conversation history with context-aware AI assistant.

**Table:** `chat_messages`
**Scope:** User-owned
**Lifecycle:** Immutable (create-only), soft-deletable
**Access Patterns:** By user + date, by context period, conversation threading

**Schema:**
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Message content
  message_text TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),

  -- Context window
  context_start_date DATE,
  context_end_date DATE,
  context_metadata JSONB DEFAULT '{}'::jsonb,

  -- Thread tracking
  parent_message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,

  -- Audit (immutable)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT valid_context_dates CHECK (
    (context_start_date IS NULL AND context_end_date IS NULL) OR
    (context_start_date IS NOT NULL AND context_end_date IS NOT NULL AND context_start_date <= context_end_date)
  )
);

CREATE INDEX idx_chat_user_created ON chat_messages(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_chat_user_context ON chat_messages(user_id, context_start_date, context_end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_chat_parent ON chat_messages(parent_message_id) WHERE deleted_at IS NULL;

COMMENT ON TABLE chat_messages IS 'Chat history with context-aware AI assistant, immutable audit trail';
COMMENT ON COLUMN chat_messages.context_metadata IS 'Additional context: summary stats, category breakdown, etc (JSONB flexible)';
COMMENT ON COLUMN chat_messages.parent_message_id IS 'Reference to previous message for conversation threading';
```

---

### 5. SYNC_LOGS
Audit trail for all data synchronizations.

**Table:** `sync_logs`
**Scope:** User-owned
**Lifecycle:** Immutable (append-only)
**Access Patterns:** By user + sync type, by status, temporal aggregations

**Schema:**
```sql
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Sync definition
  sync_type TEXT NOT NULL CHECK (sync_type IN ('google_sheets_transactions', 'budget_import', 'manual_import')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),

  -- Results
  records_processed INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,

  -- Error tracking
  error_message TEXT,

  -- Additional context
  sync_metadata JSONB DEFAULT '{}'::jsonb,

  -- Audit (immutable)
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  CONSTRAINT valid_timestamps CHECK (completed_at IS NULL OR completed_at >= started_at),
  CONSTRAINT results_non_negative CHECK (
    records_processed >= 0 AND
    records_inserted >= 0 AND
    records_updated >= 0 AND
    records_failed >= 0
  )
);

CREATE INDEX idx_sync_logs_user_type ON sync_logs(user_id, sync_type, completed_at DESC);
CREATE INDEX idx_sync_logs_user_status ON sync_logs(user_id, status, completed_at DESC);
CREATE INDEX idx_sync_logs_created ON sync_logs(completed_at DESC);

COMMENT ON TABLE sync_logs IS 'Immutable audit log of all data synchronization events';
COMMENT ON COLUMN sync_logs.sync_metadata IS 'Additional sync context: source details, import parameters, etc';
COMMENT ON COLUMN sync_logs.records_processed IS 'Total records attempted in this sync';
```

---

## Relationships Summary

| Source | Target | Type | Cascade |
|--------|--------|------|---------|
| users | transactions | 1:N | CASCADE |
| users | budgets | 1:N | CASCADE |
| users | goals | 1:N | CASCADE |
| users | chat_messages | 1:N | CASCADE |
| users | sync_logs | 1:N | CASCADE |
| sync_logs | transactions | 1:N | SET NULL |
| transactions | chat_context | M:N implicit (via date range) | — |
| budgets | transactions | M:N implicit (via category) | — |

---

## Access Patterns

### 1. User-Scoped Data Access
All tables implement RLS: `user_id = auth.uid()`

### 2. Transaction Queries
- Dashboard summary: `SELECT SUM(amount) WHERE type='expense' AND DATE_TRUNC('month', transaction_date) = CURRENT_MONTH`
- Category breakdown: `GROUP BY category, EXTRACT(MONTH FROM transaction_date)`
- Budget vs actual: JOIN transactions WITH budgets ON category + month
- Search: `WHERE description ILIKE '%search_term%'`

### 3. Goal Progress Tracking
- Active goals: `WHERE status='active' AND end_date >= TODAY`
- Period analysis: `WHERE EXTRACT(YEAR FROM start_date) = CURRENT_YEAR`
- Completion check: `current_amount >= target_amount`

### 4. Chat Context Loading
- Conversation thread: `WHERE parent_message_id = ?` (recursive)
- Period context: `WHERE context_start_date <= ? AND context_end_date >= ?`
- Latest messages: `ORDER BY created_at DESC LIMIT 50`

### 5. Sync Audit
- Last successful sync: `WHERE status='success' ORDER BY completed_at DESC LIMIT 1`
- Recent failures: `WHERE status='failed' AND completed_at >= NOW() - INTERVAL '7 days'`
- Import statistics: `GROUP BY sync_type, DATE_TRUNC('day', completed_at)`

---

## Business Rules & Constraints

### Transaction Rules
1. Amount must be positive (type determines direction)
2. Category must match predefined list (via CHECK constraint or domain)
3. transaction_date cannot be in future
4. external_id ensures idempotent Google Sheets sync

### Budget Rules
1. Limit amount must be positive
2. Only one budget per user/month/category (UNIQUE constraint)
3. Budget year_month always first day of month
4. Soft deletes preserve historical budgets

### Goal Rules
1. Target amount must be > 0
2. Current amount must be >= 0 and <= target amount
3. start_date < end_date (enforced via CHECK)
4. Completion requires completion_date to be set
5. Period must be 'monthly' or 'yearly'

### Chat Rules
1. Messages are immutable (no updates, soft-delete only)
2. Context dates are optional (NULL for no specific context)
3. Context dates must be consistent (both NULL or both NOT NULL)
4. Parent message must exist (referential integrity)

### Sync Rules
1. Audit trail is immutable (append-only)
2. Records processed >= inserted + updated + failed
3. Error message required if status='failed'
4. Timestamps must be logical (completed_at >= started_at)

---

## RLS Policies (Supabase Auth)

All tables implement:

```sql
-- Pattern: Users see only their own data
CREATE POLICY "{table}_users_own"
  ON {table}
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
```

Special handling for Supabase CLI testing (bypassed in development).

---

## Performance Considerations

### Indexes Strategy
- **User-scoped queries:** Composite index on (user_id, filter_column)
- **Time-series:** Index on (created_at DESC) for recent data
- **Soft deletes:** All indexes include `WHERE deleted_at IS NULL`
- **Category breakdown:** (user_id, category) for aggregations

### Query Optimization
- Dashboard summary queries will use partial indexes
- Budget vs actual uses category-based JOINs
- Chat retrieval filters by date range efficiently
- Sync audit uses status + timestamp composite index

### Scalability Notes
- Tables designed for 10K+ transactions/user
- DECIMAL(15,2) sufficient for currency values
- JSONB fields support flexible metadata without schema changes
- Soft deletes preserve historical data without table bloat

---

## Migration Strategy

Initial schema migration includes:
1. Create all 5 tables
2. Create all indexes
3. Create RLS policies
4. Add table/column comments
5. No seed data (empty tables for production)

Subsequent migrations will be additive (new columns, new indexes, new policies).

---

## Next Steps

1. ✓ Schema designed and documented
2. → Run dry-run to validate SQL
3. → Apply migration to Supabase
4. → Add seed data for development
5. → Implement application queries
6. → Monitor performance and adjust indexes
