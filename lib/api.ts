/**
 * API Helper Functions
 */

export interface SyncBudgetsResponse {
  success: boolean;
  message: string;
  rowsProcessed?: number;
  error?: string;
}

/**
 * Sync budgets with Google Sheets (Orçamento2026)
 * POST /api/sync/budgets
 * @param signal AbortSignal for cancellation
 * @returns Promise with sync result
 */
export async function syncBudgets(signal?: AbortSignal): Promise<SyncBudgetsResponse> {
  const response = await fetch('/api/sync/budgets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
