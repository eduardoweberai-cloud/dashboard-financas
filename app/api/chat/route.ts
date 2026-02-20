/**
 * POST /api/chat
 * Chat endpoint that integrates Claude API with financial context
 */

import { NextRequest, NextResponse } from 'next/server';
import { claudeClient } from '@/lib/claude';
import { chatService, transactionService } from '@/lib/db';

interface ChatRequest {
  message: string;
  period: string;
  tipo_periodo: string;
  conversationId?: string;
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

/**
 * Calculate KPIs from transactions in a period
 */
async function calculateKPIs(startDate: string, endDate: string): Promise<Omit<ChatContext, 'period' | 'tipo_periodo'>> {
  try {
    const transactions = await transactionService.getByDateRange(startDate, endDate);

    const kpis = {
      receitas: 0,
      despesas: 0,
      saldo: 0,
    };

    const categorias = new Set<string>();

    transactions.forEach((t) => {
      if (t.type === 'income') {
        kpis.receitas += t.amount;
      } else {
        kpis.despesas += t.amount;
      }
      categorias.add(t.category);
    });

    kpis.saldo = kpis.receitas - kpis.despesas;

    return {
      kpis,
      categorias: Array.from(categorias),
    };
  } catch (error) {
    console.error('Error calculating KPIs:', error);
    return {
      kpis: { receitas: 0, despesas: 0, saldo: 0 },
      categorias: [],
    };
  }
}

/**
 * Extract date range from period string
 * Period format: "2026-02" for mensal, "2026-Q1" for trimestral, etc
 */
function getPeriodDates(period: string, tipo_periodo: string): { startDate: string; endDate: string } {
  const year = period.substring(0, 4);
  const month = period.substring(5, 7);

  let startDate = '';
  let endDate = '';

  switch (tipo_periodo) {
    case 'mensal':
      startDate = `${period}-01`;
      // Get last day of month
      const date = new Date(parseInt(year), parseInt(month), 0);
      endDate = `${year}-${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      break;

    case 'trimestral': {
      const quarter = parseInt(period.substring(6));
      const startMonth = (quarter - 1) * 3 + 1;
      startDate = `${year}-${String(startMonth).padStart(2, '0')}-01`;
      const endMonth = startMonth + 2;
      const lastDate = new Date(parseInt(year), endMonth, 0);
      endDate = `${year}-${String(endMonth).padStart(2, '0')}-${String(lastDate.getDate()).padStart(2, '0')}`;
      break;
    }

    case 'semestral': {
      const semester = parseInt(period.substring(6));
      const startMonth = (semester - 1) * 6 + 1;
      startDate = `${year}-${String(startMonth).padStart(2, '0')}-01`;
      const endMonth = startMonth + 5;
      const lastDate = new Date(parseInt(year), endMonth, 0);
      endDate = `${year}-${String(endMonth).padStart(2, '0')}-${String(lastDate.getDate()).padStart(2, '0')}`;
      break;
    }

    case 'anual':
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
      break;

    default:
      startDate = `${period}-01`;
      endDate = `${year}-${String(month).padStart(2, '0')}-28`;
  }

  return { startDate, endDate };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    // Validate input
    if (!body.message || !body.period || !body.tipo_periodo) {
      return NextResponse.json(
        { error: 'Missing required fields: message, period, tipo_periodo' },
        { status: 400 }
      );
    }

    // Get period dates
    const { startDate, endDate } = getPeriodDates(body.period, body.tipo_periodo);

    // Calculate KPIs
    const kpisData = await calculateKPIs(startDate, endDate);

    // Build context
    const context: ChatContext = {
      period: body.period,
      tipo_periodo: body.tipo_periodo,
      ...kpisData,
    };

    // Get conversation history (last 5 messages for context)
    let conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];
    try {
      const history = await chatService.getHistory(5);
      conversationHistory = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
    } catch (error) {
      console.warn('Failed to fetch conversation history:', error);
    }

    // Get Claude response
    const response = await claudeClient.chat(body.message, context, conversationHistory);

    // Save user message
    await chatService.insert({
      role: 'user',
      content: body.message,
      context: context as unknown as Record<string, unknown>,
    });

    // Save assistant response
    await chatService.insert({
      role: 'assistant',
      content: response,
      context: context as unknown as Record<string, unknown>,
    });

    return NextResponse.json({
      message: response,
      context,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
