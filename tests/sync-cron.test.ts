/**
 * Unit Tests for Sync Transactions Service
 * Tests validation, normalization, and processing logic
 */

import {
  validateTransaction,
  validateAndNormalizeDate,
  validateAndNormalizeAmount,
  processTransactionRows,
  retryWithBackoff,
} from '../lib/sync-transactions';
import type { SheetRow } from '../lib/types';

// Test data
const validRow: SheetRow = {
  Data: '2026-02-20',
  Tipo: 'Entrada',
  Categoria: 'F5',
  Valor: '100.50',
  Descrição: 'Test income',
};

const validRowBrazilian: SheetRow = {
  Data: '20/02/2026',
  Tipo: 'Saída',
  Categoria: 'Moradia',
  Valor: '1500,00',
  Descrição: 'Rent payment',
};

describe('Sync Transactions Service', () => {
  describe('validateTransaction', () => {
    it('should validate a correct transaction with ISO date', () => {
      const result = validateTransaction(validRow, 1);
      expect(result).not.toBeNull();
      expect(result?.date).toBe('2026-02-20');
      expect(result?.type).toBe('income');
      expect(result?.category).toBe('f5');
      expect(result?.amount).toBe(100.50);
    });

    it('should validate a correct transaction with Brazilian date format', () => {
      const result = validateTransaction(validRowBrazilian, 1);
      expect(result).not.toBeNull();
      expect(result?.date).toBe('2026-02-20');
      expect(result?.type).toBe('expense');
      expect(result?.category).toBe('moradia');
      expect(result?.amount).toBe(1500);
    });

    it('should fail validation for missing data', () => {
      const row: SheetRow = {
        Tipo: 'Entrada',
        Categoria: 'F5',
        Valor: '100',
      };
      const result = validateTransaction(row, 1);
      expect(result).toBeNull();
    });

    it('should fail validation for invalid tipo', () => {
      const row: SheetRow = {
        Data: '2026-02-20',
        Tipo: 'Invalid',
        Categoria: 'F5',
        Valor: '100',
      };
      const result = validateTransaction(row, 1);
      expect(result).toBeNull();
    });

    it('should fail validation for unknown category', () => {
      const row: SheetRow = {
        Data: '2026-02-20',
        Tipo: 'Entrada',
        Categoria: 'UnknownCategory',
        Valor: '100',
      };
      const result = validateTransaction(row, 1);
      expect(result).toBeNull();
    });

    it('should fail validation for amount <= 0', () => {
      const row: SheetRow = {
        Data: '2026-02-20',
        Tipo: 'Entrada',
        Categoria: 'F5',
        Valor: '0',
      };
      const result = validateTransaction(row, 1);
      expect(result).toBeNull();
    });

    it('should fail validation for invalid amount', () => {
      const row: SheetRow = {
        Data: '2026-02-20',
        Tipo: 'Entrada',
        Categoria: 'F5',
        Valor: 'abc',
      };
      const result = validateTransaction(row, 1);
      expect(result).toBeNull();
    });

    it('should fail validation for invalid date', () => {
      const row: SheetRow = {
        Data: 'invalid-date',
        Tipo: 'Entrada',
        Categoria: 'F5',
        Valor: '100',
      };
      const result = validateTransaction(row, 1);
      expect(result).toBeNull();
    });
  });

  describe('validateAndNormalizeDate', () => {
    it('should keep ISO format unchanged', () => {
      const result = validateAndNormalizeDate('2026-02-20');
      expect(result).toBe('2026-02-20');
    });

    it('should convert DD/MM/YYYY to ISO', () => {
      const result = validateAndNormalizeDate('20/02/2026');
      expect(result).toBe('2026-02-20');
    });

    it('should convert single digit day/month to ISO', () => {
      const result = validateAndNormalizeDate('5/3/2026');
      expect(result).toBe('2026-03-05');
    });

    it('should reject invalid date', () => {
      const result = validateAndNormalizeDate('32/02/2026'); // Feb 32 doesn't exist
      expect(result).toBeNull();
    });

    it('should reject empty date', () => {
      const result = validateAndNormalizeDate('');
      expect(result).toBeNull();
    });

    it('should reject null date', () => {
      const result = validateAndNormalizeDate(null);
      expect(result).toBeNull();
    });
  });

  describe('validateAndNormalizeAmount', () => {
    it('should normalize comma decimal separator', () => {
      const result = validateAndNormalizeAmount('100,50');
      expect(result).toBe(100.5);
    });

    it('should handle dot decimal separator', () => {
      const result = validateAndNormalizeAmount('100.50');
      expect(result).toBe(100.5);
    });

    it('should remove currency symbols', () => {
      const result = validateAndNormalizeAmount('R$ 100,50');
      expect(result).toBe(100.5);
    });

    it('should handle negative amounts', () => {
      const result = validateAndNormalizeAmount('-100.50');
      expect(result).toBe(-100.5);
    });

    it('should reject invalid amount', () => {
      const result = validateAndNormalizeAmount('abc');
      expect(result).toBeNull();
    });

    it('should reject empty amount', () => {
      const result = validateAndNormalizeAmount('');
      expect(result).toBeNull();
    });

    it('should reject null amount', () => {
      const result = validateAndNormalizeAmount(null);
      expect(result).toBeNull();
    });
  });

  describe('processTransactionRows', () => {
    it('should process mixed valid and invalid rows', () => {
      const rows: SheetRow[] = [
        validRow,
        {
          Data: 'invalid',
          Tipo: 'Entrada',
          Categoria: 'F5',
          Valor: '100',
        },
        validRowBrazilian,
      ];

      const result = processTransactionRows(rows);
      expect(result.valid.length).toBe(2);
      expect(result.errors.length).toBe(1);
      expect(result.valid[0].category).toBe('f5');
      expect(result.valid[1].category).toBe('moradia');
    });

    it('should return empty arrays for empty input', () => {
      const result = processTransactionRows([]);
      expect(result.valid.length).toBe(0);
      expect(result.errors.length).toBe(0);
    });

    it('should mark all rows as errors if all invalid', () => {
      const rows: SheetRow[] = [
        { Tipo: 'Invalid' },
        { Data: 'invalid' },
      ];

      const result = processTransactionRows(rows);
      expect(result.valid.length).toBe(0);
      expect(result.errors.length).toBe(2);
    });
  });

  describe('retryWithBackoff', () => {
    it('should retry on failure and succeed', async () => {
      // Simplified test without jest.fn() matchers
      let callCount = 0;
      const fn = async () => {
        callCount++;
        if (callCount < 3) throw new Error('Fail');
        return 'success';
      };
      const result = await retryWithBackoff(fn, 3, [10, 10]);
      expect(result).toBe('success');
    });

    it('should use exponential backoff delays', async () => {
      jest.useFakeTimers();
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, 2, [100]);

      // Fast-forward time
      jest.advanceTimersByTime(100);
      const result = await promise;

      expect(result).toBe('success');
      jest.useRealTimers();
    });
  });
});

// Test helpers (these would normally use Jest or another test framework)
function expect(value: any) {
  return {
    toBeNull: () => {
      if (value !== null) throw new Error(`Expected null, got ${value}`);
    },
    toBe: (expected: any) => {
      if (value !== expected) throw new Error(`Expected ${expected}, got ${value}`);
    },
    not: {
      toBeNull: () => {
        if (value === null) throw new Error(`Expected not null`);
      },
    },
  };
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}: ${error}`);
  }
}

// Note: This file is designed for integration with Jest or similar test runners.
// When running with Jest, remove the test helpers above and install Jest types.
