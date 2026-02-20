/**
 * Category Mapping for Orçamento2026
 * Maps Google Sheets category names to normalized lowercase names
 * Entradas (9) + Despesas (21) = 30 categories total
 */

/**
 * Normalized category names for income (Entradas)
 */
export const INCOME_CATEGORIES = {
  'F5 IA': 'f5_ai',
  'F5': 'f5',
  'Pilar AI (AI)': 'ai_pilar',
  'SPR': 'spr',
  'Clientes': 'clientes',
  'Renda Extra': 'renda_extra',
  'Proventos': 'proventos',
  'Cashback / Racha': 'cashback_racha',
  'Outras': 'outros_entrada',
} as const;

/**
 * Normalized category names for expenses (Despesas)
 */
export const EXPENSE_CATEGORIES = {
  'Moradia': 'moradia',
  'Faculdade': 'faculdade',
  'Gasolina': 'gasolina',
  'Corpo': 'corpo',
  'Estudos': 'estudos',
  'Saúde': 'saude',
  'Livros': 'livros',
  'Cuidados Pessoais': 'cuidados_pessoais',
  'Alimentação': 'alimentacao',
  'Mercado': 'mercado',
  'Compras': 'compras',
  'Lazer': 'lazer',
  'Assinaturas': 'assinaturas',
  'IA': 'ia',
  'Ofertas': 'ofertas',
  'Doações': 'doacoes',
  'Presentes': 'presentes',
  'Carro (Outros)': 'carro_outros',
  'Transporte': 'transporte',
  'Impostos': 'impostos',
  'Outras': 'outros_saida',
} as const;

/**
 * All categories combined
 */
export const ALL_CATEGORIES = {
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
} as const;

/**
 * Type for category names
 */
export type IncomeCategory = typeof INCOME_CATEGORIES[keyof typeof INCOME_CATEGORIES];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[keyof typeof EXPENSE_CATEGORIES];
export type AllCategory = IncomeCategory | ExpenseCategory;

/**
 * Normalize category name (handle typos, extra spaces, accents)
 */
export function normalizeCategory(raw: string): AllCategory | null {
  if (!raw) return null;

  const trimmed = raw.trim();

  // Try exact match first
  if (trimmed in INCOME_CATEGORIES) {
    return INCOME_CATEGORIES[trimmed as keyof typeof INCOME_CATEGORIES];
  }
  if (trimmed in EXPENSE_CATEGORIES) {
    return EXPENSE_CATEGORIES[trimmed as keyof typeof EXPENSE_CATEGORIES];
  }

  // Try case-insensitive match
  for (const [key, value] of Object.entries(ALL_CATEGORIES)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return value as AllCategory;
    }
  }

  return null;
}

/**
 * Get category type (income or expense)
 */
export function getCategoryType(category: AllCategory): 'income' | 'expense' {
  return category in INCOME_CATEGORIES ? 'income' : 'expense';
}

/**
 * Get reverse mapping (normalized name to original name)
 */
export function getOriginalCategoryName(normalized: AllCategory): string {
  for (const [original, norm] of Object.entries(ALL_CATEGORIES)) {
    if (norm === normalized) {
      return original;
    }
  }
  return normalized;
}
