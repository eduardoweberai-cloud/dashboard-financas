'use client'

import { useEffect, useState } from 'react'
import type { DashboardData, KPI } from '@/lib/types'
import {
  calculatePercentage,
  calculateVariation,
  getPercentageColor
} from '@/lib/utils'
import { KPICard } from './KPICard'
import { KPISkeleton } from './KPISkeleton'

interface KPISectionProps {
  period?: string // YYYY-MM format, default to current month
}

/**
 * KPISection - Container com 3 cards lado a lado
 * - Receitas
 * - Despesas
 * - Saldo
 */
export function KPISection({ period }: KPISectionProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (period) params.append('period', period)

        const response = await fetch(`/api/dashboard?${params}`)
        if (!response.ok) throw new Error('Failed to fetch dashboard data')

        const dashboardData: DashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  // Transform DashboardData into KPI array
  const buildKPIs = (dashData: DashboardData): KPI[] => {
    return [
      {
        label: 'Receitas',
        data: dashData.receitas,
        percentage: calculatePercentage(
          dashData.receitas.realized,
          dashData.receitas.projected
        ),
        percentageColor: getPercentageColor(
          calculatePercentage(
            dashData.receitas.realized,
            dashData.receitas.projected
          )
        ),
        variation: calculateVariation(
          dashData.receitas.realized,
          dashData.receitas.previousPeriod
        ),
        variationDirection:
          dashData.receitas.realized >= dashData.receitas.previousPeriod
            ? 'up'
            : 'down'
      },
      {
        label: 'Despesas',
        data: dashData.despesas,
        percentage: calculatePercentage(
          dashData.despesas.realized,
          dashData.despesas.projected
        ),
        percentageColor: getPercentageColor(
          calculatePercentage(
            dashData.despesas.realized,
            dashData.despesas.projected
          )
        ),
        variation: calculateVariation(
          dashData.despesas.realized,
          dashData.despesas.previousPeriod
        ),
        variationDirection:
          dashData.despesas.realized >= dashData.despesas.previousPeriod
            ? 'up'
            : 'down'
      },
      {
        label: 'Saldo',
        data: dashData.saldo,
        percentage: calculatePercentage(
          dashData.saldo.realized,
          dashData.saldo.projected
        ),
        percentageColor: getPercentageColor(
          calculatePercentage(
            dashData.saldo.realized,
            dashData.saldo.projected
          )
        ),
        variation: calculateVariation(
          dashData.saldo.realized,
          dashData.saldo.previousPeriod
        ),
        variationDirection:
          dashData.saldo.realized >= dashData.saldo.previousPeriod
            ? 'up'
            : 'down'
      }
    ]
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-semibold">Erro ao carregar dados</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (loading) {
    return <KPISkeleton />
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
        <p>Nenhum dado disponível</p>
      </div>
    )
  }

  const kpis = buildKPIs(data)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  )
}
