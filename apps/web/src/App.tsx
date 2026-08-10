/**
 * DuitDiary - Main App Component
 */

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { router } from './router';
import { useAuthStore } from '@/stores';
import { initThemeFromStorage } from '@/stores/ui.store';
import { Notifications } from '@/components/ui';
import './index.css';

// Apply theme as early as possible
initThemeFromStorage();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { initAuth } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    initAuth();
    initThemeFromStorage();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
      <Notifications />
    </QueryClientProvider>
  );
}

export default App;
