import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { DashboardData } from '@/lib/types'

/**
 * GET /api/dashboard
 * Busca dados reais de Supabase:
 * - REALIZADO: de transactions (Lancamentos2026 sincronizados)
 * - PROJETADO: de monthly_budgets (Orçamento2026 sincronizados)
 */
export async function GET(request: NextRequest) {
  try {
    // Inicializa cliente Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials missing, using fallback mock data')
      return getFallbackMockData(request)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Extrai período da query string (formato: YYYY-MM)
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || getCurrentYearMonth()
    const previousPeriod = getPreviousYearMonth(period)

    // Busca dados REALIZADOS (Transactions)
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', `${period}-01`)
      .lt('date', getNextMonth(period))

    // Busca dados PROJETADOS (Monthly Budgets)
    const { data: budgets, error: budError } = await supabase
      .from('monthly_budgets')
      .select('*')
      .eq('month', period)

    if (txError || budError) {
      console.error('Database errors:', { txError, budError })
      return getFallbackMockData(request)
    }

    // Calcula totais de transações (REALIZADO)
    const realizedReceipts = transactions
      ?.filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0

    const realizedExpenses = transactions
      ?.filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0

    const realizedBalance = realizedReceipts - realizedExpenses

    // Calcula totais de orçamento (PROJETADO)
    const projectedReceipts = budgets
      ?.filter(b => isIncomeCategory(b.category))
      .reduce((sum, b) => sum + (b.budgeted_amount || 0), 0) || 0

    const projectedExpenses = budgets
      ?.filter(b => isExpenseCategory(b.category))
      .reduce((sum, b) => sum + (b.budgeted_amount || 0), 0) || 0

    const projectedBalance = projectedReceipts - projectedExpenses

    // Busca dados do período anterior para cálculo de variação
    const { data: previousTransactions } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', `${previousPeriod}-01`)
      .lt('date', getNextMonth(previousPeriod))

    const previousReceipts = previousTransactions
      ?.filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0

    const previousExpenses = previousTransactions
      ?.filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0

    const previousBalance = previousReceipts - previousExpenses

    // Monta resposta
    const data: DashboardData = {
      receitas: {
        realized: realizedReceipts,
        projected: projectedReceipts,
        previousPeriod: previousReceipts
      },
      despesas: {
        realized: realizedExpenses,
        projected: projectedExpenses,
        previousPeriod: previousExpenses
      },
      saldo: {
        realized: realizedBalance,
        projected: projectedBalance,
        previousPeriod: previousBalance
      },
      period: {
        current: period,
        previous: previousPeriod
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

/**
 * Retorna dados mock como fallback se Supabase não estiver disponível
 */
function getFallbackMockData(request: NextRequest): NextResponse<DashboardData> {
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') || '2026-01'
  const previousPeriod = searchParams.get('previousPeriod') || '2025-12'

  const mockData: DashboardData = {
    receitas: {
      realized: 35000,
      projected: 40000,
      previousPeriod: 32000
    },
    despesas: {
      realized: 8500,
      projected: 10000,
      previousPeriod: 9000
    },
    saldo: {
      realized: 26500,
      projected: 30000,
      previousPeriod: 23000
    },
    period: {
      current: period,
      previous: previousPeriod
    }
  }

  return NextResponse.json(mockData)
}

/**
 * Retorna ano-mês atual (YYYY-MM)
 */
function getCurrentYearMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Retorna mês anterior (YYYY-MM)
 */
function getPreviousYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  let monthNum = parseInt(month) - 1

  if (monthNum === 0) {
    return `${parseInt(year) - 1}-12`
  }

  return `${year}-${String(monthNum).padStart(2, '0')}`
}

/**
 * Retorna próximo mês (YYYY-MM)
 */
function getNextMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  let monthNum = parseInt(month) + 1

  if (monthNum === 13) {
    return `${parseInt(year) + 1}-01`
  }

  return `${year}-${String(monthNum).padStart(2, '0')}`
}

/**
 * Verifica se é categoria de receita
 */
function isIncomeCategory(category: string): boolean {
  const incomeCategories = [
    'f5_ai', 'f5', 'ai_pilar', 'spr', 'clientes',
    'renda_extra', 'proventos', 'cashback_racha', 'outros_entrada'
  ]
  return incomeCategories.includes(category?.toLowerCase() || '')
}

/**
 * Verifica se é categoria de despesa
 */
function isExpenseCategory(category: string): boolean {
  return !isIncomeCategory(category)
}
