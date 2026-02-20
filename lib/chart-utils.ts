/**
 * Chart utility functions for data aggregation
 * Handles grouping by category, day, and month
 */

import { Transaction, Period } from './types';
import { AllCategory, normalizeCategory, getCategoryType } from './category-map';

/**
 * Data structure for donut charts
 */
export interface DonutData {
  name: string;
  value: number;
  category: AllCategory;
  percentage: number;
}

/**
 * Data structure for bar chart
 */
export interface BalanceData {
  label: string;
  income: number;
  expense: number;
  balance: number;
}

/**
 * Aggregate transactions by category
 * Returns array of DonutData for visualization
 */
export function aggregateByCategory(
  transactions: Transaction[],
  type: 'income' | 'expense'
): DonutData[] {
  const categoryMap = new Map<AllCategory, number>();
  let total = 0;

  // Filter transactions by type and aggregate
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      const normalized = normalizeCategory(t.category);
      if (normalized && getCategoryType(normalized) === type) {
        const current = categoryMap.get(normalized) || 0;
        const amount = Math.abs(t.amount);
        categoryMap.set(normalized, current + amount);
        total += amount;
      }
    });

  // Convert to DonutData array
  return Array.from(categoryMap.entries())
    .map(([category, value]) => ({
      name: category,
      value,
      category,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Aggregate transactions for bar chart by day
 * Used for monthly period (1 bar per day)
 */
export function aggregateByDay(transactions: Transaction[]): BalanceData[] {
  const dayMap = new Map<string, { income: number; expense: number }>();
  const startDate = new Date(transactions[0]?.date || new Date());
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  // Initialize all days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dayMap.set(dateStr, { income: 0, expense: 0 });
  }

  // Aggregate transactions
  transactions.forEach((t) => {
    const dateKey = t.date.split('T')[0]; // YYYY-MM-DD
    if (dayMap.has(dateKey)) {
      const day = dayMap.get(dateKey)!;
      if (t.type === 'income') {
        day.income += Math.abs(t.amount);
      } else {
        day.expense += Math.abs(t.amount);
      }
    }
  });

  // Convert to BalanceData array
  return Array.from(dayMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, { income, expense }]) => {
      const dayNum = parseInt(date.split('-')[2], 10);
      return {
        label: `${dayNum}`,
        income,
        expense,
        balance: income - expense,
      };
    });
}

/**
 * Aggregate transactions for bar chart by month
 * Used for trimestral/semestral/anual periods
 */
export function aggregateByMonth(transactions: Transaction[]): BalanceData[] {
  const monthMap = new Map<string, { income: number; expense: number }>();

  // Get unique months from transactions
  const months = new Set(transactions.map((t) => t.date.substring(0, 7))); // YYYY-MM
  const sortedMonths = Array.from(months).sort();

  sortedMonths.forEach((monthStr) => {
    monthMap.set(monthStr, { income: 0, expense: 0 });
  });

  // Aggregate transactions
  transactions.forEach((t) => {
    const monthKey = t.date.substring(0, 7); // YYYY-MM
    if (monthMap.has(monthKey)) {
      const month = monthMap.get(monthKey)!;
      if (t.type === 'income') {
        month.income += Math.abs(t.amount);
      } else {
        month.expense += Math.abs(t.amount);
      }
    }
  });

  // Convert to BalanceData array
  return Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([monthStr, { income, expense }]) => {
      const [, month] = monthStr.split('-');
      const monthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      const monthName = monthNames[parseInt(month, 10) - 1];
      return {
        label: monthName,
        income,
        expense,
        balance: income - expense,
      };
    });
}

/**
 * Select aggregation function based on period type
 */
export function getBalanceChartData(
  transactions: Transaction[],
  period: Period
): BalanceData[] {
  if (period.type === 'mensal') {
    return aggregateByDay(transactions);
  }
  return aggregateByMonth(transactions);
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format currency for tooltip (shorter format)
 */
export function formatCurrencyShort(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}K`;
  }
  return `R$ ${value.toFixed(0)}`;
}
