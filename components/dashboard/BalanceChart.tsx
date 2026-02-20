'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BalanceData } from '@/lib/chart-utils';

interface BalanceChartProps {
  data: BalanceData[];
  period: string;
}

/**
 * Custom tooltip for balance chart
 * Shows income, expense, and balance
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{payload[0].payload.label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}:{' '}
            {entry.value.toLocaleString('pt-BR', {
              maximumFractionDigits: 0,
            })}
          </p>
        ))}
        <p className="text-gray-700 font-semibold">
          Saldo:{' '}
          {payload[0].payload.balance.toLocaleString('pt-BR', {
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
    );
  }
  return null;
}

/**
 * BalanceChart component
 * Displays balance evolution with stacked bars (income/expense)
 */
export function BalanceChart({ data, period }: BalanceChartProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-500">
        <p>Sem dados para este período</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Evolução de Saldo - {period}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            interval={Math.floor(data.length / 12) || 0}
          />
          <YAxis
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="income"
            fill="#10b981"
            name="Receita"
            stackId="a"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="expense"
            fill="#ef4444"
            name="Despesa"
            stackId="a"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
