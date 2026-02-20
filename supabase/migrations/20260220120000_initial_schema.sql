-- Initial Schema Migration - Dashboard Financeiro Pessoal
-- Domain: Personal Finance Dashboard
-- Generated: 2026-02-20
-- Technology: Supabase (PostgreSQL)

BEGIN;

-- ============================================================================
-- TABLE 1: TRANSACTIONS
-- ============================================================================

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
  sync_id UUID
);

-- Indexes for transactions
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_created ON transactions(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_external_id ON transactions(external_id) WHERE deleted_at IS NULL;

-- Comments for transactions
COMMENT ON TABLE transactions IS 'Financial transactions (income/expense), synced from Google Sheets or manually entered';
COMMENT ON COLUMN transactions.amount IS 'Transaction amount in currency units (always positive, type determines direction)';
COMMENT ON COLUMN transactions.type IS 'Type of transaction: income or expense';
COMMENT ON COLUMN transactions.category IS 'Spending/income category (e.g., alimentação, transporte, salário)';
COMMENT ON COLUMN transactions.transaction_date IS 'Date when the transaction occurred';
COMMENT ON COLUMN transactions.source IS 'Origin: manual entry or Google Sheets sync';
COMMENT ON COLUMN transactions.external_id IS 'Reference to source row in Google Sheets for sync idempotence';
COMMENT ON COLUMN transactions.sync_id IS 'Reference to sync event that created/updated this record';

-- ============================================================================
-- TABLE 2: BUDGETS
-- ============================================================================

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

  CONSTRAINT valid_budget_amount CHECK (limit_amount > 0)
);

-- Indexes for budgets
CREATE INDEX idx_budgets_user_month ON budgets(user_id, year_month DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_budgets_user_category ON budgets(user_id, category) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_budgets_unique_user_month_category ON budgets(user_id, year_month, category) WHERE deleted_at IS NULL;

-- Comments for budgets
COMMENT ON TABLE budgets IS 'Monthly budget limits per spending category';
COMMENT ON COLUMN budgets.year_month IS 'Month target - always first day of month (YYYY-MM-01)';
COMMENT ON COLUMN budgets.category IS 'Category for this budget limit';
COMMENT ON COLUMN budgets.limit_amount IS 'Maximum allowed spending for this category in this month';
COMMENT ON COLUMN budgets.notes IS 'Optional notes or justification for this budget';

-- ============================================================================
-- TABLE 3: GOALS
-- ============================================================================

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
  CONSTRAINT valid_current_amount CHECK (current_amount >= 0 AND current_amount <= target_amount),
  CONSTRAINT valid_dates CHECK (start_date < end_date),
  CONSTRAINT completion_requires_date CHECK (
    (status != 'completed') OR (completion_date IS NOT NULL)
  )
);

-- Indexes for goals
CREATE INDEX idx_goals_user_status ON goals(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_user_period ON goals(user_id, period, start_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_user_created ON goals(user_id, created_at DESC) WHERE deleted_at IS NULL;

-- Comments for goals
COMMENT ON TABLE goals IS 'Financial goals tracked monthly or yearly';
COMMENT ON COLUMN goals.title IS 'Goal name/title';
COMMENT ON COLUMN goals.target_amount IS 'Target monetary value for this goal';
COMMENT ON COLUMN goals.current_amount IS 'Current progress toward target (updated via triggers or batch)';
COMMENT ON COLUMN goals.period IS 'Goal duration: monthly or yearly';
COMMENT ON COLUMN goals.status IS 'Current status: active, completed, or cancelled';
COMMENT ON COLUMN goals.completion_date IS 'Timestamp when goal was completed (required if status=completed)';

-- ============================================================================
-- TABLE 4: CHAT_MESSAGES
-- ============================================================================

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

-- Indexes for chat_messages
CREATE INDEX idx_chat_user_created ON chat_messages(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_chat_user_context ON chat_messages(user_id, context_start_date, context_end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_chat_parent ON chat_messages(parent_message_id) WHERE deleted_at IS NULL;

-- Comments for chat_messages
COMMENT ON TABLE chat_messages IS 'Chat history with context-aware AI assistant, immutable audit trail';
COMMENT ON COLUMN chat_messages.message_text IS 'Full text of the message';
COMMENT ON COLUMN chat_messages.role IS 'Who sent the message: user or assistant';
COMMENT ON COLUMN chat_messages.context_start_date IS 'Start date of financial data context window (NULL = no specific context)';
COMMENT ON COLUMN chat_messages.context_end_date IS 'End date of financial data context window (NULL = no specific context)';
COMMENT ON COLUMN chat_messages.context_metadata IS 'Additional context data in JSONB: category summaries, totals, etc';
COMMENT ON COLUMN chat_messages.parent_message_id IS 'Reference to previous message for conversation threading';

-- ============================================================================
-- TABLE 5: SYNC_LOGS
-- ============================================================================

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

-- Indexes for sync_logs
CREATE INDEX idx_sync_logs_user_type ON sync_logs(user_id, sync_type, completed_at DESC);
CREATE INDEX idx_sync_logs_user_status ON sync_logs(user_id, status, completed_at DESC);
CREATE INDEX idx_sync_logs_created ON sync_logs(completed_at DESC);

-- Comments for sync_logs
COMMENT ON TABLE sync_logs IS 'Immutable audit log of all data synchronization events';
COMMENT ON COLUMN sync_logs.sync_type IS 'Type of sync: google_sheets_transactions, budget_import, or manual_import';
COMMENT ON COLUMN sync_logs.status IS 'Result: success, failed, or partial (some records failed)';
COMMENT ON COLUMN sync_logs.records_processed IS 'Total records attempted in this sync';
COMMENT ON COLUMN sync_logs.records_inserted IS 'Number of new records inserted';
COMMENT ON COLUMN sync_logs.records_updated IS 'Number of existing records updated';
COMMENT ON COLUMN sync_logs.records_failed IS 'Number of records that failed to process';
COMMENT ON COLUMN sync_logs.error_message IS 'Error details if status=failed';
COMMENT ON COLUMN sync_logs.sync_metadata IS 'Additional sync context in JSONB: source parameters, file info, etc';

-- ============================================================================
-- ADD FOREIGN KEY: transactions -> sync_logs (after sync_logs table exists)
-- ============================================================================

ALTER TABLE transactions ADD CONSTRAINT fk_transactions_sync_logs
  FOREIGN KEY (sync_id) REFERENCES sync_logs(id) ON DELETE SET NULL;

-- ============================================================================
-- RLS (Row Level Security) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Transactions: Users see only their own
CREATE POLICY "transactions_users_own"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Budgets: Users see only their own
CREATE POLICY "budgets_users_own"
  ON budgets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Goals: Users see only their own
CREATE POLICY "goals_users_own"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Chat Messages: Users see only their own
CREATE POLICY "chat_messages_users_own"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sync Logs: Users see only their own
CREATE POLICY "sync_logs_users_own"
  ON sync_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- BUSINESS LOGIC TRIGGERS
-- ============================================================================

-- Trigger: Update updated_at timestamp on transaction update
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();

-- Trigger: Update updated_at timestamp on budget update
CREATE OR REPLACE FUNCTION update_budgets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_budgets_updated_at();

-- Trigger: Update updated_at timestamp on goal update
CREATE OR REPLACE FUNCTION update_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_goals_updated_at();

-- Trigger: Prevent update of immutable chat messages
CREATE OR REPLACE FUNCTION prevent_chat_message_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.id IS NOT NULL THEN
    RAISE EXCEPTION 'Chat messages are immutable and cannot be updated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_chat_message_update
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION prevent_chat_message_update();

-- Trigger: Prevent update of immutable sync logs
CREATE OR REPLACE FUNCTION prevent_sync_log_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.id IS NOT NULL THEN
    RAISE EXCEPTION 'Sync logs are immutable and cannot be updated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_sync_log_update
  BEFORE UPDATE ON sync_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_sync_log_update();

-- ============================================================================
-- VALIDATION CHECKS & CONSTRAINTS
-- ============================================================================

-- Check: Transactions cannot have future dates
ALTER TABLE transactions ADD CONSTRAINT check_transaction_date_not_future
  CHECK (transaction_date <= CURRENT_DATE);

-- Check: Budgets year_month must be first day of month
ALTER TABLE budgets ADD CONSTRAINT check_budget_year_month_first_day
  CHECK (EXTRACT(DAY FROM year_month) = 1);

-- Check: Goal amounts are valid
ALTER TABLE goals ADD CONSTRAINT check_goal_amounts
  CHECK (target_amount > 0 AND current_amount >= 0);

COMMIT;

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================

/*
MIGRATION STATUS: INITIAL SCHEMA
Generated: 2026-02-20
Version: 1.0.0

TABLES CREATED:
✓ transactions (financial transaction records)
✓ budgets (monthly category budgets)
✓ goals (monthly/yearly financial goals)
✓ chat_messages (AI chat conversation history)
✓ sync_logs (data synchronization audit trail)

FEATURES IMPLEMENTED:
✓ UUID primary keys for all tables
✓ User-scoped isolation via RLS
✓ Soft deletes (deleted_at) for transactions, budgets, goals, chat_messages
✓ Immutable audit fields for chat_messages and sync_logs
✓ Comprehensive indexes for common query patterns
✓ Business logic constraints and triggers
✓ Foreign key relationships with proper cascade rules
✓ JSONB metadata fields for flexibility

NEXT STEPS:
1. Dry-run migration (verify SQL syntax)
2. Apply to Supabase development environment
3. Verify RLS policies with auth.users table
4. Add seed data for development/testing
5. Implement application query layer
6. Monitor performance and add indexes as needed
*/
