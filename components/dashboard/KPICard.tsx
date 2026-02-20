'use client'

import { formatCurrency } from '@/lib/utils'
import type { KPI } from '@/lib/types'
import { cn } from '@/lib/utils'

interface KPICardProps {
  kpi: KPI
}

/**
 * KPICard - Card individual com 3 linhas:
 * 1. Valor realizado + badge variação
 * 2. Projetado em cinza
 * 3. % de realização com cores
 */
export function KPICard({ kpi }: KPICardProps) {
  // Cores para percentagem
  const percentageColors = {
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50'
  }

  // Cores para badge de variação
  const variationColor =
    kpi.variationDirection === 'up'
      ? 'text-green-600 bg-green-50'
      : 'text-red-600 bg-red-50'

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      {/* Label */}
      <h3 className="mb-4 text-sm font-medium text-gray-600">{kpi.label}</h3>

      {/* Linha 1: Valor realizado + Badge variação */}
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-3xl font-bold text-gray-900">
          {formatCurrency(kpi.data.realized)}
        </span>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            variationColor
          )}
        >
          {kpi.variationDirection === 'up' ? '↑' : '↓'}{' '}
          {Math.abs(kpi.variation).toFixed(1)}%
        </span>
      </div>

      {/* Linha 2: Projetado em cinza */}
      <div className="mb-4 text-sm text-gray-500">
        Projetado: <span className="font-medium">{formatCurrency(kpi.data.projected)}</span>
      </div>

      {/* Linha 3: % de realização com cor */}
      <div
        className={cn(
          'inline-block rounded-md px-3 py-1 text-sm font-semibold',
          percentageColors[kpi.percentageColor]
        )}
      >
        {kpi.percentage.toFixed(1)}% realizado
      </div>
    </div>
  )
}
