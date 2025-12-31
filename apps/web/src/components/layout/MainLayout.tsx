/**
 * DuitDiary - Main Layout Component
 * Modern layout with animated sidebar and smooth transitions
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/stores';
import { ROUTES } from '@/lib/constants';
import { getInitials } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
  { icon: Receipt, label: 'Pengeluaran', path: ROUTES.EXPENSES },
  { icon: FolderOpen, label: 'Kategori', path: ROUTES.CATEGORIES },
  { icon: Settings, label: 'Pengaturan', path: ROUTES.SETTINGS },
];

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, isMobileMenuOpen, toggleSidebar, setMobileMenuOpen } =
    useUIStore();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 hidden h-screen flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 shadow-xl transition-all duration-300 lg:flex',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/30 border border-blue-300/50 backdrop-blur-sm">
              <Wallet className="h-6 w-6" />
            </div>
            <motion.span 
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: isSidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              DuitDiary
            </motion.span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, type: 'spring', damping: 20 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-400/30 text-white shadow-lg backdrop-blur-sm border border-blue-300/50'
                      : 'text-white/70 hover:bg-blue-500/20 hover:text-white',
                    !isSidebarOpen && 'justify-center'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 pb-2">
          <button
            onClick={toggleSidebar}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-white/70 transition-all hover:bg-white/10 hover:text-white',
              !isSidebarOpen && 'justify-center'
            )}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Tutup Menu</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User section */}
        <div className="border-t border-white/20 p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm',
              !isSidebarOpen && 'justify-center p-2'
            )}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
              {user ? getInitials(user.name) : 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-white/60">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              'mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-white/70 transition-all hover:bg-red-500/30 hover:text-white',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="fixed left-0 right-0 top-0 z-30 lg:hidden">
        <header className="flex h-16 items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 shadow-lg">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">DuitDiary</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-b border-gray-200 bg-white/95 backdrop-blur-lg">
            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 pt-16 transition-all duration-300 lg:pt-0',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
