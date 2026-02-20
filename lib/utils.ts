import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata número como moeda em Real Brasileiro
 * @example formatCurrency(35000) => "R$ 35.000,00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Calcula percentual de realização
 * @example calculatePercentage(35000, 40000) => 87.5
 */
export function calculatePercentage(realized: number, projected: number): number {
  if (projected === 0) return 0
  return (realized / projected) * 100
}

/**
 * Determina cor baseada em percentual
 * Verde >= 100%, Amarelo 80-99%, Vermelho < 80%
 */
export function getPercentageColor(
  percentage: number
): 'green' | 'yellow' | 'red' {
  if (percentage >= 100) return 'green'
  if (percentage >= 80) return 'yellow'
  return 'red'
}

/**
 * Calcula variação percentual vs período anterior
 * @example calculateVariation(35000, 32000) => 9.375
 */
export function calculateVariation(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Extrai Top 5 transações (gastos ou entradas) ordenadas por maior valor
 */
export function getTopMovements(
  transactions: any[],
  type: 'income' | 'expense',
  limit: number = 5
) {
  const filtered = transactions
    .filter(t => t.type === type)
    .reduce((acc: Record<string, number>, t: any) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const sorted = Object.entries(filtered)
    .map(([category, amount]) => ({ category, amount, type }))
    .sort((a, b) => (b as any).amount - (a as any).amount)
    .slice(0, limit)

  // Preencher com linhas vazias se < 5
  while (sorted.length < limit) {
    sorted.push({ category: '', amount: 0, type })
  }

  return sorted
}

/**
 * Calcula progresso de uma meta (percentual)
 * @example calculateGoalProgress(12500, 10000) => 125
 */
export function calculateGoalProgress(
  achieved: number,
  goal: number
): number {
  if (goal === 0) return 0
  return (achieved / goal) * 100
}

/**
 * Determina cor baseada no progresso da meta
 * Verde >= 80%, Amarelo 60-79%, Vermelho < 60%
 */
export function getGoalStatusColor(
  progress: number
): 'green' | 'yellow' | 'red' {
  if (progress >= 80) return 'green'
  if (progress >= 60) return 'yellow'
  return 'red'
}

/**
 * Calcula saldo restante para atingir a meta
 * Valor positivo = faltam, negativo = acima da meta
 */
export function calculateGoalRemaining(
  achieved: number,
  goal: number
): number {
  return goal - achieved
}

/**
 * Calcula horas desde a última sincronização bem-sucedida
 * @param syncDate Data/hora da última sincronização (ISO string)
 * @returns Número de horas desde então
 */
export function calculateHoursSinceSync(syncDate: string): number {
  const lastSyncTime = new Date(syncDate).getTime();
  const nowTime = new Date().getTime();
  const diffMs = nowTime - lastSyncTime;
  return Math.floor(diffMs / (1000 * 60 * 60));
}

/**
 * Determina cor da badge baseada em horas desde sincronização
 * Amarelo: 24-48h, Vermelho: > 48h
 * @param hoursSince Horas desde última sincronização bem-sucedida
 * @returns Cor: 'yellow' | 'red' | null (null = sincronização OK)
 */
export function getStatusColor(hoursSince: number): 'yellow' | 'red' | null {
  if (hoursSince > 48) return 'red';
  if (hoursSince >= 24) return 'yellow';
  return null; // Sincronização OK
}
