/**
 * Sync Transactions Service
 * Handles synchronization of transactions from Google Sheets to Supabase
 * Includes validation, normalization, and retry logic
 */

import type { SheetRow } from './types';
import { normalizeCategory, getCategoryType } from './category-map';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // exponential backoff: 1s, 2s, 4s

export interface RawTransaction {
  'Data': string;
  'Tipo': string;
  'Categoria': string;
  'Valor': string | number;
  'Descrição': string;
}

export interface ValidatedTransaction {
  date: string; // ISO format
  type: 'income' | 'expense';
  category: string; // normalized
  amount: number;
  description: string;
  source_sheet: string; // 'Lancamentos2026'
}

export interface SyncResult {
  success: boolean;
  rowsProcessed: number;
  rowsInserted: number;
  rowsUpdated: number;
  errors: SyncError[];
  startedAt: string;
  completedAt: string;
  duration: number; // milliseconds
}

export interface SyncError {
  rowIndex: number;
  row: unknown;
  reason: string;
}

/**
 * Validate a single transaction row
 */
export function validateTransaction(row: SheetRow, rowIndex: number): ValidatedTransaction | null {
  const raw = row as unknown as RawTransaction;

  // Validate required fields
  if (!raw.Data) {
    console.warn(`Row ${rowIndex}: Missing data`);
    return null;
  }

  if (!raw.Tipo) {
    console.warn(`Row ${rowIndex}: Missing tipo`);
    return null;
  }

  if (!raw.Categoria) {
    console.warn(`Row ${rowIndex}: Missing categoria`);
    return null;
  }

  // Validate tipo (Entrada/Saída)
  const tipo = raw.Tipo.trim();
  if (!['Entrada', 'Saída'].includes(tipo)) {
    console.warn(`Row ${rowIndex}: Invalid tipo "${tipo}". Must be "Entrada" or "Saída"`);
    return null;
  }

  // Validate and normalize category
  const normalizedCategory = normalizeCategory(raw.Categoria);
  if (!normalizedCategory) {
    console.warn(`Row ${rowIndex}: Unknown categoria "${raw.Categoria}"`);
    return null;
  }

  // Validate date format (ISO or DD/MM/YYYY)
  const date = validateAndNormalizeDate(raw.Data);
  if (!date) {
    console.warn(`Row ${rowIndex}: Invalid date "${raw.Data}"`);
    return null;
  }

  // Validate amount
  const amount = validateAndNormalizeAmount(raw.Valor);
  if (amount === null || amount <= 0) {
    console.warn(`Row ${rowIndex}: Invalid amount "${raw.Valor}". Must be > 0`);
    return null;
  }

  const type = tipo === 'Entrada' ? 'income' : 'expense';

  // Verify category matches type
  const categoryType = getCategoryType(normalizedCategory);
  if (categoryType !== type) {
    console.warn(
      `Row ${rowIndex}: Category "${normalizedCategory}" is type ${categoryType} but tipo is ${type}`
    );
    // Allow this for now - could be a manual override
    // Uncomment to enforce strict category-type matching:
    // return null;
  }

  return {
    date,
    type,
    category: normalizedCategory,
    amount,
    description: (raw.Descrição || '').trim(),
    source_sheet: 'Lancamentos2026',
  };
}

/**
 * Validate and normalize date to ISO format
 * Accepts: ISO (YYYY-MM-DD) or Brazilian format (DD/MM/YYYY)
 */
export function validateAndNormalizeDate(rawDate: unknown): string | null {
  if (!rawDate) return null;

  const dateStr = String(rawDate).trim();

  // Check if already in ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return dateStr;
    }
  }

  // Try parsing DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return null;

    // Format as ISO (YYYY-MM-DD)
    return date.toISOString().split('T')[0];
  }

  return null;
}

/**
 * Validate and normalize amount to number
 */
export function validateAndNormalizeAmount(rawAmount: unknown): number | null {
  if (!rawAmount) return null;

  const amountStr = String(rawAmount).trim();

  // Handle comma as decimal separator
  const normalized = amountStr.replace(',', '.').replace(/[^\d.-]/g, '');
  const amount = parseFloat(normalized);

  if (isNaN(amount)) return null;
  return amount;
}

/**
 * Process transactions from Google Sheets rows
 */
export function processTransactionRows(rows: SheetRow[]): {
  valid: ValidatedTransaction[];
  errors: SyncError[];
} {
  const valid: ValidatedTransaction[] = [];
  const errors: SyncError[] = [];

  rows.forEach((row, index) => {
    const validated = validateTransaction(row, index + 2); // row index starts at 2 (row 1 is header)

    if (validated) {
      valid.push(validated);
    } else {
      errors.push({
        rowIndex: index + 2,
        row,
        reason: 'Validation failed',
      });
    }
  });

  return { valid, errors };
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delays: number[] = RETRY_DELAYS
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = delays[attempt] || delays[delays.length - 1];
        console.warn(`Attempt ${attempt + 1} failed: ${lastError.message}. Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Build sync result object
 */
export function buildSyncResult(
  success: boolean,
  rowsProcessed: number,
  rowsInserted: number,
  rowsUpdated: number,
  errors: SyncError[],
  startTime: number,
  endTime: number
): SyncResult {
  return {
    success,
    rowsProcessed,
    rowsInserted,
    rowsUpdated,
    errors,
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date(endTime).toISOString(),
    duration: endTime - startTime,
  };
}
