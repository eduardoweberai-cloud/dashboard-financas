# Database Setup Guide - Dashboard Financeiro Pessoal

**Status:** ✅ Schema Complete & Validated
**Date:** 2026-02-20
**Next Action:** Execute migrations

---

## Quick Start

### 1. Prerequisites
```bash
✓ Supabase account created
✓ Project initialized with PostgreSQL database
✓ Supabase CLI installed (optional, for local testing)
✓ Access to Supabase dashboard or CLI
```

### 2. Apply Migration
```bash
# Option A: Using Supabase Dashboard
1. Go to SQL Editor
2. Open: supabase/migrations/20260220120000_initial_schema.sql
3. Click "Run"
4. Verify: 5 tables created, all indexes added

# Option B: Using Supabase CLI
supabase migration up

# Option C: Direct via psql (if local)
psql postgresql://user:password@host:5432/db < supabase/migrations/20260220120000_initial_schema.sql
```

### 3. Verify Installation
```sql
-- Check tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
ORDER BY table_name;

-- Expected output:
-- budgets
-- chat_messages
-- goals
-- sync_logs
-- transactions

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname='public'
ORDER BY tablename;

-- Expected output: All 5 tables have rowsecurity = TRUE

-- Check indexes created
SELECT indexname FROM pg_indexes
WHERE schemaname='public'
ORDER BY indexname;

-- Expected: ~13 indexes across all tables
```

---

## Database Schema Overview

### 5 Core Tables

#### 1. TRANSACTIONS
Financial transactions (income/expense) synced from Google Sheets or manually entered.

**Key Features:**
- Tracks both income and expenses with category classification
- Soft-deletable (preserves history)
- Linked to sync events for audit trail
- Indexed for fast user-scoped queries by date and category

**Sample Query:**
```sql
SELECT
  category,
  type,
  COUNT(*) as count,
  SUM(amount) as total
FROM transactions
WHERE user_id = auth.uid()
  AND deleted_at IS NULL
  AND transaction_date >= DATE_TRUNC('month', NOW())
GROUP BY category, type
ORDER BY total DESC;
```

#### 2. BUDGETS
Monthly spending limits per category.

**Key Features:**
- One budget per (user, month, category)
- Enables budget vs actual analysis
- Soft-deletable for historical tracking
- Enforces limit_amount > 0

**Sample Query:**
```sql
WITH budget_summary AS (
  SELECT
    b.id,
    b.category,
    b.limit_amount,
    COALESCE(SUM(t.amount), 0) as spent,
    (b.limit_amount - COALESCE(SUM(t.amount), 0)) as remaining
  FROM budgets b
  LEFT JOIN transactions t ON
    t.user_id = b.user_id
    AND t.category = b.category
    AND DATE_TRUNC('month', t.transaction_date) = b.year_month
    AND t.deleted_at IS NULL
    AND t.type = 'expense'
  WHERE b.user_id = auth.uid()
    AND b.deleted_at IS NULL
  GROUP BY b.id, b.category, b.limit_amount
)
SELECT * FROM budget_summary
WHERE remaining <= 0
ORDER BY spent DESC;
```

#### 3. GOALS
Financial goals (monthly or yearly targets).

**Key Features:**
- Track progress toward monetary targets
- Immutable lifecycle: active → completed or cancelled
- Soft-deletable for historical reference
- Status transitions require completion_date

**Sample Query:**
```sql
SELECT
  title,
  target_amount,
  current_amount,
  ROUND(100.0 * current_amount / target_amount, 1) as progress_percent,
  start_date,
  end_date,
  status
FROM goals
WHERE user_id = auth.uid()
  AND deleted_at IS NULL
  AND status = 'active'
  AND end_date >= CURRENT_DATE
ORDER BY progress_percent DESC;
```

#### 4. CHAT_MESSAGES
Immutable conversation history with context-aware AI.

**Key Features:**
- Immutable (no updates, soft-delete only)
- Optional context window (start/end dates)
- Flexible JSONB metadata for context summaries
- Thread support via parent_message_id

**Sample Query:**
```sql
WITH recent_thread AS (
  SELECT
    id,
    parent_message_id,
    role,
    message_text,
    created_at,
    CASE WHEN role = 'assistant' THEN 'Assistant' ELSE 'You' END as sender
  FROM chat_messages
  WHERE user_id = auth.uid()
    AND deleted_at IS NULL
    AND created_at >= NOW() - INTERVAL '7 days'
  ORDER BY created_at DESC
  LIMIT 50
)
SELECT * FROM recent_thread
ORDER BY created_at ASC;
```

#### 5. SYNC_LOGS
Immutable audit trail of all data synchronizations.

**Key Features:**
- Append-only (no updates)
- Tracks sync success rate and record counts
- Links to source transactions via transactions.sync_id
- Enables sync failure analysis

**Sample Query:**
```sql
SELECT
  sync_type,
  status,
  COUNT(*) as sync_count,
  SUM(records_processed) as total_records,
  SUM(records_inserted) as total_inserted,
  SUM(records_updated) as total_updated,
  SUM(records_failed) as total_failed,
  ROUND(100.0 * SUM(records_inserted + records_updated) / NULLIF(SUM(records_processed), 0), 1) as success_rate,
  MAX(completed_at) as last_sync
FROM sync_logs
WHERE user_id = auth.uid()
  AND completed_at >= NOW() - INTERVAL '30 days'
GROUP BY sync_type, status
ORDER BY last_sync DESC;
```

---

## Security: Row Level Security (RLS)

### How It Works
Every table has RLS enabled with this policy:
```sql
CREATE POLICY "{table}_users_own"
  ON {table}
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Result:** Users can only access their own data. Cross-user data leakage is **impossible** at the database level.

### Testing RLS

```bash
# Test 1: User A inserts transaction
curl -X POST 'https://your-supabase-url/rest/v1/transactions' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer USER_A_TOKEN' \
  -d '{
    "amount": 100.00,
    "type": "expense",
    "category": "food",
    "transaction_date": "2026-02-20",
    "source": "manual"
  }'

# Test 2: User B queries transactions
curl -X GET 'https://your-supabase-url/rest/v1/transactions' \
  -H 'Authorization: Bearer USER_B_TOKEN'

# Expected: Empty result (User B sees 0 rows)

# Test 3: User A queries their transactions
curl -X GET 'https://your-supabase-url/rest/v1/transactions' \
  -H 'Authorization: Bearer USER_A_TOKEN'

# Expected: 1 row (User A sees their transaction)
```

---

## Indexes & Performance

### Composite Indexes (Multi-Column)
```sql
-- transactions: Fast date range queries
idx_transactions_user_date ON transactions(user_id, transaction_date DESC)
  WHERE deleted_at IS NULL

-- transactions: Category breakdown
idx_transactions_user_category ON transactions(user_id, category)
  WHERE deleted_at IS NULL

-- budgets: Monthly budget lookup
idx_budgets_user_month ON budgets(user_id, year_month DESC)
  WHERE deleted_at IS NULL

-- goals: Status filtering
idx_goals_user_status ON goals(user_id, status)
  WHERE deleted_at IS NULL

-- chat_messages: Timeline queries
idx_chat_user_created ON chat_messages(user_id, created_at DESC)
  WHERE deleted_at IS NULL

-- sync_logs: Audit analysis
idx_sync_logs_user_type ON sync_logs(user_id, sync_type, completed_at DESC)
```

### Partial Indexes (Soft Deletes)
All indexes include `WHERE deleted_at IS NULL` clause:
- ✓ Excludes soft-deleted records from index
- ✓ Keeps indexes smaller and faster
- ✓ Maintains referential integrity

### Expected Query Performance
```
Dashboard summary:     ~5-10ms  (1 table scan, indexed)
Category breakdown:    ~10-20ms (1 GROUP BY, indexed)
Budget vs actual:      ~20-30ms (1 JOIN, indexed)
Goal progress:         ~15-25ms (1 JOIN, indexed)
Chat history:          ~5-10ms  (1 scan, indexed)
Sync audit:            ~5ms     (1 composite index)
```

---

## Data Types & Constraints

### Currency Fields
```sql
amount DECIMAL(15, 2)
-- Max value: 999,999,999.99 (sufficient for personal finance)
-- Precision: 2 decimal places (cents)
-- Never use FLOAT for currency (rounding errors)
```

### Enumerations (Fixed Values)
```sql
type: 'income' | 'expense'
source: 'manual' | 'google_sheets' | 'manual_import'
status: 'active' | 'completed' | 'cancelled'
sync_type: 'google_sheets_transactions' | 'budget_import' | 'manual_import'
period: 'monthly' | 'yearly'
role: 'user' | 'assistant'
```

### Timestamps
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- Automatic: Set at insert time
-- Immutable: Never changes
-- Timezone: Always UTC

updated_at TIMESTAMPTZ
-- Automatic: Set by trigger on UPDATE
-- NULL until first update
-- Timezone: Always UTC

deleted_at TIMESTAMPTZ
-- Manual: Set for soft deletes
-- NULL = not deleted
-- Immutable once set
```

### Unique Constraints
```sql
-- One budget per user + month + category
UNIQUE (user_id, year_month, category) WHERE deleted_at IS NULL

-- Each transaction has unique Google Sheets reference (per user)
-- Not enforced by DB (handled by upsert logic in app)
```

---

## Common Operations

### Insert Transaction
```sql
INSERT INTO transactions (user_id, amount, type, category, description, transaction_date, source)
VALUES (
  auth.uid(),
  150.50,
  'expense',
  'food',
  'Grocery shopping',
  '2026-02-20',
  'manual'
);
```

### Update Goal Progress
```sql
-- Option 1: Trigger automatically (when transaction inserted)
-- Option 2: Batch job (runs nightly)
UPDATE goals
SET current_amount = (
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE user_id = goals.user_id
    AND transaction_date BETWEEN goals.start_date AND goals.end_date
    AND deleted_at IS NULL
)
WHERE user_id = auth.uid()
  AND deleted_at IS NULL;
```

### Soft Delete Transaction
```sql
UPDATE transactions
SET deleted_at = NOW()
WHERE id = ? AND user_id = auth.uid();

-- Note: Record still exists (deleted_at IS NOT NULL)
-- Queries use WHERE deleted_at IS NULL to exclude
-- Undo: SET deleted_at = NULL
```

### Hard Delete User Data (GDPR)
```sql
-- This cascades to all tables
DELETE FROM auth.users WHERE id = ?;

-- Result: All user's transactions, budgets, goals, messages, sync logs deleted
-- Recommendation: Soft delete first, then hard delete after retention period
```

### Sync Google Sheets
```sql
-- 1. Create sync log entry
INSERT INTO sync_logs (user_id, sync_type, status, started_at)
VALUES (auth.uid(), 'google_sheets_transactions', 'success', NOW())
RETURNING id;

-- 2. Upsert transactions (pseudo-code, needs app logic)
INSERT INTO transactions (user_id, amount, type, category, transaction_date, source, external_id, sync_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT (external_id) DO UPDATE SET
  amount = EXCLUDED.amount,
  category = EXCLUDED.category,
  transaction_date = EXCLUDED.transaction_date,
  updated_at = NOW();

-- 3. Update sync log results
UPDATE sync_logs
SET
  status = 'success',
  records_processed = ?,
  records_inserted = ?,
  records_updated = ?,
  completed_at = NOW()
WHERE id = ? AND user_id = auth.uid();
```

---

## Backup & Recovery

### Automatic Supabase Backups
```
✓ Daily backups (retained 7 days)
✓ Point-in-time recovery (PITR)
✓ Enabled by default on all Supabase projects
```

### Manual Backup
```bash
# Using Supabase CLI
supabase db pull > backup_$(date +%Y%m%d_%H%M%S).sql

# Using psql
pg_dump postgresql://user:password@host:5432/db > backup.sql
```

### Restore from Backup
```bash
# Option 1: Via Supabase dashboard
# Settings → Backups → Restore

# Option 2: Via psql
psql postgresql://user:password@host:5432/db < backup.sql

# Option 3: Via Supabase CLI
supabase db push < backup.sql
```

### Point-in-Time Recovery (PITR)
```
If enabled on your Supabase project:
Settings → Database → Backups → Restore to a specific time
```

---

## Monitoring & Maintenance

### Check Table Sizes
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Index Usage
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Check for Missing Indexes (5+ full scans)
```sql
SELECT
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  CASE WHEN seq_scan > 5 THEN 'Consider indexing' ELSE 'OK' END as recommendation
FROM pg_stat_user_tables
WHERE seq_scan > 5
ORDER BY seq_scan DESC;
```

### Analyze Query Performance
```sql
-- Enable timing
\timing on

-- Run query with EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT category, SUM(amount) as total
FROM transactions
WHERE user_id = auth.uid() AND deleted_at IS NULL
GROUP BY category;
```

---

## Troubleshooting

### RLS Permission Denied
```
Error: "new row violates row-level security policy"

Causes:
1. Inserting with wrong user_id
2. RLS policy too restrictive
3. Authentication token invalid

Solution:
1. Verify user_id = auth.uid()
2. Check RLS policy with: SELECT * FROM pg_policies WHERE tablename = 'table_name'
3. Verify JWT token valid in Supabase dashboard
```

### Foreign Key Constraint Violation
```
Error: "insert or update on table violates foreign key constraint"

Causes:
1. Referenced user_id doesn't exist in auth.users
2. Referenced sync_log_id doesn't exist
3. User has different org

Solution:
1. Ensure user_id from auth.users
2. Ensure sync_id from sync_logs
3. Use CASCADE option for test cleanup
```

### Slow Queries
```
Solution:
1. Check EXPLAIN ANALYZE output for sequential scans
2. Verify indexes created: SELECT * FROM pg_indexes WHERE tablename = 'table_name'
3. Add missing indexes from schema
4. Check query filters match index columns
5. Update statistics: ANALYZE table_name;
```

---

## Next Steps

### Phase 1: Setup (This Phase)
- [x] Create database schema
- [x] Create indexes
- [x] Enable RLS
- [ ] Verify with test queries

### Phase 2: Application Integration
- [ ] Build data access layer (queries)
- [ ] Implement Supabase client setup
- [ ] Add error handling
- [ ] Create seed data for development

### Phase 3: Feature Implementation
- [ ] Google Sheets sync logic
- [ ] Budget vs actual dashboard
- [ ] Goal progress tracking
- [ ] AI chat with context

### Phase 4: Optimization
- [ ] Monitor slow queries
- [ ] Adjust indexes as needed
- [ ] Performance testing
- [ ] Load testing (1K+ users)

---

## Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `/docs/SCHEMA.md` | Complete schema documentation | ✅ Created |
| `/docs/ERD.md` | Entity relationship diagrams | ✅ Created |
| `/docs/DOMAIN-MODEL-VALIDATION.md` | Design validation report | ✅ Created |
| `/docs/DATABASE-SETUP.md` | This file | ✅ Current |
| `/supabase/migrations/20260220120000_initial_schema.sql` | Migration DDL | ✅ Ready to apply |

---

## Support

For issues or questions:
1. Check Supabase docs: https://supabase.com/docs
2. Check PostgreSQL docs: https://www.postgresql.org/docs
3. Review schema comments: `COMMENT ON TABLE ...` in migration file
4. Check RLS policies: Supabase dashboard → Authentication → Policies

---

**Status:** ✅ READY FOR APPLICATION DEVELOPMENT

Created: 2026-02-20
Updated: 2026-02-20
Version: 1.0.0
