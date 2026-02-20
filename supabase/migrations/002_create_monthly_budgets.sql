-- Migration: Create monthly_budgets table
-- Description: Stores monthly budget allocations by category
-- Status: Production

CREATE TABLE IF NOT EXISTS monthly_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month VARCHAR(7) NOT NULL, -- YYYY-MM format
  category VARCHAR(50) NOT NULL,
  budgeted_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month, category)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_month ON monthly_budgets(month);
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_category ON monthly_budgets(category);

-- Enable RLS
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all authenticated users to read budgets"
  ON monthly_budgets FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role to insert budgets"
  ON monthly_budgets FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
