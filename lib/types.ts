/**
 * Database Types
 * Auto-generated types for Supabase tables
 */

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  source_sheet: string; // 'Lancamentos2026' or 'Orçamento2026'
  created_at: string;
  updated_at: string;
}

export interface MonthlyBudget {
  id: string;
  month: string; // YYYY-MM format
  category: string;
  budgeted_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  id: string;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  type: 'monthly' | 'annual';
  month?: string; // YYYY-MM format (for monthly)
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  context?: Record<string, unknown>;
  created_at: string;
}

export interface SyncLog {
  id: string;
  source: 'google_sheets' | 'manual';
  status: 'success' | 'error' | 'pending';
  rows_processed: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

/**
 * Google Sheets Types
 */
export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheets: {
    lancamentos: string; // 'Lancamentos2026'
    orcamento: string;   // 'Orçamento2026'
  };
}

export interface SheetRow {
  [key: string]: unknown;
}
