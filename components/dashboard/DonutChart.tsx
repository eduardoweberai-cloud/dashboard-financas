'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  type PieLabelRenderProps,
} from 'recharts';
import { DonutData } from '@/lib/chart-utils';
import { getCategoryColor, getCategoryDisplayName } from '@/lib/colors';

interface DonutChartProps {
  data: DonutData[];
  title: string;
}

/**
 * Custom tooltip for donut chart
 * Shows category name, value, and percentage
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{getCategoryDisplayName(data.category)}</p>
        <p className="text-green-600">
          R${' '}
          {data.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
        </p>
        <p className="text-gray-600">{data.percentage}%</p>
      </div>
    );
  }
  return null;
}

/**
 * Custom label renderer for donut slices
 */
function renderLabel(props: PieLabelRenderProps) {
  const entry = props.payload as DonutData;
  if (entry?.percentage >= 5) {
    return `${entry.percentage}%`;
  }
  return null;
}

/**
 * DonutChart component
 * Displays category distribution with Recharts
 */
export function DonutChart({ data, title }: DonutChartProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Sem dados para este período</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={renderLabel}
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.category}`}
                fill={getCategoryColor(entry.category)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(_, entry) => {
              const item = entry.payload as DonutData;
              const displayName = getCategoryDisplayName(item.category);
              const amount = item.value.toLocaleString('pt-BR', {
                maximumFractionDigits: 0,
              });
              return `${displayName}: R$ ${amount} (${item.percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
