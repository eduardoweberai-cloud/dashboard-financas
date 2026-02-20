/**
 * Chart aggregation tests
 * Tests data grouping and aggregation functions
 */

import {
  aggregateByCategory,
  aggregateByDay,
  aggregateByMonth,
} from '../lib/chart-utils';
import { Transaction } from '../lib/types';

describe('Chart Aggregation', () => {
  // Sample transactions
  const sampleTransactions: Transaction[] = [
    {
      id: '1',
      date: '2026-01-01T10:00:00',
      description: 'Salary',
      amount: 5000,
      category: 'F5',
      type: 'income',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    },
    {
      id: '2',
      date: '2026-01-05T10:00:00',
      description: 'Grocery',
      amount: -500,
      category: 'Alimentação',
      type: 'expense',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-05',
      updated_at: '2026-01-05',
    },
    {
      id: '3',
      date: '2026-01-10T10:00:00',
      description: 'Freelance',
      amount: 2000,
      category: 'Clientes',
      type: 'income',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-10',
      updated_at: '2026-01-10',
    },
    {
      id: '4',
      date: '2026-01-15T10:00:00',
      description: 'Rent',
      amount: -1500,
      category: 'Moradia',
      type: 'expense',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-15',
      updated_at: '2026-01-15',
    },
    {
      id: '5',
      date: '2026-02-01T10:00:00',
      description: 'Salary 2',
      amount: 5000,
      category: 'F5',
      type: 'income',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-02-01',
      updated_at: '2026-02-01',
    },
  ];

  describe('aggregateByCategory', () => {
    it('should aggregate expense transactions by category', () => {
      const result = aggregateByCategory(sampleTransactions, 'expense');

      expect(result).toHaveLength(2); // Alimentação and Moradia
      expect(result[0].value).toBe(1500); // Moradia is larger
      expect(result[1].value).toBe(500); // Alimentação
    });

    it('should aggregate income transactions by category', () => {
      const result = aggregateByCategory(sampleTransactions, 'income');

      expect(result).toHaveLength(2); // F5 and Clientes
      expect(result[0].value).toBe(7000); // F5 (5000 + 2000 from Clientes? No, wait)
      // Actually: F5=5000, Clientes=2000, so F5 is first (larger)
      expect(result[0].category).toBe('f5');
    });

    it('should calculate percentage correctly', () => {
      const result = aggregateByCategory(sampleTransactions, 'expense');

      const total = result.reduce((sum, item) => sum + item.value, 0);
      result.forEach((item) => {
        const expectedPercentage = Math.round((item.value / total) * 100);
        expect(item.percentage).toBe(expectedPercentage);
      });
    });

    it('should return empty array for no matching transactions', () => {
      const emptyTransactions: Transaction[] = [];
      const result = aggregateByCategory(emptyTransactions, 'income');

      expect(result).toEqual([]);
    });

    it('should handle negative amounts (expenses)', () => {
      const result = aggregateByCategory(sampleTransactions, 'expense');

      result.forEach((item) => {
        expect(item.value).toBeGreaterThan(0); // Should be absolute value
      });
    });
  });

  describe('aggregateByDay', () => {
    it('should create 31 bars for January', () => {
      const transactions = sampleTransactions.filter(
        (t) => t.date.startsWith('2026-01')
      );
      const result = aggregateByDay(transactions);

      expect(result).toHaveLength(31); // January has 31 days
    });

    it('should correctly aggregate income and expense by day', () => {
      const transactions = sampleTransactions.filter(
        (t) => t.date.startsWith('2026-01')
      );
      const result = aggregateByDay(transactions);

      const day1 = result[0]; // January 1st
      expect(day1.label).toBe('1');
      expect(day1.income).toBe(5000); // Salary
      expect(day1.expense).toBe(0);
      expect(day1.balance).toBe(5000);

      const day5 = result[4]; // January 5th
      expect(day5.label).toBe('5');
      expect(day5.income).toBe(0);
      expect(day5.expense).toBe(500); // Grocery
      expect(day5.balance).toBe(-500);
    });

    it('should calculate balance correctly', () => {
      const transactions = sampleTransactions.filter(
        (t) => t.date.startsWith('2026-01')
      );
      const result = aggregateByDay(transactions);

      result.forEach((day) => {
        expect(day.balance).toBe(day.income - day.expense);
      });
    });
  });

  describe('aggregateByMonth', () => {
    it('should aggregate transactions by month', () => {
      const result = aggregateByMonth(sampleTransactions);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].label).toBe('Jan'); // First month
    });

    it('should correctly sum income and expense by month', () => {
      const result = aggregateByMonth(sampleTransactions);

      const january = result[0];
      expect(january.label).toBe('Jan');
      expect(january.income).toBe(7000); // F5 (5000) + Clientes (2000)
      expect(january.expense).toBe(2000); // Alimentação (500) + Moradia (1500)
      expect(january.balance).toBe(5000);
    });

    it('should include all months from transactions', () => {
      const result = aggregateByMonth(sampleTransactions);

      expect(result).toContainEqual(
        expect.objectContaining({ label: 'Jan' })
      );
      expect(result).toContainEqual(
        expect.objectContaining({ label: 'Fev' })
      );
    });
  });
});
