'use client'

import { useState, useEffect } from 'react'
import { metasService } from '@/lib/db'

/**
 * GoalsSettings - Formulário para configurar metas de economia
 * Permite usuário definir:
 * 1. Meta mensal (% das receitas)
 * 2. Meta anual (R$ absoluto)
 */
export function GoalsSettings() {
  const [monthlyPercentage, setMonthlyPercentage] = useState('70')
  const [annualTarget, setAnnualTarget] = useState('50000')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar valores salvos ao montar
  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      const year = new Date().getFullYear().toString()
      const annualGoal = await metasService.getAnnualGoal(year)

      if (annualGoal?.target_amount) {
        setAnnualTarget(annualGoal.target_amount.toString())
      }

      // Meta mensal vem do env var (não há no DB ainda)
      const envMonthly = process.env.NEXT_PUBLIC_GOALS_MONTHLY_PERCENTAGE
      if (envMonthly) {
        setMonthlyPercentage((parseFloat(envMonthly) * 100).toString())
      }
    } catch (err) {
      console.warn('Failed to load goals:', err)
      // Usar defaults se falhar
    } finally {
      setLoading(false)
    }
  }

  const validateInputs = (): boolean => {
    const monthly = parseFloat(monthlyPercentage)
    const annual = parseFloat(annualTarget)

    if (isNaN(monthly) || monthly < 0 || monthly > 100) {
      setError('Meta mensal deve estar entre 0 e 100%')
      return false
    }

    if (isNaN(annual) || annual < 0) {
      setError('Meta anual deve ser maior ou igual a 0')
      return false
    }

    setError(null)
    return true
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateInputs()) {
      return
    }

    try {
      setSaving(true)
      setError(null)

      const year = new Date().getFullYear().toString()
      const annualValue = parseFloat(annualTarget)

      // Salvar meta anual no Supabase
      await metasService.insert({
        title: `Meta Anual ${year}`,
        target_amount: annualValue,
        current_amount: 0, // Será calculado dinamicamente no dashboard
        type: 'annual',
        month: year,
      })

      // Mostrar sucesso
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(`Erro ao salvar: ${err instanceof Error ? err.message : 'Desconhecido'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setMonthlyPercentage('70')
    setAnnualTarget('50000')
    setError(null)
    setSuccess(false)
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando configurações...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Meta Mensal */}
        <div>
          <label htmlFor="monthly" className="block text-sm font-medium text-gray-900">
            Meta Mensal (% das receitas)
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="monthly"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={monthlyPercentage}
              onChange={(e) => setMonthlyPercentage(e.target.value)}
              disabled={saving}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <span className="text-gray-600">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Exemplo: 70% significa economizar 70% das suas receitas mensais
          </p>
        </div>

        {/* Meta Anual */}
        <div>
          <label htmlFor="annual" className="block text-sm font-medium text-gray-900">
            Meta Anual (R$)
          </label>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-gray-600">R$</span>
            <input
              id="annual"
              type="number"
              min="0"
              step="1000"
              value={annualTarget}
              onChange={(e) => setAnnualTarget(e.target.value)}
              disabled={saving}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Quanto você espera economizar no ano ({new Date().getFullYear()})
          </p>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              ✅ Configurações salvas com sucesso!
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-900 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400"
          >
            Cancelar
          </button>
        </div>

        <p className="text-xs text-gray-500">
          💡 Dica: Essas configurações são usadas no dashboard para calcular seu progresso contra as metas.
        </p>
      </form>
    </div>
  )
}
