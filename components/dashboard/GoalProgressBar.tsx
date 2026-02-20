'use client'

import { Progress } from '@/components/ui/progress'
import {
  formatCurrency,
  calculateGoalProgress,
  getGoalStatusColor,
  calculateGoalRemaining
} from '@/lib/utils'
import { cn } from '@/lib/utils'

interface GoalProgressBarProps {
  label: string
  achieved: number
  goal: number
  type?: 'monthly' | 'annual'
}

/**
 * GoalProgressBar - Component individual com:
 * 1. Label e tipo de meta (Mensal/Anual)
 * 2. Progress bar com cor (verde/amarelo/vermelho)
 * 3. Progresso em % + saldo restante
 */
export function GoalProgressBar({
  label,
  achieved,
  goal,
  type = 'monthly'
}: GoalProgressBarProps) {
  // Validar inputs: garantir valores não-negativos e finitos
  const validAchieved = Number.isFinite(achieved) && achieved >= 0 ? achieved : 0
  const validGoal = Number.isFinite(goal) && goal > 0 ? goal : 0

  // Se meta é 0, renderizar com valores zerados
  if (validGoal === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">{label}</h3>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {type === 'monthly' ? 'Mensal' : 'Anual'}
          </span>
        </div>
        <p className="text-sm text-gray-500">Nenhuma meta configurada</p>
      </div>
    )
  }

  const progress = calculateGoalProgress(validAchieved, validGoal)
  const remaining = calculateGoalRemaining(validAchieved, validGoal)
  const statusColor = getGoalStatusColor(progress)

  // Cores para status
  const statusColors = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  }

  // Limitar progresso a 100% para exibição visual (mas permitir > 100% em texto)
  const displayProgress = Math.min(progress, 100)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header: Label + Tipo */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {type === 'monthly' ? 'Mensal' : 'Anual'}
        </span>
      </div>

      {/* Progress Bar com cor dinâmica */}
      <div className="mb-3">
        <Progress
          value={displayProgress}
          className={cn(
            'h-8 rounded-full',
            statusColor === 'green' && '[&>div]:bg-green-500',
            statusColor === 'yellow' && '[&>div]:bg-yellow-500',
            statusColor === 'red' && '[&>div]:bg-red-500'
          )}
        />
        <div className="mt-2 text-center">
          <span className={cn('text-xs font-bold', statusColors[statusColor])}>
            {progress.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Info: Saldo restante e formatação */}
      <div className="flex items-center justify-between text-sm">
        <div className="space-y-1">
          <p className="text-gray-600">
            {remaining > 0
              ? `Faltam: ${formatCurrency(remaining)}`
              : `Acima: ${formatCurrency(Math.abs(remaining))}`}
          </p>
          <p className="text-xs text-gray-500">
            {formatCurrency(validAchieved)} / {formatCurrency(validGoal)}
          </p>
        </div>
        <span
          className={cn(
            'inline-block rounded-md px-3 py-1 text-xs font-semibold',
            statusColor === 'green' && 'text-green-600 bg-green-50',
            statusColor === 'yellow' && 'text-yellow-600 bg-yellow-50',
            statusColor === 'red' && 'text-red-600 bg-red-50'
          )}
        >
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}
