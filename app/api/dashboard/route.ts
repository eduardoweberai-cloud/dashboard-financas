import { NextRequest, NextResponse } from 'next/server'
import type { DashboardData } from '@/lib/types'

/**
 * GET /api/dashboard
 * Retorna dados de KPIs para o dashboard
 * Mock data baseado em Story 2.2 test cases
 */
export async function GET(request: NextRequest) {
  try {
    // Extrai período da query string (formato: YYYY-MM)
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '2026-01'
    const previousPeriod = searchParams.get('previousPeriod') || '2025-12'

    // Mock data - Janeiro 2026
    const mockData: DashboardData = {
      receitas: {
        realized: 35000,      // R$ 35k realizado
        projected: 40000,     // R$ 40k projetado
        previousPeriod: 32000 // R$ 32k em dezembro
      },
      despesas: {
        realized: 8500,       // R$ 8.5k realizado
        projected: 10000,     // R$ 10k projetado
        previousPeriod: 9000  // R$ 9k em dezembro
      },
      saldo: {
        realized: 26500,      // 35k - 8.5k
        projected: 30000,     // 40k - 10k
        previousPeriod: 23000 // 32k - 9k
      },
      period: {
        current: period,
        previous: previousPeriod
      }
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
