'use client';

import { SyncButton } from './SyncButton';
import { SyncErrorBadge } from './SyncErrorBadge';

export function DashboardHeader() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <SyncErrorBadge />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bem-vindo ao Dashboard Financeiro</h2>
          <p className="text-muted-foreground mt-2">
            Visualize e analise seus dados financeiros em tempo real.
          </p>
        </div>
        <SyncButton />
      </div>
    </div>
  );
}
