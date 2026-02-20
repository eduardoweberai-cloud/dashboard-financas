'use client';

import { useState, useEffect, useCallback } from 'react';
import { syncService } from '@/lib/db';
import { calculateHoursSinceSync, getStatusColor } from '@/lib/utils';
import type { SyncLog } from '@/lib/types';

interface UseSyncStatusReturn {
  lastSuccessfulSync: SyncLog | null;
  hoursSinceSyncSuccess: number;
  syncStatusColor: 'yellow' | 'red' | null;
  isOutdated: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const STALE_THRESHOLD_HOURS = 24;

/**
 * Custom hook to monitor sync status with polling
 * Fetches the last successful sync and calculates hours elapsed
 * Polls every 5 minutes to check for updates
 * @returns Object with sync status info
 */
export function useSyncStatus(): UseSyncStatusReturn {
  const [lastSuccessfulSync, setLastSuccessfulSync] = useState<SyncLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSyncStatus = useCallback(async () => {
    try {
      setError(null);
      const sync = await syncService.getLastSuccessfulSync();
      setLastSuccessfulSync(sync);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar status de sincronização');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSyncStatus();
  }, [fetchSyncStatus]);

  // Setup polling
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchSyncStatus();
    }, POLLING_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [fetchSyncStatus]);

  // Calculate derived values
  const hoursSinceSyncSuccess = lastSuccessfulSync?.completed_at
    ? calculateHoursSinceSync(lastSuccessfulSync.completed_at)
    : Infinity;

  const syncStatusColor = getStatusColor(hoursSinceSyncSuccess);
  const isOutdated = hoursSinceSyncSuccess >= STALE_THRESHOLD_HOURS;

  return {
    lastSuccessfulSync,
    hoursSinceSyncSuccess: hoursSinceSyncSuccess === Infinity ? 0 : hoursSinceSyncSuccess,
    syncStatusColor,
    isOutdated,
    isLoading,
    error,
    refetch: fetchSyncStatus,
  };
}
