/**
 * DuitDiary - Main App Component
 */

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { useAuthStore } from '@/stores';
import { Notifications } from '@/components/ui';
import './index.css';

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
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Notifications />
    </QueryClientProvider>
  );
}

export default App;
