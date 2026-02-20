/**
 * Color palette for chart categories
 * Design tokens: p. 352-425
 */

import { AllCategory } from './category-map';

/**
 * Color mapping for all categories
 */
const CATEGORY_COLORS: Record<AllCategory, string> = {
  // Income categories
  f5_ai: '#10b981',
  f5: '#059669',
  ai_pilar: '#34d399',
  spr: '#6ee7b7',
  clientes: '#a7f3d0',
  renda_extra: '#d1fae5',
  proventos: '#ecfdf5',
  cashback_racha: '#15b981',
  outros_entrada: '#1f9f73',

  // Expense categories
  moradia: '#ef4444',
  faculdade: '#f87171',
  gasolina: '#fca5a5',
  corpo: '#fecaca',
  estudos: '#fed7aa',
  saude: '#fbbf24',
  livros: '#fcd34d',
  cuidados_pessoais: '#fde047',
  alimentacao: '#fef3c7',
  mercado: '#fef08a',
  compras: '#fef08a',
  lazer: '#dbeafe',
  assinaturas: '#bfdbfe',
  ia: '#93c5fd',
  ofertas: '#60a5fa',
  doacoes: '#3b82f6',
  presentes: '#2563eb',
  carro_outros: '#1d4ed8',
  transporte: '#1e40af',
  impostos: '#991b1b',
  outros_saida: '#7c2d12',
};

/**
 * Get color for a category
 */
export function getCategoryColor(category: AllCategory): string {
  return CATEGORY_COLORS[category] || '#9ca3af';
}

/**
 * Get display name for a category
 */
export function getCategoryDisplayName(category: AllCategory): string {
  const displayNames: Record<AllCategory, string> = {
    // Income
    f5_ai: 'F5 IA',
    f5: 'F5',
    ai_pilar: 'Pilar AI',
    spr: 'SPR',
    clientes: 'Clientes',
    renda_extra: 'Renda Extra',
    proventos: 'Proventos',
    cashback_racha: 'Cashback',
    outros_entrada: 'Outros',

    // Expenses
    moradia: 'Moradia',
    faculdade: 'Faculdade',
    gasolina: 'Gasolina',
    corpo: 'Corpo',
    estudos: 'Estudos',
    saude: 'Saúde',
    livros: 'Livros',
    cuidados_pessoais: 'Cuidados',
    alimentacao: 'Alimentação',
    mercado: 'Mercado',
    compras: 'Compras',
    lazer: 'Lazer',
    assinaturas: 'Assinaturas',
    ia: 'IA',
    ofertas: 'Ofertas',
    doacoes: 'Doações',
    presentes: 'Presentes',
    carro_outros: 'Carro',
    transporte: 'Transporte',
    impostos: 'Impostos',
    outros_saida: 'Outros',
  };

  return displayNames[category] || category;
}
