-- Migration: Create metas (goals) table
-- Description: Stores financial goals (annual and monthly)
-- Status: Production

CREATE TABLE IF NOT EXISTS metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  type VARCHAR(20) NOT NULL CHECK (type IN ('monthly', 'annual')),
  month VARCHAR(7), -- YYYY-MM format, required for monthly goals
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_metas_type ON metas(type);
CREATE INDEX IF NOT EXISTS idx_metas_month ON metas(month);

-- Enable RLS
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all authenticated users to read metas"
  ON metas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role to insert metas"
  ON metas FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role to update metas"
  ON metas FOR UPDATE
  USING (auth.role() = 'service_role');
