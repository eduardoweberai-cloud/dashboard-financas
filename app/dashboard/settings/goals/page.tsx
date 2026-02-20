import { GoalsSettings } from '@/components/settings/GoalsSettings'

export default function GoalsSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuração de Metas</h1>
          <p className="mt-2 text-gray-600">
            Defina suas metas de economia mensal (em % das receitas) e anual (valor em R$)
          </p>
        </div>

        <GoalsSettings />
      </div>
    </div>
  )
}
