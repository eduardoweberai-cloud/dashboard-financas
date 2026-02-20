import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bem-vindo ao Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Visualize e analise seus dados financeiros em tempo real.
        </p>
      </div>

      {/* KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Receitas Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <Badge>+12%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">+2.573 vs. mês anterior</p>
          </CardContent>
        </Card>

        {/* Despesas Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <Badge variant="secondary">-5%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 32.415,50</div>
            <p className="text-xs text-muted-foreground">-1.234 vs. mês anterior</p>
          </CardContent>
        </Card>

        {/* Saldo Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Badge variant="outline">Em dia</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.816,39</div>
            <p className="text-xs text-muted-foreground">Saldo atual da conta</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Meta Mensal</CardTitle>
          <CardDescription>
            Progresso em relação à sua meta de receita do mês
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Receitas</span>
              <span className="text-sm font-semibold">75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Despesas</span>
              <span className="text-sm font-semibold">45%</span>
            </div>
            <Progress value={45} />
          </div>
        </CardContent>
      </Card>

      {/* Sample Component Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Categorias</CardTitle>
          <CardDescription>
            Suas principais categorias de despesa este mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer'].map((category, index) => (
              <div key={category} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium">{category}</span>
                <Badge variant="secondary">
                  {(100 - index * 15)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button>Adicionar Transação</Button>
        <Button variant="outline">Ver Relatório Detalhado</Button>
        <Button variant="ghost">Exportar Dados</Button>
      </div>
    </div>
  )
}
