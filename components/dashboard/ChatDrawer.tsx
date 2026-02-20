/**
 * ChatDrawer Component
 * Modal/drawer containing the chat interface
 */

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  period: string;
  tipo_periodo: string;
}

export function ChatDrawer({ isOpen, onClose, period, tipo_periodo }: ChatDrawerProps) {
  const [isClient, setIsClient] = useState(false);
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    period,
    tipo_periodo,
  });

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Clear messages when drawer is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      clearMessages();
    }
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[360px] max-w-[100vw] h-[480px] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 border-b border-gray-200">
          <DialogTitle>Assistente Financeiro</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatMessages messages={messages} isLoading={isLoading} />

          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
