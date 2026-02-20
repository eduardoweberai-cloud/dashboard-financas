'use client';

import { useState, useCallback } from 'react';
import { AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { syncBudgets } from '@/lib/api';
import { addToast } from '@/components/ui/toast';

/**
 * SyncErrorBadge Component
 * Displays a badge warning when sync data is outdated (> 24h)
 * Shows yellow for 24-48h, red for > 48h
 * Clicking the badge attempts to resync
 * Badge disappears when sync is successful
 */
export function SyncErrorBadge() {
  const {
    lastSuccessfulSync,
    hoursSinceSyncSuccess,
    syncStatusColor,
    isOutdated,
  } = useSyncStatus();

  const [isResyncLoading, setIsResyncLoading] = useState(false);

  // Only show if outdated (> 24h) and has a color status
  const shouldShow = isOutdated && syncStatusColor;

  const handleResync = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResyncLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      try {
        await syncBudgets(controller.signal);
        addToast('Sincronização bem-sucedida', 'success');
        // Hook will automatically refetch and update status
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao sincronizar';
      addToast(`Erro ao sincronizar: ${errorMessage}`, 'error');
    } finally {
      setIsResyncLoading(false);
    }
  }, []);

  if (!shouldShow || !lastSuccessfulSync) {
    return null;
  }

  const bgColor =
    syncStatusColor === 'red'
      ? 'bg-red-100 hover:bg-red-200'
      : 'bg-yellow-100 hover:bg-yellow-200';

  const borderColor =
    syncStatusColor === 'red'
      ? 'border-red-300'
      : 'border-yellow-300';

  const iconColor =
    syncStatusColor === 'red'
      ? 'text-red-600'
      : 'text-yellow-600';

  const textColor =
    syncStatusColor === 'red'
      ? 'text-red-700'
      : 'text-yellow-700';

  const lastSyncDate = new Date(lastSuccessfulSync.completed_at || '');
  const formattedDate = lastSyncDate.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const tooltipText = `⚠️ Sincronização desatualizada há ${hoursSinceSyncSuccess}h. Última atualização bem-sucedida: ${formattedDate}`;

  return (
    <button
      onClick={handleResync}
      disabled={isResyncLoading}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-70 disabled:cursor-not-allowed',
        bgColor,
        borderColor
      )}
      title={tooltipText}
      aria-label={`Sincronização desatualizada. Última atualização: ${formattedDate}`}
    >
      {isResyncLoading ? (
        <Loader2 className={cn('h-4 w-4 animate-spin', iconColor)} />
      ) : (
        <>
          <AlertCircle className={cn('h-4 w-4 flex-shrink-0', iconColor)} />
          <span className={cn('text-xs font-semibold whitespace-nowrap', textColor)}>
            ⚠️ Últimos dados: {formattedDate}
          </span>
          <RotateCw className={cn('h-3.5 w-3.5 flex-shrink-0', iconColor)} />
        </>
      )}
    </button>
  );
}
