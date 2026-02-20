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

/**
 * Period Types - Para seletor de período
 */
export type PeriodType = 'mensal' | 'trimestral' | 'semestral' | 'anual';

export interface Period {
  type: PeriodType;
  value: string; // YYYY-MM para mensal, QX para trimestral, etc
  label: string; // Label em português
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface PeriodContextType {
  currentPeriod: Period;
  setPeriod: (period: Period) => void;
  availablePeriods: {
    mensal: Period[];
    trimestral: Period[];
    semestral: Period[];
    anual: Period[];
  };
}

/**
 * KPI Types - Para cards de métricas
 */
export interface KPIData {
  realized: number;     // Valor realizado
  projected: number;    // Valor projetado
  previousPeriod: number; // Valor do período anterior
}

export interface KPI {
  label: string;           // "Receitas", "Despesas", "Saldo"
  data: KPIData;
  percentage: number;      // % realização
  percentageColor: 'green' | 'yellow' | 'red'; // Cor baseada em %
  variation: number;       // % variação vs período anterior
  variationDirection: 'up' | 'down'; // Seta para cima ou baixo
}

export interface DashboardData {
  receitas: KPIData;
  despesas: KPIData;
  saldo: KPIData;
  period: {
    current: string; // YYYY-MM
    previous: string; // YYYY-MM
  };
}

/**
 * Top Movements Types - Para Top 5 Gastos e Entradas
 */
export interface TopMovement {
  category: string;
  amount: number;
  type: 'income' | 'expense';
}
