-- Migration: Create transactions table
-- Description: Stores all financial transactions (income and expenses)
-- Status: Production

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  source_sheet VARCHAR(50) NOT NULL, -- 'Lancamentos2026' or 'Orçamento2026'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date_category ON transactions(date DESC, category);

-- Enable RLS (Row Level Security)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all authenticated users to read
CREATE POLICY "Allow all authenticated users to read transactions"
  ON transactions FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy: Allow service role to insert
CREATE POLICY "Allow service role to insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
