# Migration Deployment Checklist
## Initial Schema - Dashboard Financeiro Pessoal

**Project:** jictijobzwhzzwmrljwr (Supabase)
**Migration:** `supabase/migrations/20260220120000_initial_schema.sql`
**Date:** 2026-02-20

---

## Pre-Deployment Verification

- [x] Migration file exists and is readable
- [x] SQL syntax validated (418 lines, 16KB)
- [x] Environment configuration present (.env.local)
- [x] Baseline snapshot created (2026-02-20_056735_baseline.sql)
- [x] All required objects counted:
  - [x] 5 tables
  - [x] 15 indexes
  - [x] 5 trigger functions
  - [x] 5 triggers
  - [x] 5 RLS policies

---

## Deployment Steps

### Step 1: Access Supabase SQL Editor
- [ ] Navigate to: https://app.supabase.com/project/jictijobzwhzzwmrljwr
- [ ] Login with credentials
- [ ] Click "SQL Editor" in left sidebar
- [ ] Verify database connection active

### Step 2: Create New Query
- [ ] Click "New Query" button
- [ ] Verify editor is blank
- [ ] Ready to paste SQL

### Step 3: Load Migration SQL
- [ ] Open file: `supabase/migrations/20260220120000_initial_schema.sql`
- [ ] Copy entire contents (Ctrl+A, Ctrl+C)
- [ ] Paste into SQL editor (Ctrl+V)
- [ ] Verify all lines loaded (should be 418 lines)

### Step 4: Execute Migration
- [ ] Review SQL one more time
- [ ] Click "Run" button
- [ ] Wait for execution to complete
- [ ] Check for error messages (should see success)

### Step 5: Verify Tables Created
Execute in SQL Editor:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```
- [ ] budgets
- [ ] chat_messages
- [ ] goals
- [ ] sync_logs
- [ ] transactions

### Step 6: Verify Indexes Created
Execute in SQL Editor:
```sql
SELECT COUNT(*) as index_count FROM pg_indexes
WHERE schemaname = 'public';
```
- [ ] Should return: 15

### Step 7: Verify RLS Policies
Execute in SQL Editor:
```sql
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public' ORDER BY tablename;
```
- [ ] transactions_users_own (transactions)
- [ ] budgets_users_own (budgets)
- [ ] goals_users_own (goals)
- [ ] chat_messages_users_own (chat_messages)
- [ ] sync_logs_users_own (sync_logs)

### Step 8: Verify Triggers
Execute in SQL Editor:
```sql
SELECT trigger_name, event_object_table FROM information_schema.triggers
WHERE trigger_schema = 'public' ORDER BY event_object_table;
```
- [ ] trg_update_transactions_updated_at (transactions)
- [ ] trg_update_budgets_updated_at (budgets)
- [ ] trg_update_goals_updated_at (goals)
- [ ] trg_prevent_chat_message_update (chat_messages)
- [ ] trg_prevent_sync_log_update (sync_logs)

---

## Post-Deployment Testing

### Test 1: Verify Constraint - Future Date Check
Execute in SQL Editor:
```sql
-- This should FAIL (transaction date in future)
INSERT INTO transactions (user_id, amount, type, category, transaction_date, source)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, 100.00, 'income', 'salary', CURRENT_DATE + INTERVAL '1 day', 'manual');
```
- [ ] Should raise: "transaction_date <= CURRENT_DATE" error

### Test 2: Verify RLS Isolation
Execute in SQL Editor (with authenticated role):
```sql
SET ROLE authenticated;
SET request.jwt.claims = '{"sub":"test-user-id"}';

-- Should return empty (no user's own records yet)
SELECT * FROM transactions;

-- Reset
RESET ROLE;
RESET request.jwt.claims;
```
- [ ] Returns empty set (correct - no data yet)

### Test 3: Verify Immutability
Execute in SQL Editor:
```sql
-- Insert a chat message
INSERT INTO chat_messages (user_id, message_text, role)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Hello', 'user')
RETURNING id;

-- This should FAIL (trying to update)
UPDATE chat_messages SET message_text = 'Modified' WHERE role = 'user';
```
- [ ] Should raise: "Chat messages are immutable" error

### Test 4: Verify Soft Delete
Execute in SQL Editor:
```sql
-- Insert transaction
INSERT INTO transactions (user_id, amount, type, category, transaction_date, source)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, 50.00, 'expense', 'food', CURRENT_DATE, 'manual');

-- Mark as deleted
UPDATE transactions SET deleted_at = NOW() WHERE category = 'food';

-- Check WITH soft delete filter (should be empty)
SELECT * FROM transactions WHERE category = 'food' AND deleted_at IS NULL;

-- Check raw (should still see the record)
SELECT * FROM transactions WHERE category = 'food';
```
- [ ] First query returns 0 rows
- [ ] Second query returns 1 row

### Test 5: Verify Unique Budget Constraint
Execute in SQL Editor:
```sql
-- Insert first budget
INSERT INTO budgets (user_id, year_month, category, limit_amount)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, '2026-02-01'::date, 'food', 500.00);

-- This should FAIL (same user, same month, same category)
INSERT INTO budgets (user_id, year_month, category, limit_amount)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, '2026-02-01'::date, 'food', 600.00);
```
- [ ] Should raise: "unique constraint" error

### Test 6: Verify Timestamp Auto-Update
Execute in SQL Editor:
```sql
-- Insert transaction
INSERT INTO transactions (user_id, amount, type, category, transaction_date, source)
VALUES ('550e8400-e29b-41d4-a716-446655440000'::uuid, 100.00, 'income', 'salary', CURRENT_DATE, 'manual')
RETURNING id, created_at, updated_at;

-- Wait 1 second, then update
UPDATE transactions SET amount = 150.00 WHERE category = 'salary' RETURNING created_at, updated_at;
```
- [ ] created_at unchanged
- [ ] updated_at changed to NOW()

---

## Integration Tests

### Test 7: Application Query Layer
- [ ] Import Supabase client
- [ ] Test connection with service role key
- [ ] Fetch transactions (should return empty)
- [ ] Insert test transaction
- [ ] Verify insert successful
- [ ] Fetch again (should return 1 row)

### Test 8: RLS Policy Enforcement in App
- [ ] Create two test users
- [ ] User A inserts transaction with User A id
- [ ] User B queries transactions (should see 0)
- [ ] User A queries transactions (should see 1)
- [ ] Verify cross-user isolation working

### Test 9: Performance
- [ ] Insert 1000 test transactions
- [ ] Run date range query (indexed)
- [ ] Check query time < 100ms
- [ ] Run category query (indexed)
- [ ] Check query time < 100ms

---

## Cleanup & Documentation

- [ ] Delete test data if present
- [ ] Save this checklist with completion notes
- [ ] Update team documentation with schema details
- [ ] Commit changes to git
- [ ] Create deployment summary

---

## Rollback Plan (If Needed)

### Option A: Drop Tables (Quick, Data Loss)
If deployment fails and needs immediate rollback:
```sql
DROP TABLE IF EXISTS sync_logs CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
```
- [ ] Tables dropped
- [ ] All data lost

### Option B: Restore from Baseline (Safe, Full Rollback)
If deployment succeeds but needs rollback:
```bash
# Use baseline snapshot
supabase/snapshots/2026-02-20_056735_baseline.sql
```
- [ ] Restore procedure initiated
- [ ] Verify baseline available
- [ ] Coordinate with team

---

## Sign-Off

**Deployed By:** _________________
**Date:** _________________
**Status:** [ ] Success / [ ] Failed / [ ] Rolled Back
**Notes:** _________________________________________________

---

## Additional Resources

- Migration file: `supabase/migrations/20260220120000_initial_schema.sql`
- Detailed report: `MIGRATION-EXECUTION-REPORT.md`
- Baseline snapshot: `supabase/snapshots/2026-02-20_056735_baseline.sql`
- Supabase dashboard: https://app.supabase.com/project/jictijobzwhzzwmrljwr

---

**Last Updated:** 2026-02-20
**Status:** READY FOR DEPLOYMENT
