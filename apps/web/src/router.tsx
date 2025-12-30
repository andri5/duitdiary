/**
 * DuitDiary - Router Configuration
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/components/auth';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  ExpensesPage,
  ExpenseFormPage,
  CategoriesPage,
  SettingsPage,
} from '@/pages';
import { ROUTES } from '@/lib/constants';

export const router = createBrowserRouter([
  // Public routes (redirect to dashboard if logged in)
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // Protected routes (redirect to login if not logged in)
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.EXPENSES,
    element: (
      <ProtectedRoute>
        <ExpensesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.EXPENSE_NEW,
    element: (
      <ProtectedRoute>
        <ExpenseFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.EXPENSE_EDIT,
    element: (
      <ProtectedRoute>
        <ExpenseFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CATEGORIES,
    element: (
      <ProtectedRoute>
        <CategoriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },

  // Root redirect
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },

  // Catch all - 404
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
