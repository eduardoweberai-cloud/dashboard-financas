'use client';

import { useState, useCallback } from 'react';
import { syncBudgets } from '@/lib/api';

interface UseSyncBudgetsReturn {
  isLoading: boolean;
  error: string | null;
  sync: () => Promise<void>;
}

const SYNC_TIMEOUT = 30000; // 30 seconds

/**
 * Custom hook for syncing budgets with timeout handling
 * @returns Object with isLoading, error, and sync function
 */
export function useSyncBudgets(): UseSyncBudgetsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SYNC_TIMEOUT);

      try {
        await syncBudgets(controller.signal);
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Timeout ao sincronizar. Verifique a conexão e tente novamente.');
        } else {
          setError(err.message || 'Erro ao sincronizar. Verifique se Orçamento2026 está acessível');
        }
      } else {
        setError('Erro ao sincronizar. Verifique se Orçamento2026 está acessível');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, sync };
}
