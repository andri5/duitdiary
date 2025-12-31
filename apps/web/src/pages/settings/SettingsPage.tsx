/**
 * DuitDiary - Settings Page
 * Modern profile & settings design
 */

import { User, Mail, Calendar, LogOut, Shield, Bell, Palette, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout, PageTransition } from '@/components/layout';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/lib/constants';
import { formatDate, getInitials } from '@/lib/utils';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <PageTransition>
      <MainLayout>
      {/* Hero Header with Avatar */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 p-6 text-white shadow-xl sm:p-8 border border-blue-700/50">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          {/* Large Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-3xl font-bold shadow-lg ring-4 ring-white/20 sm:h-24 sm:w-24">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{user?.name}</h1>
            <p className="mt-1 text-white/70">{user?.email}</p>
            {user?.createdAt && (
              <p className="mt-2 flex items-center justify-center gap-1 text-sm text-white/50 sm:justify-start">
                <Calendar className="h-4 w-4" />
                Bergabung sejak {formatDate(user.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Section */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Informasi Profil</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
                  <Mail className="h-5 w-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
                  <Shield className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Status Akun</p>
                  <p className="font-medium text-gray-900">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Aktif
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="space-y-4">
          {/* Preferences */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Preferensi</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tema Aplikasi</p>
                    <p className="text-sm text-gray-500">Light Mode</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifikasi</p>
                    <p className="text-sm text-gray-500">Aktif</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Tentang Aplikasi</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between rounded-lg px-2 py-1">
                  <span className="text-gray-500">Nama Aplikasi</span>
                  <span className="font-semibold text-gray-900">DuitDiary</span>
                </div>
                <div className="flex justify-between rounded-lg px-2 py-1">
                  <span className="text-gray-500">Versi</span>
                  <span className="font-semibold text-gray-900">1.0.0</span>
                </div>
                <div className="flex justify-between rounded-lg px-2 py-1">
                  <span className="text-gray-500">Build</span>
                  <span className="font-semibold text-gray-900">2024.12.29</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-red-50 p-4 font-semibold text-red-600 transition-all hover:border-red-200 hover:bg-red-100"
          >
            <LogOut className="h-5 w-5" />
            Keluar dari Akun
          </button>
        </div>
      </div>
      </MainLayout>
    </PageTransition>
  );
}
