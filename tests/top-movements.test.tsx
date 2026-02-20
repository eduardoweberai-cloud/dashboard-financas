import { getTopMovements, formatCurrency } from '@/lib/utils'
import type { Transaction } from '@/lib/types'

describe('getTopMovements', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2026-01-15',
      description: 'Supermercado',
      amount: 250.50,
      category: 'Alimentação',
      type: 'expense',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-15T10:00:00Z',
      updated_at: '2026-01-15T10:00:00Z',
    },
    {
      id: '2',
      date: '2026-01-20',
      description: 'Salário',
      amount: 5000.00,
      category: 'Salário',
      type: 'income',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-20T10:00:00Z',
      updated_at: '2026-01-20T10:00:00Z',
    },
    {
      id: '3',
      date: '2026-01-10',
      description: 'Uber',
      amount: 45.30,
      category: 'Transporte',
      type: 'expense',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-10T10:00:00Z',
      updated_at: '2026-01-10T10:00:00Z',
    },
    {
      id: '4',
      date: '2026-01-05',
      description: 'Aluguel',
      amount: 1500.00,
      category: 'Moradia',
      type: 'expense',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-05T10:00:00Z',
      updated_at: '2026-01-05T10:00:00Z',
    },
    {
      id: '5',
      date: '2026-01-12',
      description: 'Freelance',
      amount: 800.00,
      category: 'Freelance',
      type: 'income',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-12T10:00:00Z',
      updated_at: '2026-01-12T10:00:00Z',
    },
    {
      id: '6',
      date: '2026-01-08',
      description: 'Academia',
      amount: 120.00,
      category: 'Saúde',
      type: 'expense',
      source_sheet: 'Lancamentos2026',
      created_at: '2026-01-08T10:00:00Z',
      updated_at: '2026-01-08T10:00:00Z',
    },
  ]

  it('deve retornar top 5 gastos ordenados descending', () => {
    const result = getTopMovements(mockTransactions, 'expense', 5)

    expect(result).toHaveLength(5)
    expect(result[0].category).toBe('Moradia')
    expect(result[0].amount).toBe(1500.00)
    expect(result[1].category).toBe('Alimentação')
    expect(result[1].amount).toBe(250.50)
    expect(result[2].category).toBe('Transporte')
    expect(result[2].amount).toBe(45.30)
    expect(result[3].category).toBe('Saúde')
    expect(result[3].amount).toBe(120.00)
    // Último deve ser vazio (preencher)
    expect(result[4].category).toBe('')
    expect(result[4].amount).toBe(0)
  })

  it('deve retornar top 5 entradas ordenadas descending', () => {
    const result = getTopMovements(mockTransactions, 'income', 5)

    expect(result).toHaveLength(5)
    expect(result[0].category).toBe('Salário')
    expect(result[0].amount).toBe(5000.00)
    expect(result[1].category).toBe('Freelance')
    expect(result[1].amount).toBe(800.00)
    // Últimos 3 devem ser vazios (preencher)
    expect(result[2].category).toBe('')
    expect(result[3].category).toBe('')
    expect(result[4].category).toBe('')
  })

  it('deve agregar transações por categoria', () => {
    const txWithDuplicates = [
      ...mockTransactions,
      {
        id: '7',
        date: '2026-01-25',
        description: 'Boleto',
        amount: 100.00,
        category: 'Transporte',
        type: 'expense',
        source_sheet: 'Lancamentos2026',
        created_at: '2026-01-25T10:00:00Z',
        updated_at: '2026-01-25T10:00:00Z',
      },
    ]

    const result = getTopMovements(txWithDuplicates, 'expense', 5)

    // Transporte deve agregar 45.30 + 100.00 = 145.30
    expect(result[2].category).toBe('Transporte')
    expect(result[2].amount).toBe(145.30)
  })

  it('deve preencher com linhas vazias se < 5 entradas', () => {
    const minimalTx = [mockTransactions[0]] // Apenas 1 gasto

    const result = getTopMovements(minimalTx, 'expense', 5)

    expect(result).toHaveLength(5)
    expect(result[0].category).toBe('Alimentação')
    expect(result[1].category).toBe('')
    expect(result[2].category).toBe('')
    expect(result[3].category).toBe('')
    expect(result[4].category).toBe('')
  })

  it('deve retornar tipo correto em cada movimento', () => {
    const result = getTopMovements(mockTransactions, 'expense', 5)

    result.forEach(mov => {
      expect(mov.type).toBe('expense')
    })
  })
})

describe('formatCurrency', () => {
  it('deve formatar valores em BRL', () => {
    expect(formatCurrency(1000)).toBe('R$ 1.000,00')
    expect(formatCurrency(1500.50)).toBe('R$ 1.500,50')
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })

  it('deve formatar valores pequenos', () => {
    expect(formatCurrency(10)).toBe('R$ 10,00')
    expect(formatCurrency(0.50)).toBe('R$ 0,50')
  })
})
