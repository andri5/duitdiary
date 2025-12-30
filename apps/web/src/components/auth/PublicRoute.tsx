/**
 * DuitDiary - Public Route Component
 * Redirects to dashboard if already authenticated
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/lib/constants';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
