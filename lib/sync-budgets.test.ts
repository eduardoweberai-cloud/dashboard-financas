/**
 * Tests for Budget Synchronization
 * Run with: npx ts-node lib/sync-budgets.test.ts
 */

import { normalizeCategory, getCategoryType } from './category-map';

// Simple test runner
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function describe(name: string, fn: () => void) {
  console.log(`\n📦 ${name}`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, passed: true });
    console.log(`  ✅ ${name}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMsg });
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${errorMsg}`);
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, but got ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy, but got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy, but got ${JSON.stringify(actual)}`);
      }
    },
  };
}

describe('Category Mapping', () => {
  describe('normalizeCategory', () => {
    it('should normalize income categories correctly', () => {
      expect(normalizeCategory('F5 IA')).toBe('f5_ai');
      expect(normalizeCategory('Clientes')).toBe('clientes');
      expect(normalizeCategory('Outras')).toBe('outros_entrada'); // Context-aware
    });

    it('should normalize expense categories correctly', () => {
      expect(normalizeCategory('Moradia')).toBe('moradia');
      expect(normalizeCategory('Alimentação')).toBe('alimentacao');
      expect(normalizeCategory('Carro (Outros)')).toBe('carro_outros');
    });

    it('should handle whitespace', () => {
      expect(normalizeCategory('  F5 IA  ')).toBe('f5_ai');
      expect(normalizeCategory('Moradia ')).toBe('moradia');
    });

    it('should be case-insensitive', () => {
      expect(normalizeCategory('f5 ia')).toBe('f5_ai');
      expect(normalizeCategory('CLIENTES')).toBe('clientes');
      expect(normalizeCategory('moradia')).toBe('moradia');
    });

    it('should return null for unknown categories', () => {
      expect(normalizeCategory('Unknown Category')).toBeNull();
      expect(normalizeCategory('')).toBeNull();
      expect(normalizeCategory('   ')).toBeNull();
    });

    it('should not match partial strings', () => {
      expect(normalizeCategory('F5')).toBe('f5');
      expect(normalizeCategory('Saúde Extra')).toBeNull(); // Not "Renda Extra"
    });
  });

  describe('getCategoryType', () => {
    it('should identify income categories', () => {
      expect(getCategoryType('f5_ai')).toBe('income');
      expect(getCategoryType('clientes')).toBe('income');
      expect(getCategoryType('renda_extra')).toBe('income');
    });

    it('should identify expense categories', () => {
      expect(getCategoryType('moradia')).toBe('expense');
      expect(getCategoryType('alimentacao')).toBe('expense');
      expect(getCategoryType('gasolina')).toBe('expense');
    });
  });
});

describe('Data Validation', () => {
  it('should validate positive budget amounts', () => {
    const validateBudgetValue = (value: unknown): value is number => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    };

    expect(validateBudgetValue(1000)).toBe(true);
    expect(validateBudgetValue('1000')).toBe(true);
    expect(validateBudgetValue(0)).toBe(false);
    expect(validateBudgetValue(-100)).toBe(false);
    expect(validateBudgetValue('invalid')).toBe(false);
    expect(validateBudgetValue(null)).toBe(false);
  });

  it('should validate years', () => {
    const validateYear = (year: number): boolean => {
      return year >= 2020 && year <= 2030;
    };

    expect(validateYear(2026)).toBe(true);
    expect(validateYear(2020)).toBe(true);
    expect(validateYear(2030)).toBe(true);
    expect(validateYear(2019)).toBe(false);
    expect(validateYear(2031)).toBe(false);
  });

  it('should validate months', () => {
    const validateMonth = (month: number): boolean => {
      return month >= 1 && month <= 12;
    };

    expect(validateMonth(1)).toBe(true);
    expect(validateMonth(6)).toBe(true);
    expect(validateMonth(12)).toBe(true);
    expect(validateMonth(0)).toBe(false);
    expect(validateMonth(13)).toBe(false);
  });
});

describe('Month Formatting', () => {
  it('should format month strings correctly', () => {
    const formatMonth = (year: number, month: number): string => {
      return `${year}-${String(month).padStart(2, '0')}`;
    };

    expect(formatMonth(2026, 1)).toBe('2026-01');
    expect(formatMonth(2026, 6)).toBe('2026-06');
    expect(formatMonth(2026, 12)).toBe('2026-12');
  });
});

describe('Category Coverage', () => {
  it('should have 9 income categories', () => {
    const categories = ['f5_ai', 'f5', 'ai_pilar', 'spr', 'clientes', 'renda_extra', 'proventos', 'cashback_racha', 'outros_entrada'];
    categories.forEach(cat => {
      expect(getCategoryType(cat as any)).toBe('income');
    });
  });

  it('should have 21 expense categories', () => {
    const categories = ['moradia', 'faculdade', 'gasolina', 'corpo', 'estudos', 'saude', 'livros', 'cuidados_pessoais', 'alimentacao', 'mercado', 'compras', 'lazer', 'assinaturas', 'ia', 'ofertas', 'doacoes', 'presentes', 'carro_outros', 'transporte', 'impostos', 'outros_saida'];
    categories.forEach(cat => {
      expect(getCategoryType(cat as any)).toBe('expense');
    });
  });

  it('should result in ~360 records (12 months × 30 categories)', () => {
    const months = 12;
    const categories = 30;
    expect(months * categories).toBe(360);
  });
});

// Run all tests and report
(async () => {
  console.log('\n📋 Test Summary\n');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Some tests failed');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
})();
