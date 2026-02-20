/**
 * Vercel Cron Job: Daily Sync from Google Sheets (Lancamentos2026) to Supabase
 * Executes daily at 8 AM UTC
 *
 * Features:
 * - Reads Lancamentos2026 via Google Sheets API
 * - Validates data (category known, date valid, amount > 0)
 * - Normalizes data (category lowercase, ISO date format)
 * - Upserts to transactions table
 * - Logs sync result to sync_log table
 * - Retry logic (3x with exponential backoff)
 */

import { NextResponse } from 'next/server';
import { createGoogleSheetsClient } from '@/lib/google-sheets';
import { supabase, transactionService, syncService } from '@/lib/db';
import {
  processTransactionRows,
  retryWithBackoff,
} from '@/lib/sync-transactions';

/**
 * Environment variables check
 */
function validateEnvironment(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!process.env.GOOGLE_SHEETS_API_KEY) {
    errors.push('Missing GOOGLE_SHEETS_API_KEY');
  }
  if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    errors.push('Missing GOOGLE_SHEETS_SPREADSHEET_ID');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Main sync handler
 */
async function syncLancamentos2026(): Promise<{
  success: boolean;
  message: string;
  details?: {
    rowsProcessed: number;
    rowsInserted: number;
    rowsUpdated: number;
    errorCount: number;
    duration: number;
  };
  errors?: string[];
}> {
  const startTime = Date.now();

  try {
    // Create Google Sheets client
    const googleSheetsClient = createGoogleSheetsClient(
      process.env.GOOGLE_SHEETS_API_KEY!,
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID!
    );

    // Read Lancamentos2026
    console.log('Fetching Lancamentos2026...');
    const rows = await googleSheetsClient.readLancamentos();
    console.log(`Read ${rows.length} rows from Lancamentos2026`);

    // Process and validate rows
    const { valid: validatedTransactions, errors: validationErrors } = processTransactionRows(rows);
    console.log(`Processed ${rows.length} rows: ${validatedTransactions.length} valid, ${validationErrors.length} errors`);

    if (validationErrors.length > 0) {
      console.warn(`Validation errors:`, validationErrors);
    }

    // Upsert to database
    let rowsInserted = 0;
    let rowsUpdated = 0;
    const upsertErrors: string[] = [];

    for (const transaction of validatedTransactions) {
      try {
        await retryWithBackoff(async () => {
          const dbTransaction = {
            date: transaction.date,
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            type: transaction.type,
            source_sheet: transaction.source_sheet,
          };

          // Check if exists
          const { data: existing } = await supabase
            .from('transactions')
            .select('id')
            .eq('date', transaction.date)
            .eq('category', transaction.category)
            .eq('type', transaction.type);

          if (existing && existing.length > 0) {
            rowsUpdated++;
          } else {
            rowsInserted++;
          }

          // Perform upsert
          await transactionService.upsert(dbTransaction);
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        upsertErrors.push(`Row for ${transaction.date} ${transaction.category}: ${message}`);
      }
    }

    const endTime = Date.now();

    // Log sync result
    await syncService.logSync({
      source: 'google_sheets',
      status: upsertErrors.length === 0 ? 'success' : 'error',
      rows_processed: validatedTransactions.length,
      error_message: upsertErrors.length > 0 ? upsertErrors.join('\n') : undefined,
      started_at: new Date(startTime).toISOString(),
      completed_at: new Date(endTime).toISOString(),
    });

    return {
      success: upsertErrors.length === 0,
      message: `Sync completed: ${validatedTransactions.length} rows processed, ${rowsInserted} inserted, ${rowsUpdated} updated`,
      details: {
        rowsProcessed: validatedTransactions.length,
        rowsInserted,
        rowsUpdated,
        errorCount: upsertErrors.length,
        duration: endTime - startTime,
      },
      errors: upsertErrors.length > 0 ? upsertErrors : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Sync failed: ${message}`);
  }
}

/**
 * GET handler (triggered by Vercel Cron)
 */
export async function GET() {
  try {
    // Validate environment
    const envCheck = validateEnvironment();
    if (!envCheck.valid) {
      console.error('Environment validation failed:', envCheck.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Environment configuration error',
          details: envCheck.errors,
        },
        { status: 500 }
      );
    }

    // Run sync
    const result = await syncLancamentos2026();

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        details: result.details,
        errors: result.errors,
      },
      {
        status: result.success ? 200 : 206, // 206 Partial Content if some errors
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Cron job failed:', message);

    // Log failure to sync_log if possible
    try {
      await syncService.logSync({
        source: 'google_sheets',
        status: 'error',
        rows_processed: 0,
        error_message: message,
        started_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error('Failed to log sync error:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

/**
 * HEAD handler (for Vercel health check)
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
