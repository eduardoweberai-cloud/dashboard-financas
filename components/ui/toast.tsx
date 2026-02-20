'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Global toast store
let toastId = 0;
const listeners: Set<(toasts: Toast[]) => void> = new Set();
const toasts: Toast[] = [];

export function addToast(message: string, type: ToastType = 'info', duration = 3000): string {
  const id = String(toastId++);
  const toast: Toast = { id, message, type, duration };
  toasts.push(toast);
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
}

export function removeToast(id: string) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    notifyListeners();
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]));
}

function subscribe(listener: (toasts: Toast[]) => void): (() => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Toast Container Component
export function ToastContainer() {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe(setToastList);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toastList.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const bgColor =
    toast.type === 'success'
      ? 'bg-green-500'
      : toast.type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500';

  return (
    <div
      className={cn(
        'rounded-md px-4 py-3 text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200',
        bgColor
      )}
      role="alert"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 rounded hover:bg-white/20 p-1"
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
