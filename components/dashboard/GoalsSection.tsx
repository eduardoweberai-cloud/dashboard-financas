'use client'

import { useEffect, useState } from 'react'
import { GoalProgressBar } from './GoalProgressBar'
import { metasService } from '@/lib/db'
import type { Transaction } from '@/lib/types'

interface GoalsSectionProps {
  transactions: Transaction[]
  currentPeriod: string // YYYY-MM
}

/**
 * GoalsSection - Container com 2 progress bars:
 * 1. Meta Mensal: Receitas - Despesas do período (% configurável)
 * 2. Meta Anual: Progresso de economia YTD (do DB ou fallback)
 */
export function GoalsSection({
  transactions,
  currentPeriod
}: GoalsSectionProps) {
  const [monthlyGoal, setMonthlyGoal] = useState(0)
  const [annualGoal, setAnnualGoal] = useState(0)
  const [monthlyAchieved, setMonthlyAchieved] = useState(0)
  const [annualAchieved, setAnnualAchieved] = useState(0)

  // Validar inputs e garantir valores >= 0
  const validateAmount = (value: number): number => {
    if (!Number.isFinite(value) || value < 0) return 0
    return value
  }

  useEffect(() => {
    // Extrair ano-mês
    const [year] = currentPeriod.split('-')

    // Meta Mensal: Receitas - Despesas do período
    const monthlyTransactions = transactions.filter(t => {
      const tDate = t.date.substring(0, 7) // YYYY-MM
      return tDate === currentPeriod
    })

    const monthlyIncome = validateAmount(
      monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
    )

    const monthlyExpenses = validateAmount(
      monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    )

    const monthlyBalance = monthlyIncome - monthlyExpenses

    // Meta Mensal: usar % configurável das receitas (env var ou 70% default)
    const monthlyPercentage =
      parseFloat(process.env.NEXT_PUBLIC_GOALS_MONTHLY_PERCENTAGE || '0.7') || 0.7
    const monthlyGoalValue = monthlyIncome * monthlyPercentage

    setMonthlyAchieved(validateAmount(monthlyBalance))
    setMonthlyGoal(validateAmount(monthlyGoalValue))

    // Meta Anual: YTD (Year-to-date) vs DB ou fallback
    const ytdTransactions = transactions.filter(t => {
      const tYear = t.date.substring(0, 4) // YYYY
      return tYear === year
    })

    const ytdIncome = validateAmount(
      ytdTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
    )

    const ytdExpenses = validateAmount(
      ytdTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    )

    const ytdBalance = ytdIncome - ytdExpenses

    // Buscar meta anual do DB, com fallback para env var
    const loadAnnualGoal = async () => {
      try {
        const dbGoal = await metasService.getAnnualGoal(year)
        if (dbGoal?.target_amount) {
          return validateAmount(dbGoal.target_amount)
        }
      } catch (error) {
        console.warn('Failed to fetch annual goal from DB:', error)
      }
      // Fallback: usar env var ou 50000
      const envGoal = process.env.NEXT_PUBLIC_GOALS_ANNUAL_TARGET
      return validateAmount(parseFloat(envGoal || '50000') || 50000)
    }

    loadAnnualGoal().then(goalValue => {
      setAnnualAchieved(validateAmount(ytdBalance))
      setAnnualGoal(goalValue)
    })
  }, [transactions, currentPeriod])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Metas</h2>
        <p className="text-sm text-gray-600">
          Acompanhe seu progresso contra as metas de economia
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GoalProgressBar
          label="Meta Mensal"
          achieved={monthlyAchieved}
          goal={monthlyGoal}
          type="monthly"
        />
        <GoalProgressBar
          label="Meta Anual"
          achieved={annualAchieved}
          goal={annualGoal}
          type="annual"
        />
      </div>
    </div>
  )
}
