'use client';

import React, { useMemo } from 'react';
import { Transaction, Period } from '@/lib/types';
import { aggregateByCategory, getBalanceChartData } from '@/lib/chart-utils';
import { DonutChart } from './DonutChart';
import { BalanceChart } from './BalanceChart';
import { ChartSkeleton } from './ChartSkeleton';

interface DistributionChartsProps {
  transactions: Transaction[];
  period: Period;
  isLoading?: boolean;
}

/**
 * DistributionCharts component
 * Displays 2 donuts (income/expense) + 1 bar chart (evolution)
 * Memoized to prevent unnecessary re-renders
 */
export const DistributionCharts = React.memo(
  function DistributionCharts({
    transactions,
    period,
    isLoading = false,
  }: DistributionChartsProps) {
    // Memoize aggregated data
    const expenseData = useMemo(
      () => aggregateByCategory(transactions, 'expense'),
      [transactions]
    );

    const incomeData = useMemo(
      () => aggregateByCategory(transactions, 'income'),
      [transactions]
    );

    const balanceData = useMemo(
      () => getBalanceChartData(transactions, period),
      [transactions, period]
    );

    // Show skeleton while loading
    if (isLoading) {
      return <ChartSkeleton />;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Donut */}
        <div className="bg-white rounded-lg shadow p-6">
          <DonutChart data={expenseData} title="Despesas por Categoria" />
        </div>

        {/* Income Donut */}
        <div className="bg-white rounded-lg shadow p-6">
          <DonutChart data={incomeData} title="Receitas por Categoria" />
        </div>

        {/* Balance Evolution Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <BalanceChart
            data={balanceData}
            period={
              period.type === 'mensal'
                ? 'Mensal'
                : period.type === 'trimestral'
                  ? 'Trimestral'
                  : period.type === 'semestral'
                    ? 'Semestral'
                    : 'Anual'
            }
          />
        </div>
      </div>
    );
  }
);

DistributionCharts.displayName = 'DistributionCharts';
