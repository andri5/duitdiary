/**
 * DuitDiary - UI Store
 * Zustand store for UI state (sidebar, modals, notifications)
 */

import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  notifications: Notification[];
  isLoading: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

let notificationId = 0;

export const useUIStore = create<UIStore>()((set) => ({
  // Initial state
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  notifications: [],
  isLoading: false,

  // Actions
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ isSidebarOpen: open });
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  setMobileMenuOpen: (open: boolean) => {
    set({ isMobileMenuOpen: open });
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${++notificationId}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, newNotification.duration);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
