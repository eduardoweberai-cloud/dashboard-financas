/**
 * ChatWidgetContainer
 * Wrapper to integrate ChatWidget with PeriodContext
 */

'use client';

import { ChatWidget } from './ChatWidget';
import { usePeriod } from '@/hooks/usePeriod';

export function ChatWidgetContainer() {
  const { currentPeriod } = usePeriod();

  return <ChatWidget period={currentPeriod.value} tipo_periodo={currentPeriod.type} />;
}
