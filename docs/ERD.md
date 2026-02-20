# Entity Relationship Diagram - Dashboard Financeiro Pessoal

## Visual Representation

```
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE AUTH.USERS                         │
│                                                                   │
│  id (UUID) | email | encrypted_password | created_at            │
└────────────┬────────────────────────────────────────────────────┘
             │
             ├─────────────────────────┬──────────────────────┬─────────────┬─────────────┐
             │ 1:N                     │ 1:N                  │ 1:N         │ 1:N         │
             │                         │                      │             │             │
             ▼                         ▼                      ▼             ▼             ▼
    ┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
    │   TRANSACTIONS      │  │     BUDGETS         │  │    GOALS     │  │CHAT_MESSAGES │  │   SYNC_LOGS      │
    │                     │  │                     │  │              │  │              │  │                  │
    │ • id (PK)           │  │ • id (PK)           │  │ • id (PK)    │  │ • id (PK)    │  │ • id (PK)        │
    │ • user_id (FK)      │  │ • user_id (FK)      │  │ • user_id(FK)│  │ • user_id(FK)│  │ • user_id (FK)   │
    │ • amount            │  │ • year_month        │  │ • title      │  │ • message_   │  │ • sync_type      │
    │ • type              │  │ • category          │  │ • description│  │   text       │  │ • status         │
    │ • category          │  │ • limit_amount      │  │ • target_    │  │ • role       │  │ • records_*      │
    │ • description       │  │ • notes             │  │   amount     │  │ • context_   │  │ • error_message  │
    │ • transaction_date  │  │ • created_at        │  │ • current_   │  │   start_date │  │ • sync_metadata  │
    │ • source            │  │ • updated_at        │  │   amount     │  │ • context_   │  │ • started_at     │
    │ • external_id       │  │ • deleted_at        │  │ • period     │  │   end_date   │  │ • completed_at   │
    │ • sync_id (FK)      │  │                     │  │ • start_date │  │ • context_   │  │                  │
    │ • created_at        │  │                     │  │ • end_date   │  │   metadata   │  │ RLS: user_id     │
    │ • updated_at        │  │                     │  │ • status     │  │ • parent_    │  │                  │
    │ • deleted_at        │  │                     │  │ • completion │  │   message_id │  │ Immutable:       │
    │                     │  │ RLS: user_id        │  │   _date      │  │ • created_at │  │ ✓ append-only    │
    │ RLS: user_id        │  │                     │  │ • created_at │  │ • deleted_at │  │ ✗ no updates     │
    │ Soft-delete: YES    │  │ Soft-delete: YES    │  │ • updated_at │  │              │  │                  │
    │ Mutable: YES        │  │ Mutable: YES        │  │ • deleted_at │  │ Immutable:   │  │ RLS: user_id     │
    │                     │  │                     │  │              │  │ ✓ create     │  │                  │
    │ Indexes:            │  │ Indexes:            │  │ Mutable: YES │  │ ✗ update     │  │ Indexes:         │
    │ • (user_id,date)    │  │ • (user_id,month)   │  │ Soft-delete: │  │              │  │ • (user_id,type) │
    │ • (user_id,cat)     │  │ • (user_id,cat)     │  │   YES        │  │ Indexes:     │  │ • (user_id,stat) │
    │ • (created_at)      │  │                     │  │              │  │ • (user_id,  │  │ • (completed_at) │
    │ • (external_id)     │  │                     │  │ Indexes:     │  │   created)   │  │                  │
    │                     │  │                     │  │ • (user_id,  │  │ • (user_id,  │  │                  │
    │                     │  │                     │  │   status)    │  │   context)   │  │                  │
    │                     │  │                     │  │ • (user_id,  │  │ • (parent_   │  │                  │
    │                     │  │                     │  │   period)    │  │   message)   │  │                  │
    └──────────┬──────────┘  └─────────────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘
               │
               │ 1:N
               │ (records_inserted/updated/failed)
               │
               └─ FK: sync_id (OPTIONAL)
                  ON DELETE: SET NULL
```

---

## Detailed Relationships

### 1. auth.users → transactions (1:N)
**Type:** One-to-Many
**Ownership:** users owns transactions
**Cascade:** ON DELETE CASCADE
**Cardinality:** user can have 0...∞ transactions
**Pattern:** Multi-tenancy isolation

### 2. auth.users → budgets (1:N)
**Type:** One-to-Many
**Ownership:** users owns budgets
**Cascade:** ON DELETE CASCADE
**Cardinality:** user can have 0...∞ budgets (typically 12+ per year)
**Pattern:** Multi-tenancy isolation

### 3. auth.users → goals (1:N)
**Type:** One-to-Many
**Ownership:** users owns goals
**Cascade:** ON DELETE CASCADE
**Cardinality:** user can have 0...∞ goals
**Pattern:** Multi-tenancy isolation

### 4. auth.users → chat_messages (1:N)
**Type:** One-to-Many
**Ownership:** users owns messages
**Cascade:** ON DELETE CASCADE
**Cardinality:** user can have 0...∞ messages
**Pattern:** Immutable conversation history

### 5. auth.users → sync_logs (1:N)
**Type:** One-to-Many
**Ownership:** users owns sync records
**Cascade:** ON DELETE CASCADE
**Cardinality:** user can have 0...∞ sync events
**Pattern:** Immutable audit trail

### 6. sync_logs → transactions (1:N)
**Type:** One-to-Many (optional)
**Ownership:** sync_logs CREATES transactions
**Cascade:** ON DELETE SET NULL
**Cardinality:** A sync event may create 0...∞ transactions
**Pattern:** Audit trail linking (reference only, not ownership)

### 7. chat_messages → chat_messages (1:N - Self-Referential)
**Type:** One-to-Many
**Relationship:** parent_message_id
**Cascade:** ON DELETE SET NULL
**Cardinality:** message can have 0...∞ child messages (threading)
**Pattern:** Conversation threading

### 8. transactions ↔ budgets (M:N - Implicit)
**Type:** Many-to-Many (no junction table)
**Relationship:** Implicit via (category + month)
**Pattern:** Budget vs actual comparison (JOIN on category + month)
**Query:** `JOIN transactions t ON t.category = b.category AND DATE_TRUNC('month', t.transaction_date) = b.year_month`

### 9. transactions ↔ goals (M:N - Implicit)
**Type:** Many-to-Many (no junction table)
**Relationship:** Implicit via date range
**Pattern:** Goal progress tracking (JOIN on date overlap)
**Query:** `WHERE t.transaction_date BETWEEN g.start_date AND g.end_date`

---

## Data Flow Patterns

### Pattern 1: Google Sheets Sync Flow
```
Google Sheets (external)
    ↓
sync_logs (create new sync record)
    ↓
transactions (insert/update records)
    ↓
transactions.sync_id → sync_logs.id (link created)
    ↓
application (query transactions for UI)
```

**Key Fields:**
- `transactions.external_id` - uniqueness from Google Sheets
- `transactions.source` - 'google_sheets'
- `sync_logs.sync_type` - 'google_sheets_transactions'
- `sync_logs.sync_metadata` - source URL, import time, row range

### Pattern 2: Budget Tracking Flow
```
budgets (define limits)
    ↓
transactions (filtered by category + month)
    ↓
Dashboard (SUM(amount) WHERE type='expense')
    ↓
Compare vs budget.limit_amount
    ↓
Alert if exceeded
```

**Key Query:**
```sql
SELECT
  b.category,
  b.limit_amount,
  SUM(t.amount) as spent,
  (b.limit_amount - SUM(t.amount)) as remaining
FROM budgets b
LEFT JOIN transactions t ON
  t.user_id = b.user_id AND
  t.category = b.category AND
  DATE_TRUNC('month', t.transaction_date) = b.year_month AND
  t.deleted_at IS NULL AND
  t.type = 'expense'
WHERE b.user_id = ? AND b.deleted_at IS NULL
GROUP BY b.id, b.category, b.limit_amount
```

### Pattern 3: Goal Progress Flow
```
goals (define target)
    ↓
transactions (filtered by date range, relevant type)
    ↓
Update goals.current_amount
    ↓
Compare vs goals.target_amount
    ↓
Mark complete if reached
```

**Key Query:**
```sql
SELECT
  g.id,
  g.title,
  g.target_amount,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) as current_amount,
  CASE
    WHEN SUM(...) >= g.target_amount THEN 'completed'
    ELSE 'active'
  END as status
FROM goals g
LEFT JOIN transactions t ON
  t.user_id = g.user_id AND
  t.transaction_date BETWEEN g.start_date AND g.end_date AND
  t.deleted_at IS NULL
WHERE g.user_id = ? AND g.deleted_at IS NULL
GROUP BY g.id
```

### Pattern 4: Chat Context Window Flow
```
chat_messages (user asks question)
    ↓
Extract context_start_date, context_end_date
    ↓
Query transactions (filtered by context period)
    ↓
Prepare context_metadata (category sums, trends, etc)
    ↓
Send to AI assistant
    ↓
Assistant responds (chat_messages with role='assistant')
    ↓
Thread with parent_message_id
```

**Context Metadata Example:**
```json
{
  "period_summary": {
    "total_income": 5000.00,
    "total_expense": 3200.50,
    "net": 1799.50
  },
  "category_breakdown": {
    "alimentação": 800.00,
    "transporte": 350.00,
    "saúde": 200.00
  },
  "trends": {
    "highest_category": "alimentação",
    "spending_trend": "increasing"
  }
}
```

### Pattern 5: Sync Audit Flow
```
sync_logs (create record with status='success')
    ↓
Link to transactions.sync_id
    ↓
Dashboard/Admin view
    ↓
Show sync history, success rate, error patterns
    ↓
Re-run failed syncs
```

**Key Metrics Query:**
```sql
SELECT
  sync_type,
  status,
  COUNT(*) as sync_count,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration,
  SUM(records_processed) as total_records
FROM sync_logs
WHERE user_id = ? AND completed_at >= NOW() - INTERVAL '30 days'
GROUP BY sync_type, status
ORDER BY completed_at DESC
```

---

## Cardinality & Multiplicity Summary

| Relationship | Min | Max | Pattern |
|--------------|-----|-----|---------|
| User → Transactions | 0 | ∞ | Linear growth with time |
| User → Budgets | 0 | ∞ | ~12-24 per year (monthly planning) |
| User → Goals | 0 | ∞ | 5-20 active at any time |
| User → Chat Messages | 0 | ∞ | Unbounded conversation history |
| User → Sync Logs | 0 | ∞ | Daily syncs = 365+/year |
| Sync → Transactions | 0 | ∞ | Bulk creates (50-1000+ per sync) |
| Transaction → Budget | 0 | 1 | Many transactions per budget category |
| Transaction → Goal | 0 | 1 | Transaction may contribute to goal |
| Message → Child Messages | 0 | ∞ | Branching conversation threads |

---

## Critical Constraints & Validations

### Primary Key Constraints
```
All tables use UUID PRIMARY KEY for:
✓ Distributed system support
✓ Privacy (no sequential guessing)
✓ Global uniqueness
✓ Partition-friendly (future sharding)
```

### Foreign Key Constraints
```
✓ transactions.user_id → auth.users(id) CASCADE
✓ budgets.user_id → auth.users(id) CASCADE
✓ goals.user_id → auth.users(id) CASCADE
✓ chat_messages.user_id → auth.users(id) CASCADE
✓ chat_messages.parent_message_id → chat_messages(id) SET NULL
✓ sync_logs.user_id → auth.users(id) CASCADE
✓ transactions.sync_id → sync_logs(id) SET NULL
```

### Domain Constraints
```
transactions:
  ✓ type IN ('income', 'expense')
  ✓ source IN ('manual', 'google_sheets')
  ✓ amount > 0
  ✓ transaction_date <= CURRENT_DATE

budgets:
  ✓ limit_amount > 0
  ✓ year_month always first day of month
  ✓ UNIQUE (user_id, year_month, category)

goals:
  ✓ target_amount > 0
  ✓ current_amount >= 0 AND current_amount <= target_amount
  ✓ start_date < end_date
  ✓ status IN ('active', 'completed', 'cancelled')
  ✓ completion_date required if status='completed'
  ✓ period IN ('monthly', 'yearly')

chat_messages:
  ✓ role IN ('user', 'assistant')
  ✓ context_start_date <= context_end_date (if both set)
  ✓ Immutable (no updates allowed)

sync_logs:
  ✓ sync_type IN ('google_sheets_transactions', 'budget_import', 'manual_import')
  ✓ status IN ('success', 'failed', 'partial')
  ✓ records_processed >= records_inserted + records_updated + records_failed
  ✓ completed_at >= started_at (or NULL if ongoing)
  ✓ Immutable (no updates allowed)
```

---

## Indexing Strategy

### Composite Indexes (Hot Paths)
```
transactions:
  (user_id, transaction_date DESC) WHERE deleted_at IS NULL
  (user_id, category) WHERE deleted_at IS NULL

budgets:
  (user_id, year_month DESC) WHERE deleted_at IS NULL
  (user_id, category) WHERE deleted_at IS NULL

goals:
  (user_id, status) WHERE deleted_at IS NULL
  (user_id, period, start_date DESC) WHERE deleted_at IS NULL

chat_messages:
  (user_id, created_at DESC) WHERE deleted_at IS NULL
  (user_id, context_start_date, context_end_date) WHERE deleted_at IS NULL

sync_logs:
  (user_id, sync_type, completed_at DESC)
  (user_id, status, completed_at DESC)
```

### Partial Indexes (Soft Deletes)
```
All indexes include WHERE deleted_at IS NULL
Reason: Soft-deleted records are not queried in normal operations
Benefit: Smaller indexes, better performance for active data
```

---

## Scaling Considerations

### Growth Model
- **Transactions:** 50-100 per month per user → 600-1200/year → 6K-12K/user in 10 years
- **Budgets:** 12 categories × 1 budget/month = 144/year → 1.5K in 10 years
- **Goals:** 10 active at any time, archived yearly → 100+/user in 10 years
- **Chat Messages:** 5-20 messages per day → 1.8K-7.3K/year → 18K-73K in 10 years
- **Sync Logs:** 1 daily sync = 365/year → 3.6K in 10 years

### Performance Impact
- No single table exceeds 100K rows per user in 10 years
- Composite indexes keep query times < 100ms even with full table scans
- DECIMAL(15,2) suitable for all currency values
- JSONB metadata keeps schema flexible without table growth

### Sharding Strategy (Future)
- **Shard Key:** user_id
- **Reason:** User data is completely isolated (RLS), independent growth
- **Implementation:** One table per shard or write-once archive tables after N years

---

## Data Integrity Assurances

### Referential Integrity
```
✓ All foreign keys enforced at database level
✓ CASCADE deletes propagate user deletions
✓ SET NULL prevents orphaned records in audit trail
```

### Temporal Consistency
```
✓ created_at immutable (set at insert time)
✓ updated_at maintained by triggers
✓ deleted_at immutable once set (soft delete)
✓ All timestamps in UTC (TIMESTAMPTZ)
```

### Audit Trail
```
✓ sync_logs immutable (append-only)
✓ chat_messages immutable (conversation history)
✓ transaction.external_id tracks source
✓ transaction.sync_id links to sync event
```

### Business Logic
```
✓ Constraints prevent invalid states at database level
✓ Triggers enforce computed fields (updated_at)
✓ RLS ensures user isolation
✓ Soft deletes preserve history while hiding deleted records
```

---

## Next Steps

1. **Dry-Run:** Validate SQL syntax and constraints
2. **Apply Migration:** Deploy to Supabase development environment
3. **Verify RLS:** Test user isolation with different auth tokens
4. **Seed Data:** Load sample data for development/testing
5. **Query Optimization:** Monitor slow queries and add indexes
6. **Monitoring:** Set up performance alerts on index bloat
