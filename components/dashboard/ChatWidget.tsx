/**
 * ChatWidget Component
 * Floating button in bottom-right corner that opens chat drawer
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ChatDrawer } from './ChatDrawer';

interface ChatWidgetProps {
  period: string;
  tipo_periodo: string;
}

export function ChatWidget({ period, tipo_periodo }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg z-40"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat drawer modal */}
      <ChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} period={period} tipo_periodo={tipo_periodo} />
    </>
  );
}
