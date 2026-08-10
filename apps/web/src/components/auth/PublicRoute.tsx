/**
 * DuitDiary - Public Route Component
 * Redirects to dashboard if already authenticated
 * (except auth recovery pages that must stay reachable while logged in)
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/lib/constants';
import { Loading } from '@/components/ui';

interface PublicRouteProps {
  children: React.ReactNode;
  /** Allow opening this page even when a session exists */
  allowAuthenticated?: boolean;
}

const AUTH_RECOVERY_PATHS = new Set([
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
]);

export function PublicRoute({ children, allowAuthenticated = false }: PublicRouteProps) {
  const { isAuthenticated, isBootstrapping } = useAuthStore();
  const location = useLocation();

  const isRecovery = allowAuthenticated || AUTH_RECOVERY_PATHS.has(location.pathname);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loading message="Memulihkan sesi..." />
      </div>
    );
  }

  if (isAuthenticated && !isRecovery) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
