'use client';

import { useState, useEffect } from 'react';
import { usePeriod } from '@/hooks/usePeriod';
import { PeriodButtons } from './PeriodButtons';
import { PeriodSelector } from './PeriodSelector';
import { SyncButton } from './SyncButton';
import { Period, PeriodType } from '@/lib/types';

export function DashboardHeader() {
  const { currentPeriod, setPeriod, availablePeriods } = usePeriod();
  const [selectedType, setSelectedType] = useState<PeriodType>(currentPeriod.type);
  const [allPeriods, setAllPeriods] = useState<Period[]>([]);

  // Combina todos os períodos para usar no selector
  useEffect(() => {
    const combined = [
      ...availablePeriods.mensal,
      ...availablePeriods.trimestral,
      ...availablePeriods.semestral,
      ...availablePeriods.anual,
    ];
    setAllPeriods(combined);
  }, [availablePeriods]);

  const handleTypeChange = (type: PeriodType) => {
    setSelectedType(type);

    // Muda para o período do novo tipo
    const periodsOfType =
      type === 'mensal'
        ? availablePeriods.mensal
        : type === 'trimestral'
          ? availablePeriods.trimestral
          : type === 'semestral'
            ? availablePeriods.semestral
            : availablePeriods.anual;

    if (periodsOfType.length > 0) {
      // Se tem um período do novo tipo próximo ao atual, seleciona ele
      const matchingPeriod = periodsOfType.find(
        (p) =>
          p.startDate <= currentPeriod.endDate && p.endDate >= currentPeriod.startDate,
      );
      setPeriod(matchingPeriod || periodsOfType[periodsOfType.length - 1]);
    }
  };

  const handlePeriodChange = (period: Period) => {
    setSelectedType(period.type);
    setPeriod(period);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bem-vindo ao Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Visualize e analise seus dados financeiros em tempo real.
          </p>
        </div>
        <SyncButton />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecione um período:</label>
          <PeriodButtons selectedType={selectedType} onTypeChange={handleTypeChange} />
        </div>

        <PeriodSelector
          periods={allPeriods}
          selectedPeriod={currentPeriod}
          onPeriodChange={handlePeriodChange}
          periodType={selectedType}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Período selecionado: <strong>{currentPeriod.label}</strong> (
        {currentPeriod.startDate} até {currentPeriod.endDate})
      </div>
    </div>
  );
}
