#!/usr/bin/env node

/**
 * Script: Sync Budgets from Orçamento2026 → Supabase (Phase 0)
 * Executes one-time synchronization of budget targets from Google Sheets
 *
 * Usage:
 *   npx ts-node scripts/sync-budgets-phase0.ts [--dry-run] [--year 2026] [--retry 1]
 */

import { config } from 'dotenv';
import { createGoogleSheetsClient } from '../lib/google-sheets';
import { syncBudgetsFromOrcamento, validateSyncResults } from '../lib/sync-budgets';

// Load environment variables
config({ path: '.env.local' });
config();

async function main() {
  console.log('\n🚀 Budget Synchronization Phase 0: Orçamento2026 → Supabase\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const yearArg = args.find(arg => arg.startsWith('--year'));
  const year = yearArg ? parseInt(yearArg.split('=')[1] || '2026') : 2026;
  const retryArg = args.find(arg => arg.startsWith('--retry'));
  const retryAttempts = retryArg ? parseInt(retryArg.split('=')[1] || '1') : 1;

  console.log('Configuration:');
  console.log(`  Year: ${year}`);
  console.log(`  Dry Run: ${dryRun ? 'YES' : 'NO'}`);
  console.log(`  Retry Attempts: ${retryAttempts}`);
  console.log('');

  // Validate environment
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!apiKey || !spreadsheetId) {
    console.error(
      '❌ Missing environment variables:',
      {
        GOOGLE_SHEETS_API_KEY: !!apiKey,
        GOOGLE_SPREADSHEET_ID: !!spreadsheetId,
      }
    );
    process.exit(1);
  }

  try {
    // Create Google Sheets client
    console.log('📊 Initializing Google Sheets client...');
    const sheetsClient = createGoogleSheetsClient(apiKey, spreadsheetId);

    // Verify connection
    const metadata = await sheetsClient.getMetadata();
    console.log(`✅ Connected to spreadsheet: "${metadata.title}"`);
    console.log(`   Available sheets: ${metadata.sheets.join(', ')}\n`);

    // Execute sync
    const result = await syncBudgetsFromOrcamento(sheetsClient, {
      year,
      dryRun,
      retryAttempts,
    });

    // Display results
    console.log('\n📊 Sync Results:\n');
    console.log(`  Rows Processed: ${result.rowsProcessed}`);
    console.log(`  Rows Inserted: ${result.rowsInserted}`);
    console.log(`  Months Synced: ${result.monthsSynced.size}`);
    console.log(`  Categories Synced: ${result.categoriesSynced.size}`);

    if (result.categoriesSynced.size > 0) {
      console.log(`  Categories: ${Array.from(result.categoriesSynced).join(', ')}`);
    }

    if (result.errors.length > 0) {
      console.log(`\n⚠️  Errors (${result.errors.length}):`);
      result.errors.forEach((err, i) => {
        console.log(`    ${i + 1}. ${err}`);
      });
    }

    // Validate results (only if not dry-run)
    if (!dryRun && result.success) {
      console.log('\n🔍 Validating sync results...');
      const isValid = await validateSyncResults();

      if (!isValid) {
        console.warn('⚠️  Validation warnings detected');
        process.exit(1);
      }
    }

    if (result.success) {
      console.log('\n✅ Sync completed successfully!\n');
      process.exit(0);
    } else {
      console.log('\n❌ Sync failed!\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Uncaught error:', error);
  process.exit(1);
});
