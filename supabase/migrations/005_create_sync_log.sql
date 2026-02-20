-- Migration: Create sync_log table
-- Description: Audit log for data synchronization events
-- Status: Production

CREATE TABLE IF NOT EXISTS sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL CHECK (source IN ('google_sheets', 'manual')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  rows_processed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sync_log_created_at ON sync_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_log_source ON sync_log(source);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);

-- Enable RLS
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all authenticated users to read sync logs"
  ON sync_log FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role to insert sync logs"
  ON sync_log FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
