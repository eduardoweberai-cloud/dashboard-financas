'use client';

import { useCallback } from 'react';
import { Loader2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSyncBudgets } from '@/hooks/useSyncBudgets';
import { addToast } from '@/components/ui/toast';

export interface SyncButtonProps {
  onSyncSuccess?: () => void;
}

/**
 * SyncButton Component
 * Displays a button to manually re-sync budgets with Google Sheets
 * Shows loading spinner, toast notifications, and triggers data refetch on success
 */
export function SyncButton({ onSyncSuccess }: SyncButtonProps) {
  const { isLoading, error, sync } = useSyncBudgets();

  const handleClick = useCallback(async () => {
    await sync();

    // Show toast based on result
    if (error) {
      addToast(`Erro ao sincronizar. Verifique se Orçamento2026 está acessível`, 'error');
    } else {
      addToast('Metas atualizadas com sucesso', 'success');
      // Trigger data refetch
      onSyncSuccess?.();
    }
  }, [sync, error, onSyncSuccess]);

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="gap-2"
      aria-label="Sincronizar metas"
      title="Sincronizar metas com Orçamento2026"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Sincronizando...</span>
        </>
      ) : (
        <>
          <RotateCw className="h-4 w-4" />
          <span>Resincronizar</span>
        </>
      )}
    </Button>
  );
}
