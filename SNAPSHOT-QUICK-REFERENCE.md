# Snapshot Baseline - Quick Reference Guide

## Snapshot Created ✅

**Label:** baseline
**File:** `supabase/snapshots/2026-02-20_056735_baseline.sql`
**Status:** Ready for Migration
**Created:** 2026-02-20 15:24:16 UTC

---

## Quick Commands

### Restore Snapshot (If Migration Fails)
```bash
*rollback supabase/snapshots/2026-02-20_056735_baseline.sql
```

### Apply Migration
```bash
*apply-migration supabase/migrations/20260220120000_initial_schema.sql
```

### Create Post-Migration Snapshot
```bash
*snapshot post_migration
```

---

## File Locations

| File | Location |
|------|----------|
| Snapshot SQL | `supabase/snapshots/2026-02-20_056735_baseline.sql` |
| Metadata | `supabase/snapshots/2026-02-20_056735_baseline.meta` |
| Detailed Report | `SNAPSHOT-BASELINE-REPORT.md` |
| Summary | `SNAPSHOT-EXECUTION-SUMMARY.txt` |
| Script | `snapshot-baseline.js` |

---

## What Was Snapshotted

- **Type:** Schema-only (no data)
- **State:** Empty database (baseline before migration)
- **Purpose:** Rollback point for migration failure
- **Size:** 953 bytes
- **Security:** No sensitive data included

---

## Connection Details

| Item | Value |
|------|-------|
| Project | jictijobzwhzzwmrljwr |
| Database | postgres |
| Host | aws-0-us-east-1.pooler.supabase.com |
| Port | 6543 |
| SSL | Required |

---

## Migration Status

| Phase | Status |
|-------|--------|
| ✅ Baseline Snapshot | COMPLETED |
| ⏳ Initial Migration | PENDING |
| ⏳ Schema Verification | PENDING |
| ⏳ Post-Migration Snapshot | PENDING |

---

## Next Steps (In Order)

1. **Verify Snapshot**
   ```bash
   ls -lh supabase/snapshots/2026-02-20_056735_baseline.sql
   ```

2. **Apply Migration**
   ```bash
   *apply-migration supabase/migrations/20260220120000_initial_schema.sql
   ```

3. **Verify Tables Created**
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```

4. **Create Post-Migration Snapshot**
   ```bash
   *snapshot post_migration
   ```

---

## Rollback Instructions

### If Migration Fails
```bash
# Restore baseline snapshot
*rollback supabase/snapshots/2026-02-20_056735_baseline.sql

# Verify restoration
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
# Expected: No tables (baseline state restored)
```

### If Rollback Fails
```bash
# Use direct psql command
psql "$SUPABASE_DB_URL" -f "supabase/snapshots/2026-02-20_056735_baseline.sql"
```

---

## Metadata

View snapshot metadata:
```bash
cat supabase/snapshots/2026-02-20_056735_baseline.meta
```

Expected contents:
```json
{
  "snapshot": "2026-02-20_056735_baseline.sql",
  "label": "baseline",
  "created_at": "2026-02-20T15:24:16.790Z",
  "project_id": "jictijobzwhzzwmrljwr",
  "purpose": "Baseline snapshot before applying initial migration"
}
```

---

## Verification Checklist

Before applying migration:
- [ ] Snapshot file exists: `supabase/snapshots/2026-02-20_056735_baseline.sql`
- [ ] Metadata file exists: `supabase/snapshots/2026-02-20_056735_baseline.meta`
- [ ] Can read snapshot file: `cat supabase/snapshots/2026-02-20_056735_baseline.sql`
- [ ] Environment variables set: `echo $NEXT_PUBLIC_SUPABASE_URL`
- [ ] Connection to Supabase verified

---

## Important Notes

- **Baseline is empty:** This snapshot captures the empty database state before migration
- **Safe to restore:** Schema-only snapshots don't conflict with data
- **Version control:** Snapshots are local, not in Git repository
- **Retention:** Keep for 7+ days before cleanup
- **Backup:** Supabase also maintains automatic backups

---

## For More Information

- **Full Report:** See `SNAPSHOT-BASELINE-REPORT.md`
- **Execution Summary:** See `SNAPSHOT-EXECUTION-SUMMARY.txt`
- **Task Documentation:** See `.aios-core/development/tasks/db-snapshot.md`

---

## Support

### Issue: Can't restore snapshot
1. Check credentials in `.env.local`
2. Verify database is accessible
3. Test connection: `psql "$SUPABASE_DB_URL"`
4. Try manual command if CLI fails

### Issue: Migration still fails after multiple attempts
1. Review migration SQL syntax
2. Check for constraint violations
3. Verify table order in migration
4. Consult Supabase documentation

### Issue: Lost snapshot file
1. Create new baseline: `node snapshot-baseline.js baseline`
2. Check git history if available
3. Contact team for backup

---

**Status:** Ready for Migration ✅
**Next Command:** `*apply-migration supabase/migrations/20260220120000_initial_schema.sql`
