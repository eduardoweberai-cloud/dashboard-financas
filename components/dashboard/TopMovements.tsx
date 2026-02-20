'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TopTable } from './TopTable'
import { getTopMovements } from '@/lib/utils'
import type { Transaction, TopMovement } from '@/lib/types'

interface TopMovementsProps {
  transactions: Transaction[]
}

export function TopMovements({ transactions }: TopMovementsProps) {
  const [topExpenses, setTopExpenses] = useState<TopMovement[]>([])
  const [topIncomes, setTopIncomes] = useState<TopMovement[]>([])

  useEffect(() => {
    if (transactions.length > 0) {
      const expenses = getTopMovements(transactions, 'expense', 5)
      const incomes = getTopMovements(transactions, 'income', 5)

      setTopExpenses(expenses)
      setTopIncomes(incomes)
    }
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Movimentações</CardTitle>
        <CardDescription>
          Maiores gastos e entradas do período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TopTable
            title="Top 5 Gastos"
            data={topExpenses}
            variant="expense"
          />
          <TopTable
            title="Top 5 Entradas"
            data={topIncomes}
            variant="income"
          />
        </div>
      </CardContent>
    </Card>
  )
}
