/**
 * Supabase Database Client
 * Handles all database operations for the financial dashboard
 */

import { createClient } from '@supabase/supabase-js';
import type { Transaction, MonthlyBudget, Meta, ChatMessage, SyncLog } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Transaction operations
 */
export const transactionService = {
  async getAll(limit: number = 100) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
    return data as Transaction[];
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
    return data as Transaction[];
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
    return data as Transaction[];
  },

  async insert(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw new Error(`Failed to insert transaction: ${error.message}`);
    return data as Transaction;
  },

  async insertBatch(transactions: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();

    if (error) throw new Error(`Failed to insert transactions: ${error.message}`);
    return data as Transaction[];
  },

  async upsert(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    // Upsert using date, category, and type as unique key
    // This prevents duplicates when the same transaction is synced multiple times
    const { data, error } = await supabase
      .from('transactions')
      .upsert([transaction], {
        onConflict: 'date,category,type',
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to upsert transaction: ${error.message}`);
    return data as Transaction;
  },

  async upsertBatch(transactions: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('transactions')
      .upsert(transactions, {
        onConflict: 'date,category,type',
      })
      .select();

    if (error) throw new Error(`Failed to upsert transactions: ${error.message}`);
    return data as Transaction[];
  },
};

/**
 * Monthly Budget operations
 */
export const budgetService = {
  async getByMonth(month: string) {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .select('*')
      .eq('month', month);

    if (error) throw new Error(`Failed to fetch budgets: ${error.message}`);
    return data as MonthlyBudget[];
  },

  async insert(budget: Omit<MonthlyBudget, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .insert([budget])
      .select()
      .single();

    if (error) throw new Error(`Failed to insert budget: ${error.message}`);
    return data as MonthlyBudget;
  },

  async insertBatch(budgets: Omit<MonthlyBudget, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .insert(budgets)
      .select();

    if (error) throw new Error(`Failed to insert budgets: ${error.message}`);
    return data as MonthlyBudget[];
  },

  async deleteByMonth(month: string) {
    const { error } = await supabase
      .from('monthly_budgets')
      .delete()
      .eq('month', month);

    if (error) throw new Error(`Failed to delete budgets: ${error.message}`);
  },

  async deleteAll() {
    const { error } = await supabase
      .from('monthly_budgets')
      .delete()
      .neq('id', ''); // Delete all rows

    if (error) throw new Error(`Failed to delete all budgets: ${error.message}`);
  },

  async getAll() {
    const { data, error } = await supabase
      .from('monthly_budgets')
      .select('*')
      .order('month', { ascending: true });

    if (error) throw new Error(`Failed to fetch all budgets: ${error.message}`);
    return data as MonthlyBudget[];
  },
};

/**
 * Metas operations
 */
export const metasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch metas: ${error.message}`);
    return data as Meta[];
  },

  async getAnnualGoal(year: string) {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('type', 'annual')
      .eq('month', year) // Store year as YYYY in month field
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch annual goal: ${error.message}`);
    }
    return data as Meta | null;
  },

  async insert(meta: Omit<Meta, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('metas')
      .insert([meta])
      .select()
      .single();

    if (error) throw new Error(`Failed to insert meta: ${error.message}`);
    return data as Meta;
  },
};

/**
 * Chat operations
 */
export const chatService = {
  async getHistory(limit: number = 50) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch chat history: ${error.message}`);
    return data as ChatMessage[];
  },

  async insert(message: Omit<ChatMessage, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([message])
      .select()
      .single();

    if (error) throw new Error(`Failed to insert message: ${error.message}`);
    return data as ChatMessage;
  },
};

/**
 * Sync operations
 */
export const syncService = {
  async logSync(log: Omit<SyncLog, 'id'>) {
    const { data, error } = await supabase
      .from('sync_log')
      .insert([log])
      .select()
      .single();

    if (error) throw new Error(`Failed to log sync: ${error.message}`);
    return data as SyncLog;
  },

  async getLastSync() {
    const { data, error } = await supabase
      .from('sync_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch last sync: ${error.message}`);
    }
    return data as SyncLog | null;
  },
};

/**
 * Health check - verify connection
 */
export async function healthCheck() {
  try {
    const { error } = await supabase
      .from('transactions')
      .select('count', { count: 'exact', head: true });

    if (error) throw error;
    return { healthy: true, message: 'Supabase connection OK' };
  } catch (error) {
    return {
      healthy: false,
      message: `Supabase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
