/**
 * DuitDiary - useToast Hook
 * Custom hook for toast notifications
 */

import { useUIStore } from '@/stores';
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  duration?: number;
  type?: ToastType;
}

export const useToast = () => {
  const { addNotification, removeNotification } = useUIStore();
  const [toastIds, setToastIds] = useState<string[]>([]);

  const toast = useCallback(
    (message: string, title?: string, options?: ToastOptions) => {
      const id = Date.now().toString();
      const type = options?.type || 'info';
      const duration = options?.duration || 5000;

      addNotification({
        title: title || (type.charAt(0).toUpperCase() + type.slice(1)),
        message,
        type: type as any,
      });

      setToastIds((prev) => [...prev, id]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
          setToastIds((prev) => prev.filter((tid) => tid !== id));
        }, duration);
      }

      return id;
    },
    [addNotification, removeNotification]
  );

  const success = useCallback(
    (message: string, title = 'Success') =>
      toast(message, title, { type: 'success' }),
    [toast]
  );

  const error = useCallback(
    (message: string, title = 'Error') =>
      toast(message, title, { type: 'error' }),
    [toast]
  );

  const warning = useCallback(
    (message: string, title = 'Warning') =>
      toast(message, title, { type: 'warning' }),
    [toast]
  );

  const info = useCallback(
    (message: string, title = 'Info') =>
      toast(message, title, { type: 'info' }),
    [toast]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    removeToast: removeNotification,
    clearAll: () => {
      toastIds.forEach(removeNotification);
      setToastIds([]);
    },
  };
};
