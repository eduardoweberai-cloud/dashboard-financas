'use client'

import { TopMovement } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TopTableProps {
  title: string
  data: TopMovement[]
  variant?: 'income' | 'expense'
}

export function TopTable({ title, data, variant }: TopTableProps) {
  const borderColor =
    variant === 'income'
      ? 'border-green-200 hover:bg-green-50'
      : 'border-red-200 hover:bg-red-50'

  const headerColor =
    variant === 'income'
      ? 'bg-green-50 text-green-900'
      : 'bg-red-50 text-red-900'

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={cn('px-4 py-3', headerColor)}>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Categoria
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                'border-b border-gray-100 transition-colors',
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                row.category ? borderColor : ''
              )}
            >
              <td className="px-4 py-3 text-gray-800">
                {row.category || '-'}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {row.category ? formatCurrency(row.amount) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
