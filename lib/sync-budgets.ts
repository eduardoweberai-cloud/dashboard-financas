/**
 * Budget Synchronization from Orçamento2026
 * Syncs monthly budget targets from Google Sheets to Supabase (Phase 0)
 */

import { GoogleSheetsClient } from './google-sheets';
import { budgetService, syncService } from './db';
import { normalizeCategory, getCategoryType } from './category-map';
import type { MonthlyBudget, SheetRow } from './types';

export interface SyncBudgetsOptions {
  year?: number; // Default: 2026
  dryRun?: boolean; // If true, don't actually insert to DB
  retryAttempts?: number; // Number of retry attempts on failure
}

export interface SyncBudgetsResult {
  success: boolean;
  rowsProcessed: number;
  rowsInserted: number;
  categoriesSynced: Set<string>;
  monthsSynced: Set<string>;
  errors: string[];
  errorMessage?: string;
}

/**
 * Validate budget value
 */
function validateBudgetValue(value: unknown): value is number {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validate year
 */
function validateYear(year: number): boolean {
  return year >= 2020 && year <= 2030;
}

/**
 * Validate month (1-12)
 */
function validateMonth(month: number): boolean {
  return month >= 1 && month <= 12;
}

/**
 * Format month string as YYYY-MM
 */
function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Parse Orçamento2026 sheet data
 * Expected format: First row is headers, subsequent rows are data
 * Columns: Month names (Jan, Feb, ..., Dez) as columns
 * Rows: Category names in first column
 */
function parseOrcamentoData(sheetData: SheetRow[], year: number): MonthlyBudget[] {
  const budgets: MonthlyBudget[] = [];
  const errors: string[] = [];

  if (sheetData.length === 0) {
    errors.push('Sheet is empty');
    return budgets;
  }

  // First row is headers (month names: Jan, Feb, Mar, ...)
  const headers = sheetData[0];
  const monthIndices: Record<number, { name: string; monthNum: number }> = {}; // { 1: { name: 'Jan', monthNum: 1 }, ... }

  // Map month names to indices
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];

  for (let i = 1; i < Object.keys(headers).length; i++) {
    const headerName = String(headers[i]).trim();
    const monthIndex = monthNames.findIndex(m => m.toLowerCase() === headerName.toLowerCase());
    if (monthIndex >= 0) {
      const monthNum = (monthIndex % 12) + 1; // Convert to 1-12
      monthIndices[i] = { name: headerName, monthNum };
    }
  }

  // Process each row (starting from row 1, as row 0 is headers)
  for (let rowIdx = 1; rowIdx < sheetData.length; rowIdx++) {
    const row = sheetData[rowIdx];
    const categoryName = String(row[Object.keys(row)[0]] || '').trim();

    if (!categoryName) {
      continue; // Skip empty rows
    }

    // Normalize category name
    const normalizedCategory = normalizeCategory(categoryName);
    if (!normalizedCategory) {
      errors.push(`Unknown category: "${categoryName}" (row ${rowIdx + 1})`);
      continue;
    }

    const categoryType = getCategoryType(normalizedCategory);

    // Process each month column
    for (const [colIndex, monthData] of Object.entries(monthIndices)) {
      const monthNum = monthData.monthNum;
      const value = row[colIndex];

      if (!validateBudgetValue(value)) {
        errors.push(
          `Invalid budget value for ${categoryName} in ${monthData.name}: "${value}" (row ${rowIdx + 1}, col ${colIndex})`
        );
        continue;
      }

      if (!validateMonth(monthNum)) {
        errors.push(`Invalid month number: ${monthNum}`);
        continue;
      }

      const budget: MonthlyBudget = {
        id: crypto.randomUUID?.() || `budget-${Date.now()}-${Math.random()}`,
        month: formatMonth(year, monthNum),
        category: normalizedCategory,
        budgeted_amount: Number(value),
        notes: `Synced from Orçamento2026 (${categoryType})`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      budgets.push(budget);
    }
  }

  return budgets;
}

/**
 * Sync budgets from Orçamento2026 to Supabase
 */
export async function syncBudgetsFromOrcamento(
  sheetsClient: GoogleSheetsClient,
  options: SyncBudgetsOptions = {}
): Promise<SyncBudgetsResult> {
  const year = options.year || 2026;
  const maxRetries = options.retryAttempts || 1;
  const dryRun = options.dryRun || false;

  const result: SyncBudgetsResult = {
    success: false,
    rowsProcessed: 0,
    rowsInserted: 0,
    categoriesSynced: new Set(),
    monthsSynced: new Set(),
    errors: [],
  };

  try {
    if (!validateYear(year)) {
      throw new Error(`Invalid year: ${year}`);
    }

    // Read Orçamento2026 from Google Sheets
    console.log(`[sync-budgets] Reading Orçamento2026 from Google Sheets...`);
    const sheetData = await sheetsClient.readOrcamento();
    result.rowsProcessed = sheetData.length;

    if (sheetData.length === 0) {
      throw new Error('No data found in Orçamento2026 sheet');
    }

    // Parse sheet data into budget records
    console.log(`[sync-budgets] Parsing ${sheetData.length} rows...`);
    const budgets = parseOrcamentoData(sheetData, year);

    if (budgets.length === 0) {
      throw new Error('No valid budget records parsed from sheet');
    }

    // Track unique categories and months
    budgets.forEach(budget => {
      result.categoriesSynced.add(budget.category);
      result.monthsSynced.add(budget.month);
    });

    console.log(
      `[sync-budgets] Parsed ${budgets.length} budgets across ${result.monthsSynced.size} months and ${result.categoriesSynced.size} categories`
    );

    if (dryRun) {
      console.log('[sync-budgets] DRY RUN: Not inserting to database');
      result.success = true;
      result.rowsInserted = budgets.length;
      return result;
    }

    // Delete existing budgets for this year (re-sync support)
    console.log(`[sync-budgets] Deleting existing budgets for year ${year}...`);
    const existing = await budgetService.getAll();
    const existingForYear = existing.filter(b => b.month.startsWith(String(year)));

    if (existingForYear.length > 0) {
      for (const monthStr of result.monthsSynced) {
        await budgetService.deleteByMonth(monthStr);
      }
      console.log(`[sync-budgets] Deleted ${existingForYear.length} existing records`);
    }

    // Insert new budgets
    console.log(`[sync-budgets] Inserting ${budgets.length} budget records...`);
    await budgetService.insertBatch(budgets);
    result.rowsInserted = budgets.length;

    // Log sync success
    console.log(`[sync-budgets] Logging sync success...`);
    await syncService.logSync({
      source: 'google_sheets',
      status: 'success',
      rows_processed: result.rowsProcessed,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    });

    result.success = true;
    console.log(
      `[sync-budgets] ✅ Sync completed successfully. Inserted ${result.rowsInserted} records.`
    );

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    result.errorMessage = errorMessage;
    result.errors.push(errorMessage);

    // Log sync failure
    try {
      await syncService.logSync({
        source: 'google_sheets',
        status: 'error',
        rows_processed: result.rowsProcessed,
        error_message: errorMessage,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error('[sync-budgets] Failed to log error:', logError);
    }

    console.error(`[sync-budgets] ❌ Sync failed: ${errorMessage}`);

    // Retry logic
    if (maxRetries > 1) {
      console.log(`[sync-budgets] Retrying (${maxRetries - 1} attempts remaining)...`);
      const retryOptions = { ...options, retryAttempts: maxRetries - 1 };
      return syncBudgetsFromOrcamento(sheetsClient, retryOptions);
    }

    return result;
  }
}

/**
 * Validate sync results
 */
export async function validateSyncResults(): Promise<boolean> {
  try {
    const budgets = await budgetService.getAll();

    // Check: we have budgets
    if (budgets.length === 0) {
      console.warn('[validate-sync] No budgets found in database');
      return false;
    }

    // Check: budgets span 12 months
    const months = new Set(budgets.map(b => b.month));
    if (months.size < 12) {
      console.warn(`[validate-sync] Expected 12 months, got ${months.size}`);
      return false;
    }

    // Check: we have ~30 categories (some flexibility for variations)
    const categories = new Set(budgets.map(b => b.category));
    if (categories.size < 25) {
      console.warn(`[validate-sync] Expected ~30 categories, got ${categories.size}`);
      return false;
    }

    console.log(
      `[validate-sync] ✅ Validation passed: ${budgets.length} budgets, ${months.size} months, ${categories.size} categories`
    );
    return true;
  } catch (error) {
    console.error('[validate-sync] Validation failed:', error);
    return false;
  }
}
