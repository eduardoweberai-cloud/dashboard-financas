import {
  formatCurrency,
  calculatePercentage,
  getPercentageColor,
  calculateVariation
} from '@/lib/utils'

describe('KPI Utilities', () => {
  describe('formatCurrency', () => {
    it('deve formatar número como moeda BRL', () => {
      expect(formatCurrency(35000)).toBe('R$ 35.000,00')
      expect(formatCurrency(8500)).toBe('R$ 8.500,00')
      expect(formatCurrency(1000.50)).toBe('R$ 1.000,50')
    })

    it('deve formatar zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })

    it('deve formatar valores negativos', () => {
      const result = formatCurrency(-1000)
      expect(result).toContain('-')
      expect(result).toContain('R$')
    })
  })

  describe('calculatePercentage', () => {
    it('deve calcular percentual corretamente', () => {
      // Janeiro: 35k realizado, 40k projetado = 87.5%
      const result = calculatePercentage(35000, 40000)
      expect(result).toBe(87.5)
    })

    it('Despesas: 8.5k realizado vs 10k projetado = 85%', () => {
      const result = calculatePercentage(8500, 10000)
      expect(result).toBe(85)
    })

    it('100% quando realizado === projetado', () => {
      const result = calculatePercentage(10000, 10000)
      expect(result).toBe(100)
    })

    it('deve retornar 0 quando projetado é 0', () => {
      const result = calculatePercentage(35000, 0)
      expect(result).toBe(0)
    })

    it('deve retornar > 100% quando realizado > projetado', () => {
      const result = calculatePercentage(45000, 40000)
      expect(result).toBe(112.5)
    })
  })

  describe('getPercentageColor', () => {
    it('deve retornar verde para >= 100%', () => {
      expect(getPercentageColor(100)).toBe('green')
      expect(getPercentageColor(150)).toBe('green')
    })

    it('deve retornar amarelo para 80-99%', () => {
      expect(getPercentageColor(87.5)).toBe('yellow')
      expect(getPercentageColor(80)).toBe('yellow')
      expect(getPercentageColor(99)).toBe('yellow')
    })

    it('deve retornar vermelho para < 80%', () => {
      expect(getPercentageColor(79.9)).toBe('red')
      expect(getPercentageColor(50)).toBe('red')
      expect(getPercentageColor(0)).toBe('red')
    })
  })

  describe('calculateVariation', () => {
    it('deve calcular variação vs período anterior', () => {
      // Janeiro 35k vs Dezembro 32k
      const result = calculateVariation(35000, 32000)
      expect(result).toBeCloseTo(9.375, 2)
    })

    it('deve calcular variação negativa', () => {
      // Janeiro 30k vs Dezembro 32k
      const result = calculateVariation(30000, 32000)
      expect(result).toBeCloseTo(-6.25, 2)
    })

    it('deve retornar 0 quando período anterior é 0', () => {
      const result = calculateVariation(35000, 0)
      expect(result).toBe(0)
    })

    it('deve calcular 100% quando duplica', () => {
      const result = calculateVariation(40000, 20000)
      expect(result).toBe(100)
    })
  })

  describe('Integration Tests', () => {
    it('Teste case: Janeiro Receitas', () => {
      const realized = 35000
      const projected = 40000
      const previous = 32000

      const percentage = calculatePercentage(realized, projected)
      const color = getPercentageColor(percentage)
      const variation = calculateVariation(realized, previous)

      expect(percentage).toBe(87.5)
      expect(color).toBe('yellow')
      expect(variation).toBeCloseTo(9.375, 2)
    })

    it('Teste case: Janeiro Despesas', () => {
      const realized = 8500
      const projected = 10000
      const previous = 9000

      const percentage = calculatePercentage(realized, projected)
      const color = getPercentageColor(percentage)
      const variation = calculateVariation(realized, previous)

      expect(percentage).toBe(85)
      expect(color).toBe('yellow')
      expect(variation).toBeCloseTo(-5.56, 1)
    })

    it('Teste case: Saldo positivo', () => {
      const realized = 26500 // 35k - 8.5k
      const projected = 30000 // 40k - 10k
      const previous = 23000 // 32k - 9k

      const percentage = calculatePercentage(realized, projected)
      const color = getPercentageColor(percentage)
      const variation = calculateVariation(realized, previous)

      expect(percentage).toBeCloseTo(88.33, 1)
      expect(color).toBe('yellow')
      expect(variation).toBeCloseTo(15.22, 1)
    })
  })
})
