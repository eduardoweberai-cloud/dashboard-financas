'use client'

import { useEffect, useState } from 'react'
import { GoalProgressBar } from './GoalProgressBar'
import type { Transaction } from '@/lib/types'

interface GoalsSectionProps {
  transactions: Transaction[]
  currentPeriod: string // YYYY-MM
}

/**
 * GoalsSection - Container com 2 progress bars:
 * 1. Meta Mensal: Receitas - Despesas do período
 * 2. Meta Anual: Progresso de economia YTD (R$ 50k)
 */
export function GoalsSection({
  transactions,
  currentPeriod
}: GoalsSectionProps) {
  const [monthlyGoal, setMonthlyGoal] = useState(0)
  const [annualGoal, setAnnualGoal] = useState(0)
  const [monthlyAchieved, setMonthlyAchieved] = useState(0)
  const [annualAchieved, setAnnualAchieved] = useState(0)

  useEffect(() => {
    // Extrair ano-mês
    const [year] = currentPeriod.split('-')

    // Meta Mensal: Receitas - Despesas do período
    const monthlyTransactions = transactions.filter(t => {
      const tDate = t.date.substring(0, 7) // YYYY-MM
      return tDate === currentPeriod
    })

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyBalance = monthlyIncome - monthlyExpenses

    // Meta Mensal é baseada na expectativa (usar média histórica ou valor fixo)
    // Para MVP, usar 70% das receitas como meta de economia
    const monthlyGoalValue = monthlyIncome * 0.7

    setMonthlyAchieved(Math.max(monthlyBalance, 0))
    setMonthlyGoal(monthlyGoalValue)

    // Meta Anual: YTD (Year-to-date) vs R$ 50.000
    const ytdTransactions = transactions.filter(t => {
      const tYear = t.date.substring(0, 4) // YYYY
      return tYear === year
    })

    const ytdIncome = ytdTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const ytdExpenses = ytdTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const ytdBalance = ytdIncome - ytdExpenses
    const annualGoalValue = 50000 // Meta anual fixo: R$ 50k

    setAnnualAchieved(Math.max(ytdBalance, 0))
    setAnnualGoal(annualGoalValue)
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
