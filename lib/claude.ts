/**
 * Claude API Client
 * Integrates with Anthropic Claude API for financial chat intelligence
 */

import axios from 'axios';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContext {
  period: string;
  tipo_periodo: string;
  kpis: {
    receitas: number;
    despesas: number;
    saldo: number;
  };
  categorias: string[];
}

export class ClaudeClient {
  private apiKey: string;
  private baseURL = 'https://api.anthropic.com/v1';
  private model = 'claude-3-5-sonnet-20241022';

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
  }

  /**
   * Build system prompt with financial context
   */
  private buildSystemPrompt(context: ChatContext): string {
    return `Você é um assistente financeiro inteligente analisando dados de um dashboard financeiro brasileiro.

CONTEXTO ATUAL:
- Período: ${context.period} (${context.tipo_periodo})
- Receitas: R$ ${context.kpis.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Despesas: R$ ${context.kpis.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Saldo: R$ ${context.kpis.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Categorias: ${context.categorias.join(', ')}

INSTRUÇÕES:
1. Responda sempre em português brasileiro
2. Use dados contextuais para análises precisas
3. Forneça insights financeiros acionáveis
4. Se não souber, seja honesto e sugira alternativas
5. Respostas concisas e diretas (máximo 300 caracteres)`;
  }

  /**
   * Send message to Claude API
   */
  async chat(userMessage: string, context: ChatContext, conversationHistory: ClaudeMessage[] = []): Promise<string> {
    try {
      // Build messages array with history
      const messages: ClaudeMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          model: this.model,
          max_tokens: 1024,
          system: this.buildSystemPrompt(context),
          messages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      // Extract text from response
      const content = response.data.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response format from Claude API');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message;

        if (status === 401) {
          throw new Error('Invalid API key');
        }
        if (status === 429) {
          throw new Error('Rate limit exceeded. Try again in a moment.');
        }
        if (status === 500) {
          throw new Error('Claude API error. Try again later.');
        }

        throw new Error(`Claude API error: ${message}`);
      }

      throw error;
    }
  }
}

// Export singleton instance
export const claudeClient = new ClaudeClient();
