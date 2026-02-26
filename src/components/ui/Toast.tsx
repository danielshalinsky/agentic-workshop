import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Toast as ToastType } from '../../types';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration ?? 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        'px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce-in',
        toast.type === 'success' && 'bg-green-100 text-green-800',
        toast.type === 'info' && 'bg-blue-100 text-blue-800',
        toast.type === 'warning' && 'bg-amber-100 text-amber-800',
      )}
    >
      {toast.message}
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const handler = (e: CustomEvent<ToastType>) => {
      setToasts(prev => [...prev, e.detail]);
    };
    window.addEventListener('toast' as string, handler as EventListener);
    return () => window.removeEventListener('toast' as string, handler as EventListener);
  }, []);

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}

export function showToast(message: string, type: ToastType['type'] = 'info') {
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: { id: crypto.randomUUID(), message, type },
    }),
  );
}
