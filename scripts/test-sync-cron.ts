#!/usr/bin/env node

/**
 * Manual Test Script for Sync Cron Job
 * Tests the sync logic locally without running the full Vercel environment
 *
 * Usage:
 *   npx ts-node scripts/test-sync-cron.ts
 *   node -r esbuild-register scripts/test-sync-cron.ts
 */

import { createGoogleSheetsClient } from '../lib/google-sheets';
import {
  processTransactionRows,
  retryWithBackoff,
  buildSyncResult,
} from '../lib/sync-transactions';
import type { SheetRow } from '../lib/types';

// Mock data for testing (use real Google Sheets API when possible)
const mockLancamentos: SheetRow[] = [
  {
    Data: '2026-02-20',
    Tipo: 'Entrada',
    Categoria: 'F5',
    Valor: '500.00',
    Descrição: 'F5 IA payment',
  },
  {
    Data: '20/02/2026',
    Tipo: 'Saída',
    Categoria: 'Moradia',
    Valor: '1500,00',
    Descrição: 'Rent',
  },
  {
    Data: '2026-02-19',
    Tipo: 'Saída',
    Categoria: 'Alimentação',
    Valor: '250.50',
    Descrição: 'Groceries',
  },
  {
    Data: 'invalid-date', // Should fail validation
    Tipo: 'Entrada',
    Categoria: 'F5',
    Valor: '100',
    Descrição: 'Invalid transaction',
  },
  {
    Data: '2026-02-18',
    Tipo: 'Entrada',
    Categoria: 'UnknownCategory', // Should fail validation
    Valor: '100',
    Descrição: 'Unknown category',
  },
];

async function testSyncCronJob() {
  console.log('='.repeat(60));
  console.log('Starting Sync Cron Job Test');
  console.log('='.repeat(60));

  const startTime = Date.now();

  try {
    console.log('\n1️⃣  Processing transaction rows...');
    const { valid: validatedTransactions, errors: validationErrors } = processTransactionRows(mockLancamentos);

    console.log(`   ✓ Processed ${mockLancamentos.length} rows`);
    console.log(`   ✓ Valid: ${validatedTransactions.length}`);
    console.log(`   ✓ Errors: ${validationErrors.length}`);

    if (validationErrors.length > 0) {
      console.log('\n   Validation Errors:');
      validationErrors.forEach(error => {
        console.log(`     - Row ${error.rowIndex}: ${error.reason}`);
      });
    }

    console.log('\n2️⃣  Valid transactions:');
    validatedTransactions.forEach((txn, idx) => {
      console.log(`   ${idx + 1}. ${txn.date} | ${txn.type.toUpperCase()} | ${txn.category} | ${txn.amount}`);
    });

    console.log('\n3️⃣  Testing database operations...');
    let rowsInserted = 0;
    let rowsUpdated = 0;
    const upsertErrors: string[] = [];

    for (const transaction of validatedTransactions) {
      try {
        await retryWithBackoff(async () => {
          // For testing, just log the operation
          console.log(`   → Upserting: ${transaction.date} | ${transaction.category} | ${transaction.amount}`);
          rowsInserted++;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        upsertErrors.push(`${transaction.date}: ${message}`);
      }
    }

    console.log(`\n4️⃣  Sync Summary:`);
    console.log(`   ✓ Rows processed: ${validatedTransactions.length}`);
    console.log(`   ✓ Rows inserted: ${rowsInserted}`);
    console.log(`   ✓ Rows updated: ${rowsUpdated}`);
    console.log(`   ✗ Errors: ${upsertErrors.length}`);

    if (upsertErrors.length > 0) {
      console.log('\n   Upsert Errors:');
      upsertErrors.forEach(error => {
        console.log(`     - ${error}`);
      });
    }

    const endTime = Date.now();

    const syncResult = buildSyncResult(
      upsertErrors.length === 0,
      validatedTransactions.length,
      rowsInserted,
      rowsUpdated,
      validationErrors,
      startTime,
      endTime
    );

    console.log(`\n5️⃣  Test Result:`);
    console.log(`   Success: ${syncResult.success}`);
    console.log(`   Duration: ${syncResult.duration}ms`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully');
    console.log('='.repeat(60));

    return syncResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ Test failed: ${message}`);
    process.exit(1);
  }
}

/**
 * Test with real Google Sheets API (requires environment variables)
 */
async function testWithRealGoogleSheets() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!apiKey || !spreadsheetId) {
    console.log('\n⚠️  Real Google Sheets test skipped (missing env vars)');
    console.log('   Set GOOGLE_SHEETS_API_KEY and GOOGLE_SHEETS_SPREADSHEET_ID to test');
    return;
  }

  console.log('\n6️⃣  Testing with real Google Sheets API...');

  try {
    const client = createGoogleSheetsClient(apiKey, spreadsheetId);
    const rows = await client.readLancamentos();
    console.log(`   ✓ Read ${rows.length} rows from Lancamentos2026`);

    const { valid, errors } = processTransactionRows(rows);
    console.log(`   ✓ Valid: ${valid.length}, Errors: ${errors.length}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`   ⚠️  Google Sheets test failed: ${message}`);
  }
}

// Run tests
(async () => {
  await testSyncCronJob();
  await testWithRealGoogleSheets();
})();
