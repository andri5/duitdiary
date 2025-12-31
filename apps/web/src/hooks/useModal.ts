/**
 * DuitDiary - useModal Hook
 * Custom hook for modal management
 */

import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export const useModal = (initialState: boolean = false, initialData?: any) => {
  const [state, setState] = useState<ModalState>({
    isOpen: initialState,
    data: initialData,
  });

  const open = useCallback((data?: any) => {
    setState({ isOpen: true, data });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, data: undefined });
  }, []);

  const toggle = useCallback((data?: any) => {
    setState((prev) => ({
      isOpen: !prev.isOpen,
      data: data ?? prev.data,
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
    toggle,
  };
};
