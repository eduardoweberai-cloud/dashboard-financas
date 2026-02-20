import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { KPISection } from '@/components/dashboard/KPISection'
import { TopMovements } from '@/components/dashboard/TopMovements'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Period Selector Header */}
      <DashboardHeader />

      {/* KPI Cards - Receitas, Despesas, Saldo */}
      <KPISection />

      {/* Top Movements Tables */}
      <TopMovements
        transactions={[
          {
            id: '1',
            date: '2026-02-01',
            description: 'Supermercado',
            amount: 450.50,
            category: 'Alimentação',
            type: 'expense',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-01T10:00:00Z',
            updated_at: '2026-02-01T10:00:00Z',
          },
          {
            id: '2',
            date: '2026-02-05',
            description: 'Salário',
            amount: 5500.00,
            category: 'Salário',
            type: 'income',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-05T10:00:00Z',
            updated_at: '2026-02-05T10:00:00Z',
          },
          {
            id: '3',
            date: '2026-02-10',
            description: 'Aluguel',
            amount: 1800.00,
            category: 'Moradia',
            type: 'expense',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-10T10:00:00Z',
            updated_at: '2026-02-10T10:00:00Z',
          },
          {
            id: '4',
            date: '2026-02-12',
            description: 'Uber',
            amount: 120.30,
            category: 'Transporte',
            type: 'expense',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-12T10:00:00Z',
            updated_at: '2026-02-12T10:00:00Z',
          },
          {
            id: '5',
            date: '2026-02-15',
            description: 'Freelance',
            amount: 1200.00,
            category: 'Freelance',
            type: 'income',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-15T10:00:00Z',
            updated_at: '2026-02-15T10:00:00Z',
          },
          {
            id: '6',
            date: '2026-02-18',
            description: 'Academia',
            amount: 150.00,
            category: 'Saúde',
            type: 'expense',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-18T10:00:00Z',
            updated_at: '2026-02-18T10:00:00Z',
          },
          {
            id: '7',
            date: '2026-02-20',
            description: 'Restaurante',
            amount: 85.50,
            category: 'Alimentação',
            type: 'expense',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-20T10:00:00Z',
            updated_at: '2026-02-20T10:00:00Z',
          },
          {
            id: '8',
            date: '2026-02-22',
            description: 'Dividendos',
            amount: 300.00,
            category: 'Investimentos',
            type: 'income',
            source_sheet: 'Lancamentos2026',
            created_at: '2026-02-22T10:00:00Z',
            updated_at: '2026-02-22T10:00:00Z',
          },
        ]}
      />

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button>Adicionar Transação</Button>
        <Button variant="outline">Ver Relatório Detalhado</Button>
        <Button variant="ghost">Exportar Dados</Button>
      </div>
    </div>
  )
}
