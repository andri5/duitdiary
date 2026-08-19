/**
 * DuitDiary - Router Configuration
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/components/auth';
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  DashboardPage,
  ExpensesPage,
  ExpenseFormPage,
  IncomesPage,
  CategoriesPage,
  BudgetPage,
  RecurringPage,
  SavingsPage,
  SettingsPage,
  HelpPage,
  TermsPage,
  PrivacyPage,
  NotFoundPage,
  MaintenancePage,
} from '@/pages';
import { ROUTES } from '@/lib/constants';
import { isMaintenanceMode } from '@/lib/maintenance';

const appRoutes = [
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
  {
    path: ROUTES.TERMS,
    element: <TermsPage />,
  },
  {
    path: ROUTES.PRIVACY,
    element: <PrivacyPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <PublicRoute allowAuthenticated>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <PublicRoute allowAuthenticated>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
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
    path: ROUTES.INCOMES,
    element: (
      <ProtectedRoute>
        <IncomesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.INCOME_NEW,
    element: (
      <ProtectedRoute>
        <ExpenseFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.INCOME_EDIT,
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
    path: ROUTES.BUDGET,
    element: (
      <ProtectedRoute>
        <BudgetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.RECURRING,
    element: (
      <ProtectedRoute>
        <RecurringPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SAVINGS,
    element: (
      <ProtectedRoute>
        <SavingsPage />
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
  {
    path: ROUTES.HELP,
    element: (
      <ProtectedRoute>
        <HelpPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MAINTENANCE,
    element: <MaintenancePage />,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

/** When VITE_MAINTENANCE_MODE=true, every path shows the maintenance page */
const maintenanceRoutes = [
  {
    path: '*',
    element: <MaintenancePage />,
  },
];

export const router = createBrowserRouter(
  isMaintenanceMode ? maintenanceRoutes : appRoutes
);
