/**
 * DuitDiary - Settings Page
 */

import { useEffect, useRef, useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Shield,
  Camera,
  Loader2,
  Check,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MainLayout, PageHeader, PageTransition } from '@/components/layout';
import { Button, Card, CardHeader, CardTitle, Badge, UserAvatar, Input } from '@/components/ui';
import { useAuthStore, useUIStore } from '@/stores';
import { ROUTES, THEME_OPTIONS, type AppTheme } from '@/lib/constants';
import { formatDate, cn } from '@/lib/utils';
import { uploadAvatar } from '@/services/upload.service';
import { updateProfile, changePassword } from '@/services/auth.service';

const CURRENCIES = ['IDR', 'USD', 'SGD', 'MYR'] as const;

const themePreview: Record<AppTheme, { from: string; to: string; accent: string }> = {
  neo: { from: '#f3f6f9', to: '#ffffff', accent: '#0f9b8e' },
  midnight: { from: '#0b1118', to: '#151e2a', accent: '#1cc8b4' },
  ocean: { from: '#eef6fa', to: '#ffffff', accent: '#0e7490' },
};

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'IDR');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrency((user.currency || 'IDR').toUpperCase().slice(0, 3));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const handleAvatarChange = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang diizinkan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadAvatar(file);
      setUser({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        avatar: result.user.avatar,
        currency: result.user.currency,
        createdAt: String(result.user.createdAt),
        updatedAt: result.user.updatedAt
          ? String(result.user.updatedAt)
          : undefined,
      });
      toast.success('Foto profil berhasil diperbarui');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal mengunggah foto profil');
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error('Nama minimal 2 karakter');
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        currency: currency.slice(0, 3).toUpperCase(),
      });
      setUser(updated);
      toast.success('Profil diperbarui');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    setSavingPassword(true);
    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
      });
      toast.success(result.message || 'Password berhasil diubah');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <PageTransition>
      <MainLayout>
        <PageHeader
          eyebrow="Akun"
          title="Pengaturan"
          description="Kelola profil dan preferensi aplikasi."
        />

        <Card padding="md" className="mb-5 overflow-hidden">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <UserAvatar
                name={user?.name}
                avatar={user?.avatar}
                size="xl"
                className="shadow-lg shadow-accent/20"
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleAvatarChange(e.target.files?.[0])}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md ring-2 ring-surface transition hover:brightness-95 disabled:opacity-60"
                aria-label="Unggah foto profil"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {user?.name}
              </h2>
              <p className="mt-1 text-muted">{user?.email}</p>
              {user?.createdAt && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
                  <Calendar className="h-4 w-4" />
                  Bergabung sejak {formatDate(user.createdAt)}
                </p>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3"
                leftIcon={<Camera className="h-4 w-4" />}
                isLoading={isUploading}
                onClick={() => fileRef.current?.click()}
              >
                {user?.avatar ? 'Ganti Foto' : 'Unggah Foto'}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Card padding="md">
              <CardHeader>
                <CardTitle>Edit Profil</CardTitle>
              </CardHeader>
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <Input
                  label="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                />
                <div className="flex items-center gap-3 rounded-2xl bg-mist/70 p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted">Email</p>
                    <p className="truncate font-semibold text-ink">{user?.email}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-ink">Mata uang</p>
                  <div className="flex flex-wrap gap-2">
                    {CURRENCIES.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrency(code)}
                        className={cn(
                          'rounded-xl border px-3 py-2 text-sm font-semibold transition',
                          currency === code
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-line text-muted hover:border-accent/40'
                        )}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-mist/70 p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-soft text-lime">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Status Akun</p>
                    <Badge variant="success" size="sm" className="mt-1">
                      Aktif
                    </Badge>
                  </div>
                </div>
                <Button type="submit" variant="gradient" className="w-full" isLoading={savingProfile}>
                  Simpan Profil
                </Button>
              </form>
            </Card>

            <Card padding="md">
              <CardHeader>
                <CardTitle>Ganti Password</CardTitle>
              </CardHeader>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <Input
                  label="Password saat ini"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  autoComplete="current-password"
                />
                <Input
                  label="Password baru"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  autoComplete="new-password"
                />
                <Input
                  label="Konfirmasi password baru"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  isLoading={savingPassword}
                >
                  Ubah Password
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-4">
            <Card padding="md">
              <CardHeader>
                <CardTitle>Tema Aplikasi</CardTitle>
              </CardHeader>
              <p className="mb-3 text-sm text-muted">
                Pilih salah satu dari 3 tema tampilan.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {THEME_OPTIONS.map((option) => {
                  const preview = themePreview[option.id];
                  const selected = theme === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setTheme(option.id);
                        toast.success(`Tema ${option.name} aktif`);
                      }}
                      className={cn(
                        'rounded-2xl border p-3 text-left transition',
                        selected
                          ? 'border-accent ring-2 ring-accent/25'
                          : 'border-line hover:border-accent/40'
                      )}
                    >
                      <div
                        className="mb-2.5 flex h-14 items-end justify-between overflow-hidden rounded-xl px-2.5 pb-2"
                        style={{
                          background: `linear-gradient(145deg, ${preview.from}, ${preview.to})`,
                        }}
                      >
                        <span
                          className="h-6 w-6 rounded-lg shadow-sm"
                          style={{ backgroundColor: preview.accent }}
                        />
                        {selected && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-ink">{option.name}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card padding="md">
              <CardHeader>
                <CardTitle>Tentang Aplikasi</CardTitle>
              </CardHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted">Nama</span>
                  <span className="font-semibold text-ink">DuitDiary</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Versi</span>
                  <span className="font-semibold text-ink">1.0.0</span>
                </div>
              </div>
            </Card>

            <Button
              variant="danger"
              className="w-full"
              leftIcon={<LogOut className="h-4 w-4" />}
              onClick={handleLogout}
            >
              Keluar dari Akun
            </Button>
          </div>
        </div>
      </MainLayout>
    </PageTransition>
  );
}
