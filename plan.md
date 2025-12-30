# 📒 DuitDiary - Aplikasi Catat Harian Pengeluaran

## 📋 Deskripsi Proyek
**DuitDiary** adalah aplikasi pencatatan pengeluaran harian yang dapat diakses melalui Web dan Mobile Apps. Membantu pengguna mencatat, mengkategorikan, dan menganalisis pengeluaran mereka secara efektif.

> 💡 *"DuitDiary - Diary Keuanganmu Setiap Hari"*

---

## 🎨 UPDATE DESIGN SYSTEM - 30 DESEMBER 2025

### ✅ Phase 1: Color Palette Update - COMPLETED

**Warna yang dipilih:** Deep Blue (Professional & Modern)

#### Global Color Variables
| Variabel | Warna Lama | Warna Baru | Hex Code | Penggunaan |
|----------|-----------|-----------|----------|------------|
| Background | #EFF6FF (Biru Muda) | #F8FAFC (Abu-abu Biru) | `#F8FAFC` | Background page |
| Primary | #3B82F6 (Biru Cerah) | #1E3A8A (Biru Navy) | `#1E3A8A` | Button, links, interactive |
| Primary Dark | #2563EB (Biru Tua) | #0F172A (Biru Sangat Gelap) | `#0F172A` | Hover states, gradients |
| Secondary | #10B981 (Hijau) | #06B6D4 (Cyan) | `#06B6D4` | Secondary actions, accents |
| Danger | #EF4444 (Merah) | #DC2626 (Merah Terang) | `#DC2626` | Error, negative actions |
| Warning | #F59E0B (Oranye) | #FBBF24 (Emas) | `#FBBF24` | Warnings, cautions |

#### File Diubah:
- ✅ `apps/web/src/index.css` - Global CSS variables
- ✅ `apps/web/src/components/layout/AuthLayout.tsx` - Auth gradient background & logo styling
- ✅ `apps/web/src/components/layout/MainLayout.tsx` - Sidebar gradient & navigation
- ✅ `apps/web/src/components/ui/Button.tsx` - Button variants dengan deep blue
- ✅ `apps/web/src/components/ui/Input.tsx` - Input glass variant colors
- ✅ `apps/web/src/pages/auth/LoginPage.tsx` - Error message styling
- ✅ `apps/web/src/pages/auth/RegisterPage.tsx` - Error message styling
- ✅ `apps/web/src/pages/dashboard/DashboardPage.tsx` - Hero header, stats colors, chart gradient
- ✅ `apps/web/src/pages/expenses/ExpensesPage.tsx` - Hero header & empty state
- ✅ `apps/web/src/pages/categories/CategoriesPage.tsx` - Hero header & empty state
- ✅ `apps/web/src/pages/settings/SettingsPage.tsx` - Hero header & avatar gradient

#### Component Colors Redesign:

**Button Variants:**
- Primary: `bg-blue-600` → `bg-blue-600` (consistent)
- Secondary: `bg-gray-100` → `bg-cyan-500`
- Gradient: `from-indigo-500 via-purple-500 to-pink-500` → `from-blue-600 via-blue-700 to-cyan-600`
- Glass: `border-white/30 bg-white/20` → `border-blue-400/50 bg-blue-500/20`

**Gradients:**
- Auth Layout: `from-indigo-600 via-purple-600 to-pink-500` → `from-blue-900 via-blue-800 to-slate-900`
- Sidebar: `from-indigo-600 via-purple-600 to-pink-500` → `from-blue-900 via-blue-800 to-slate-900`
- Dashboard Hero: `from-indigo-600 via-purple-600 to-pink-500` → `from-blue-900 via-blue-800 to-slate-900`
- Expenses Hero: `from-rose-500 via-pink-500 to-purple-500` → `from-red-600 via-red-700 to-blue-900`
- Categories Hero: `from-violet-500 via-purple-500 to-indigo-500` → `from-blue-900 via-blue-800 to-slate-900`

**Stats Card Icons:**
- Danger (Red): `from-rose-500 to-pink-500` → `from-red-500 to-red-600`
- Primary (Blue): `from-blue-500 to-indigo-500` → `from-blue-600 to-blue-700`
- Positive (Green): `from-emerald-500 to-teal-500` → `from-cyan-500 to-cyan-600`
- Warning (Amber): `from-violet-500 to-purple-500` → `from-amber-500 to-amber-600`

#### Testing Status:
- ✅ Frontend dev server running with hot-reload
- ✅ All colors updated and visible on pages
- ⏳ API backend running & ready for integration testing
- ⏳ Manual testing of all pages dengan deep blue theme

---

## �️ REKOMENDASI NAMA APLIKASI

> **⚠️ Status: Menunggu Pemilihan Nama**
> Pilih salah satu nama di bawah ini sebelum memulai development.

### 🌟 Kategori 1: Nama Indonesia Modern (Catchy & Trendy)

| No | Nama | Arti/Konsep | Kelebihan |
|----|------|-------------|-----------|
| 1 | **Catatku** | "Catatan + ku" | Simple, personal, mudah diingat |
| 2 | **Dompetku** | Dompet digital pribadi | Familiar, langsung paham fungsinya |
| 3 | **Uangku** | Pencatatan uang pribadi | Direct, jelas tujuannya |
| 4 | **Sakuku** | Dari kata "saku" (pocket) | Cute, friendly, mudah diucapkan |
| 5 | **Kelola** | Kelola keuangan | Profesional, clean |

### 💡 Kategori 2: Nama Kreatif & Unik

| No | Nama | Arti/Konsep | Kelebihan |
|----|------|-------------|-----------|
| 6 | **Cuan.id** | "Cuan" = untung/uang (slang) | Modern, Gen-Z friendly, memorable |
| 7 | **Rekapp** | "Rekap" + "App" | Unik, menggambarkan fungsi rekap |
| 8 | **Kasbon** | Buku kas + bon | Familiar bagi orang Indonesia |
| 9 | **Celengan** | Celengan digital | Nostalgic, friendly, visual |
| 10 | **Simponi** | "Simpan" + "Uang" | Elegan, musikal, berbeda |

### 🎯 Kategori 3: Nama Gabungan Kreatif

| No | Nama | Arti/Konsep | Kelebihan |
|----|------|-------------|-----------|
| 11 | **CatatCuan** | Catat + Cuan | Langsung jelas, catchy |
| 12 | **DuitDiary** | Diary pengeluaran | Personal, daily journaling vibe |
| 13 | **RupiahTrack** | Tracking rupiah | Profesional, clear purpose |
| 14 | **BukuKas** | Buku kas digital | Tradisional tapi digital |
| 15 | **PennyWise** | Bijak dalam pengeluaran | International feel, wise spending |

### 🚀 Kategori 4: Nama Singkat & Memorable

| No | Nama | Arti/Konsep | Kelebihan |
|----|------|-------------|-----------|
| 16 | **Nota** | Catatan/nota belanja | Super simple, 4 huruf |
| 17 | **Koin** | Mata uang kecil | Minimalist, easy to remember |
| 18 | **Tally** | Menghitung/mencatat | International, professional |
| 19 | **Spendo** | "Spend" + "o" | Playful, modern |
| 20 | **Flexy** | Flexible budgeting | Dynamic, modern feel |

### ✨ Kategori 5: Nama Premium & Profesional

| No | Nama | Arti/Konsep | Kelebihan |
|----|------|-------------|-----------|
| 21 | **Finora** | "Finance" + "Ora" (sekarang) | Elegant, premium feel |
| 22 | **Monevy** | "Money" + "Easy" | International, friendly |
| 23 | **Budgetary** | Budget management | Professional, serious |
| 24 | **Expenza** | "Expense" + "a" | Modern, startup vibe |
| 25 | **WalletWise** | Smart wallet | Clear meaning, trustworthy |

---

### 🏆 TOP 5 REKOMENDASI (Personal Pick)

| Rank | Nama | Alasan |
|------|------|--------|
| 🥇 | **Cuan.id** | Modern, Gen-Z friendly, memorable, bagus untuk branding |
| 🥈 | **Sakuku** | Cute, personal, mudah diucapkan, cocok untuk semua umur |
| 🥉 | **Duitdiary** | Personal touch, daily journaling vibe, unique |
| 4 | **Rekapp** | Unik, menggambarkan fungsi, mudah diingat |
| 5 | **Finora** | Premium, elegant, cocok jika target market profesional |

---

### 📝 Kriteria Pemilihan Nama:

Pertimbangkan hal berikut saat memilih:

1. **Target Audience**
   - Anak muda (Gen-Z): Cuan.id, Spendo, Sakuku
   - Semua umur: Dompetku, BukuKas, Kelola
   - Profesional: Finora, Expenza, WalletWise

2. **Branding & Domain**
   - Cek ketersediaan domain (.com, .id, .app)
   - Cek ketersediaan di Play Store & App Store
   - Cek akun social media

3. **Mudah Diingat**
   - Maksimal 2-3 suku kata
   - Mudah dieja dan diucapkan
   - Tidak mirip dengan aplikasi lain

4. **Skalabilitas**
   - Apakah nama bisa berkembang jika ada fitur baru?
   - Apakah cocok untuk ekspansi internasional?

---

### ✅ PILIHAN NAMA APLIKASI

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   NAMA TERPILIH: DuitDiary ✅                              │
│                                                             │
│   Tagline: "Diary Keuanganmu Setiap Hari"                  │
│                                                             │
│   Status: ✅ CONFIRMED - Siap untuk development!           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Nama Dipilih: DuitDiary** 🎉

---

## �🎯 Fitur Utama

---

## 🚀 PRIORITAS FITUR (Feature Breakdown)

### Legenda Prioritas:
| Label | Keterangan | Timeline |
|-------|------------|----------|
| 🔴 **P0 - Critical** | WAJIB ada untuk MVP, app tidak bisa jalan tanpa ini | Sprint 1-2 |
| 🟠 **P1 - High** | Penting untuk user experience yang baik | Sprint 3-4 |
| 🟡 **P2 - Medium** | Nice-to-have, meningkatkan value app | Sprint 5-6 |
| 🟢 **P3 - Low** | Future enhancement, bisa ditunda | Post-Launch |

---

## 📦 MVP (Minimum Viable Product) - Release 1.0

### 🔴 P0 - CRITICAL (Wajib untuk Launch)

#### 1. Autentikasi Dasar
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Register | Daftar dengan email & password | Web + Mobile | 4 jam |
| Login | Masuk ke aplikasi | Web + Mobile | 3 jam |
| Logout | Keluar dari aplikasi | Web + Mobile | 1 jam |
| Session Management | JWT token handling | Backend | 4 jam |

**Total Estimasi: 12 jam (1.5 hari)**

#### 2. Pencatatan Pengeluaran (CRUD)
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Tambah Pengeluaran | Input jumlah, kategori, catatan, tanggal | Web + Mobile | 6 jam |
| Lihat Daftar Pengeluaran | List semua pengeluaran dengan pagination | Web + Mobile | 4 jam |
| Edit Pengeluaran | Ubah data pengeluaran yang sudah ada | Web + Mobile | 3 jam |
| Hapus Pengeluaran | Hapus pengeluaran (soft delete) | Web + Mobile | 2 jam |
| Filter Dasar | Filter by tanggal (hari ini, minggu ini, bulan ini) | Web + Mobile | 3 jam |

**Total Estimasi: 18 jam (2.5 hari)**

#### 3. Kategori Default
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Kategori Preset | 8-10 kategori default (Makanan, Transport, dll) | Backend + Seeder | 2 jam |
| Pilih Kategori | Dropdown/picker saat input pengeluaran | Web + Mobile | 2 jam |
| Icon Kategori | Icon visual untuk setiap kategori | Web + Mobile | 2 jam |

**Total Estimasi: 6 jam (1 hari)**

#### 4. Dashboard Sederhana
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Total Hari Ini | Tampilkan total pengeluaran hari ini | Web + Mobile | 2 jam |
| Total Bulan Ini | Tampilkan total pengeluaran bulan ini | Web + Mobile | 2 jam |
| List Transaksi Terakhir | 5-10 transaksi terbaru | Web + Mobile | 2 jam |

**Total Estimasi: 6 jam (1 hari)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    MVP SCOPE (P0)                               │
├─────────────────────────────────────────────────────────────────┤
│  ✅ Register/Login/Logout                                       │
│  ✅ CRUD Pengeluaran (Tambah, Lihat, Edit, Hapus)              │
│  ✅ Kategori Default dengan Icon                                │
│  ✅ Dashboard (Total Hari Ini, Bulan Ini, Transaksi Terakhir)  │
│  ✅ Filter Dasar (by Tanggal)                                   │
├─────────────────────────────────────────────────────────────────┤
│  📅 Estimasi: 42 jam kerja (~6 hari)                           │
│  🎯 Target: Minggu ke-2                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🟠 P1 - HIGH PRIORITY (Release 1.1)

#### 5. Profil Pengguna
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Edit Profil | Ubah nama, foto profil | Web + Mobile | 4 jam |
| Pilih Mata Uang | Setting mata uang (IDR, USD, dll) | Web + Mobile | 2 jam |
| Ganti Password | Ubah password dari dalam app | Web + Mobile | 3 jam |

**Total Estimasi: 9 jam**

#### 6. Kategori Kustom
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Tambah Kategori | User buat kategori sendiri | Web + Mobile | 3 jam |
| Edit Kategori | Ubah nama, warna, icon | Web + Mobile | 2 jam |
| Hapus Kategori | Hapus kategori (dengan konfirmasi) | Web + Mobile | 2 jam |
| Pilih Warna | Color picker untuk kategori | Web + Mobile | 2 jam |

**Total Estimasi: 9 jam**

#### 7. Laporan & Grafik
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Pie Chart Kategori | Distribusi pengeluaran per kategori | Web + Mobile | 4 jam |
| Bar Chart Harian | Pengeluaran per hari dalam sebulan | Web + Mobile | 4 jam |
| Ringkasan Mingguan | Summary pengeluaran mingguan | Web + Mobile | 3 jam |
| Ringkasan Bulanan | Summary pengeluaran bulanan | Web + Mobile | 3 jam |

**Total Estimasi: 14 jam**

#### 8. Filter & Search Lanjutan
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Filter by Kategori | Filter transaksi per kategori | Web + Mobile | 2 jam |
| Filter by Range Tanggal | Custom date range picker | Web + Mobile | 3 jam |
| Search by Catatan | Cari transaksi berdasarkan catatan | Web + Mobile | 2 jam |
| Sort (Terbaru/Terbesar) | Urutkan transaksi | Web + Mobile | 2 jam |

**Total Estimasi: 9 jam**

```
┌─────────────────────────────────────────────────────────────────┐
│                    P1 SCOPE                                     │
├─────────────────────────────────────────────────────────────────┤
│  📝 Profil Pengguna (Edit, Mata Uang, Ganti Password)          │
│  🏷️ Kategori Kustom (CRUD + Warna)                             │
│  📊 Grafik (Pie Chart, Bar Chart)                              │
│  📈 Laporan Mingguan & Bulanan                                  │
│  🔍 Filter & Search Lanjutan                                    │
├─────────────────────────────────────────────────────────────────┤
│  📅 Estimasi: 41 jam kerja (~5 hari)                           │
│  🎯 Target: Minggu ke-4                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🟡 P2 - MEDIUM PRIORITY (Release 1.2)

#### 9. Budget Management
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Set Budget Bulanan | Input target budget per bulan | Web + Mobile | 4 jam |
| Set Budget per Kategori | Limit spending per kategori | Web + Mobile | 4 jam |
| Progress Bar Budget | Visual sisa budget | Web + Mobile | 3 jam |
| Alert Mendekati Limit | Warning saat 80% budget terpakai | Web + Mobile | 3 jam |

**Total Estimasi: 14 jam**

#### 10. Upload Foto Struk
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Upload Gambar | Attach foto ke transaksi | Web + Mobile | 5 jam |
| View Gambar | Lihat foto struk yang diupload | Web + Mobile | 2 jam |
| Compress Image | Optimasi ukuran file | Backend | 3 jam |

**Total Estimasi: 10 jam**

#### 11. Export Data
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Export ke Excel | Download .xlsx | Web | 4 jam |
| Export ke PDF | Download report PDF | Web | 5 jam |
| Share Report | Share via email/link | Web + Mobile | 3 jam |

**Total Estimasi: 12 jam**

#### 12. Reset Password
| Fitur | Deskripsi | Platform | Estimasi |
|-------|-----------|----------|----------|
| Forgot Password | Request reset via email | Web + Mobile | 4 jam |
| Email Verification | Kirim email reset link | Backend | 3 jam |
| Reset Form | Form input password baru | Web + Mobile | 2 jam |

**Total Estimasi: 9 jam**

```
┌─────────────────────────────────────────────────────────────────┐
│                    P2 SCOPE                                     │
├─────────────────────────────────────────────────────────────────┤
│  💰 Budget Management (Set, Track, Alert)                      │
│  📸 Upload Foto Struk                                           │
│  📤 Export (Excel, PDF)                                         │
│  🔐 Reset Password via Email                                    │
├─────────────────────────────────────────────────────────────────┤
│  📅 Estimasi: 45 jam kerja (~6 hari)                           │
│  🎯 Target: Minggu ke-7                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🟢 P3 - LOW PRIORITY (Future Release)

#### 13. Pengeluaran Berulang (Recurring)
| Fitur | Deskripsi | Estimasi |
|-------|-----------|----------|
| Set Recurring | Pengeluaran otomatis (harian/mingguan/bulanan) | 6 jam |
| Manage Recurring | Edit/Stop recurring | 3 jam |
| Auto Create | Sistem otomatis buat transaksi | 4 jam |

#### 14. Notifikasi & Reminder
| Fitur | Deskripsi | Estimasi |
|-------|-----------|----------|
| Push Notification | Notif budget limit (Mobile) | 5 jam |
| Daily Reminder | Pengingat catat pengeluaran | 3 jam |
| Email Summary | Laporan mingguan via email | 4 jam |

#### 15. Offline Mode (Mobile)
| Fitur | Deskripsi | Estimasi |
|-------|-----------|----------|
| Local Storage | Simpan data offline | 6 jam |
| Sync Queue | Queue transaksi saat offline | 5 jam |
| Conflict Resolution | Handle data conflict | 4 jam |

#### 16. Multi-Device Sync
| Fitur | Deskripsi | Estimasi |
|-------|-----------|----------|
| Real-time Sync | Sync antar device | 8 jam |
| Cloud Backup | Backup otomatis ke cloud | 5 jam |

#### 17. Dark Mode
| Fitur | Deskripsi | Estimasi |
|-------|-----------|----------|
| Theme Toggle | Switch light/dark mode | 4 jam |
| System Preference | Ikuti setting sistem | 2 jam |

```
┌─────────────────────────────────────────────────────────────────┐
│                    P3 SCOPE (Future)                            │
├─────────────────────────────────────────────────────────────────┤
│  🔄 Pengeluaran Berulang (Recurring)                           │
│  🔔 Push Notification & Reminder                                │
│  📴 Offline Mode dengan Sync                                    │
│  ☁️ Multi-Device Sync & Cloud Backup                           │
│  🌙 Dark Mode                                                   │
├─────────────────────────────────────────────────────────────────┤
│  📅 Estimasi: 59 jam kerja (~8 hari)                           │
│  🎯 Target: Post-Launch (v2.0)                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 RINGKASAN PRIORITAS

| Priority | Fitur Count | Estimasi Jam | Estimasi Hari | Target Release |
|----------|-------------|--------------|---------------|----------------|
| 🔴 P0 (MVP) | 4 modul | 42 jam | 6 hari | Week 2 |
| 🟠 P1 (High) | 4 modul | 41 jam | 5 hari | Week 4 |
| 🟡 P2 (Medium) | 4 modul | 45 jam | 6 hari | Week 7 |
| 🟢 P3 (Future) | 5 modul | 59 jam | 8 hari | v2.0 |
| **TOTAL** | **17 modul** | **187 jam** | **~25 hari** | - |

---

## 🎯 ROADMAP VISUAL

```
Week 1-2: MVP (P0)
├── ✅ Setup Project & Database
├── ✅ Auth (Register/Login/Logout)
├── ✅ CRUD Pengeluaran
├── ✅ Kategori Default
└── ✅ Dashboard Sederhana
     │
     ▼
Week 3-4: Enhancement (P1)
├── 📝 Profil Pengguna
├── 🏷️ Kategori Kustom
├── 📊 Grafik & Chart
└── 🔍 Filter Lanjutan
     │
     ▼
Week 5-7: Advanced (P2)
├── 💰 Budget Management
├── 📸 Upload Foto
├── 📤 Export Data
└── 🔐 Reset Password
     │
     ▼
Post-Launch: Future (P3)
├── 🔄 Recurring Expense
├── 🔔 Notifications
├── 📴 Offline Mode
└── 🌙 Dark Mode
```

---

## 🔌 API SPECIFICATION

### Base URL
```
Development: http://localhost:3000/api/v1
Production:  https://api.duitdiary.com/v1
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": [ ... ]
  }
}
```

---

### 🔐 1. Authentication API

| Method | Endpoint | Deskripsi | Auth | Priority |
|--------|----------|-----------|------|----------|
| POST | `/auth/register` | Registrasi user baru | ❌ | P0 |
| POST | `/auth/login` | Login user | ❌ | P0 |
| POST | `/auth/logout` | Logout user | ✅ | P0 |
| POST | `/auth/refresh-token` | Refresh JWT token | ✅ | P0 |
| POST | `/auth/forgot-password` | Request reset password | ❌ | P2 |
| POST | `/auth/reset-password` | Reset password dengan token | ❌ | P2 |
| POST | `/auth/verify-email` | Verifikasi email | ❌ | P2 |

#### Request & Response Details:

**POST /auth/register**
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response 201
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-12-29T00:00:00Z"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**POST /auth/login**
```json
// Request Body
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### 👤 2. User API

| Method | Endpoint | Deskripsi | Auth | Priority |
|--------|----------|-----------|------|----------|
| GET | `/users/profile` | Get current user profile | ✅ | P1 |
| PUT | `/users/profile` | Update user profile | ✅ | P1 |
| PUT | `/users/password` | Change password | ✅ | P1 |
| POST | `/users/avatar` | Upload avatar | ✅ | P1 |
| DELETE | `/users/avatar` | Delete avatar | ✅ | P1 |
| GET | `/users/settings` | Get user settings | ✅ | P1 |
| PUT | `/users/settings` | Update user settings | ✅ | P1 |

#### Request & Response Details:

**GET /users/profile**
```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://storage.../avatar.jpg",
    "currency": "IDR",
    "createdAt": "2024-12-29T00:00:00Z"
  }
}
```

**PUT /users/profile**
```json
// Request Body
{
  "name": "John Updated",
  "currency": "IDR"
}

// Response 200
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

### 💰 3. Expense API (Pengeluaran)

| Method | Endpoint | Deskripsi | Auth | Priority |
|--------|----------|-----------|------|----------|
| GET | `/expenses` | Get all expenses (paginated) | ✅ | P0 |
| GET | `/expenses/:id` | Get expense by ID | ✅ | P0 |
| POST | `/expenses` | Create new expense | ✅ | P0 |
| PUT | `/expenses/:id` | Update expense | ✅ | P0 |
| DELETE | `/expenses/:id` | Delete expense (soft delete) | ✅ | P0 |
| POST | `/expenses/:id/receipt` | Upload receipt image | ✅ | P2 |
| DELETE | `/expenses/:id/receipt` | Delete receipt image | ✅ | P2 |

#### Query Parameters for GET /expenses:
| Parameter | Type | Default | Deskripsi |
|-----------|------|---------|-----------|
| page | number | 1 | Nomor halaman |
| limit | number | 10 | Jumlah per halaman |
| startDate | string | - | Filter tanggal mulai (YYYY-MM-DD) |
| endDate | string | - | Filter tanggal akhir (YYYY-MM-DD) |
| categoryId | string | - | Filter by kategori |
| search | string | - | Search by catatan |
| sortBy | string | createdAt | Field untuk sorting |
| sortOrder | string | desc | asc / desc |

#### Request & Response Details:

**POST /expenses**
```json
// Request Body
{
  "amount": 50000,
  "categoryId": "uuid-category",
  "note": "Makan siang di restoran",
  "date": "2024-12-29",
  "receiptUrl": null
}

// Response 201
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": "uuid",
    "amount": 50000,
    "category": {
      "id": "uuid-category",
      "name": "Makanan",
      "icon": "🍔",
      "color": "#FF5733"
    },
    "note": "Makan siang di restoran",
    "date": "2024-12-29",
    "receiptUrl": null,
    "createdAt": "2024-12-29T12:00:00Z"
  }
}
```

**GET /expenses**
```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 50000,
      "category": {
        "id": "uuid",
        "name": "Makanan",
        "icon": "🍔",
        "color": "#FF5733"
      },
      "note": "Makan siang",
      "date": "2024-12-29",
      "receiptUrl": null,
      "createdAt": "2024-12-29T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

---

### 🏷️ 4. Category API

| Method | Endpoint | Deskripsi | Auth | Priority |
|--------|----------|-----------|------|----------|
| GET | `/categories` | Get all categories | ✅ | P0 |
| GET | `/categories/:id` | Get category by ID | ✅ | P0 |
| POST | `/categories` | Create custom category | ✅ | P1 |
| PUT | `/categories/:id` | Update category | ✅ | P1 |
| DELETE | `/categories/:id` | Delete category | ✅ | P1 |

#### Request & Response Details:

**GET /categories**
```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Makanan",
      "icon": "🍔",
      "color": "#FF5733",
      "isDefault": true,
      "expenseCount": 45
    },
    {
      "id": "uuid",
      "name": "Transportasi",
      "icon": "🚗",
      "color": "#3498DB",
      "isDefault": true,
      "expenseCount": 20
    }
  ]
}
```

**POST /categories**
```json
// Request Body
{
  "name": "Hobi",
  "icon": "🎮",
  "color": "#9B59B6"
}

// Response 201
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Hobi",
    "icon": "🎮",
    "color": "#9B59B6",
    "isDefault": false,
    "expenseCount": 0
  }
}
```

#### Default Categories (Seeder):
| Icon | Nama | Color |
|------|------|-------|
| 🍔 | Makanan | #FF5733 |
| 🚗 | Transportasi | #3498DB |
| 🛒 | Belanja | #2ECC71 |
| 💡 | Tagihan | #F39C12 |
| 🏥 | Kesehatan | #E74C3C |
| 🎬 | Hiburan | #9B59B6 |
| 📚 | Pendidikan | #1ABC9C |
| 👕 | Pakaian | #E91E63 |
| 🏠 | Rumah Tangga | #795548 |
| 💼 | Lainnya | #607D8B |

---

### 📊 5. Dashboard & Report API

| Method | Endpoint | Deskripsi | Auth | Priority |
|--------|----------|-----------|------|----------|
| GET | `/dashboard/summary` | Get dashboard summary | ✅ | P0 |
| GET | `/reports/by-category` | Get expense by category | ✅ | P1 |
| GET | `/reports/by-date` | Get expense by date range | ✅ | P1 |
| GET | `/reports/trends` | Get expense trends | ✅ | P1 |
| GET | `/reports/export` | Export report (PDF/Excel) | ✅ | P2 |

#### Request & Response Details:

**GET /dashboard/summary**
```json
// Query: ?period=month (day/week/month/year)

// Response 200
{
  "success": true,
  "data": {
    "today": {
      "total": 150000,
      "count": 5
    },
    "thisWeek": {
      "total": 750000,
      "count": 25
    },
    "thisMonth": {
      "total": 3500000,
      "count": 120
    },
    "recentExpenses": [
      {
        "id": "uuid",
        "amount": 50000,
        "category": { "name": "Makanan", "icon": "🍔" },
        "note": "Makan siang",
        "date": "2024-12-29"
      }
    ],
    "topCategories": [
      {
        "category": { "name": "Makanan", "icon": "🍔" },
        "total": 1500000,
        "percentage": 42.8
      }
    ]
  }
}
```

**GET /reports/by-category**
```json
// Query: ?startDate=2024-12-01&endDate=2024-12-31

// Response 200
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-12-01",
      "endDate": "2024-12-31"
    },
    "totalExpense": 3500000,
    "categories": [
      {
        "category": {
          "id": "uuid",
          "name": "Makanan",
          "icon": "🍔",
          "color": "#FF5733"
        },
        "total": 1500000,
        "count": 45,
        "percentage": 42.8
      }
    ]
  }
}
```

**GET /reports/by-date**
```json
// Query: ?startDate=2024-12-01&endDate=2024-12-31&groupBy=day

// Response 200
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-12-01",
      "endDate": "2024-12-31"
    },
    "totalExpense": 3500000,
    "expenses": [
      {
        "date": "2024-12-29",
        "total": 150000,
        "count": 5
      },
      {
        "date": "2024-12-28",
        "total": 200000,
        "count": 8
      }
    ]
  }
}
```

---

### 💵 6. Budget API

| Method | Endpoint | Deskripsi | Auth | Priority |
|--------|----------|-----------|------|----------|
| GET | `/budgets` | Get all budgets | ✅ | P2 |
| GET | `/budgets/current` | Get current month budget | ✅ | P2 |
| POST | `/budgets` | Create/Update budget | ✅ | P2 |
| PUT | `/budgets/:id` | Update budget | ✅ | P2 |
| DELETE | `/budgets/:id` | Delete budget | ✅ | P2 |
| GET | `/budgets/status` | Get budget status & alerts | ✅ | P2 |

#### Request & Response Details:

**POST /budgets**
```json
// Request Body
{
  "month": "2024-12",
  "totalBudget": 5000000,
  "categoryBudgets": [
    {
      "categoryId": "uuid",
      "amount": 1500000
    },
    {
      "categoryId": "uuid",
      "amount": 500000
    }
  ]
}

// Response 201
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "id": "uuid",
    "month": "2024-12",
    "totalBudget": 5000000,
    "totalSpent": 0,
    "remaining": 5000000,
    "percentage": 0,
    "categoryBudgets": [ ... ]
  }
}
```

**GET /budgets/status**
```json
// Response 200
{
  "success": true,
  "data": {
    "month": "2024-12",
    "totalBudget": 5000000,
    "totalSpent": 3500000,
    "remaining": 1500000,
    "percentage": 70,
    "status": "warning", // normal, warning, exceeded
    "alerts": [
      {
        "type": "category_warning",
        "message": "Kategori Makanan sudah mencapai 85% budget",
        "category": "Makanan"
      }
    ],
    "categoryStatus": [
      {
        "category": { "name": "Makanan", "icon": "🍔" },
        "budget": 1500000,
        "spent": 1275000,
        "remaining": 225000,
        "percentage": 85,
        "status": "warning"
      }
    ]
  }
}
```

---

### 🔄 7. Recurring Expense API (P3 - Future)

| Method | Endpoint | Deskripsi | Auth | Priority |
|--------|----------|-----------|------|----------|
| GET | `/recurring` | Get all recurring expenses | ✅ | P3 |
| POST | `/recurring` | Create recurring expense | ✅ | P3 |
| PUT | `/recurring/:id` | Update recurring expense | ✅ | P3 |
| DELETE | `/recurring/:id` | Delete recurring expense | ✅ | P3 |
| POST | `/recurring/:id/pause` | Pause recurring | ✅ | P3 |
| POST | `/recurring/:id/resume` | Resume recurring | ✅ | P3 |

---

## 🗄️ DATABASE SCHEMA

### Entity Relationship Diagram (ERD)
```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Users     │       │   Expenses   │       │  Categories  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │    ┌──│ id (PK)      │
│ name         │  │    │ userId (FK)  │────┘  │ userId (FK)  │──┐
│ email        │  └───>│ categoryId(FK│───────│ name         │  │
│ password     │       │ amount       │       │ icon         │  │
│ avatar       │       │ note         │       │ color        │  │
│ currency     │       │ date         │       │ isDefault    │  │
│ createdAt    │       │ receiptUrl   │       │ createdAt    │  │
│ updatedAt    │       │ createdAt    │       │ updatedAt    │  │
└──────────────┘       │ updatedAt    │       └──────────────┘  │
       │               │ deletedAt    │              │          │
       │               └──────────────┘              │          │
       │                                             │          │
       │               ┌──────────────┐              │          │
       │               │   Budgets    │              │          │
       │               ├──────────────┤              │          │
       │               │ id (PK)      │              │          │
       └──────────────>│ userId (FK)  │              │          │
                       │ month        │              │          │
                       │ totalBudget  │              │          │
                       │ createdAt    │              │          │
                       │ updatedAt    │              │          │
                       └──────────────┘              │          │
                              │                      │          │
                              ▼                      │          │
                       ┌──────────────┐              │          │
                       │CategoryBudget│              │          │
                       ├──────────────┤              │          │
                       │ id (PK)      │              │          │
                       │ budgetId(FK) │              │          │
                       │ categoryId(FK│──────────────┘          │
                       │ amount       │                         │
                       └──────────────┘                         │
                                                                │
                       ┌──────────────┐                         │
                       │  Recurring   │                         │
                       ├──────────────┤                         │
                       │ id (PK)      │                         │
                       │ userId (FK)  │<────────────────────────┘
                       │ categoryId(FK│
                       │ amount       │
                       │ note         │
                       │ frequency    │
                       │ nextDate     │
                       │ isActive     │
                       │ createdAt    │
                       └──────────────┘
```

### Tables Definition

**Users Table**
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password      VARCHAR(255) NOT NULL,
  avatar        VARCHAR(500),
  currency      VARCHAR(3) DEFAULT 'IDR',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Categories Table**
```sql
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id),
  name          VARCHAR(50) NOT NULL,
  icon          VARCHAR(10) NOT NULL,
  color         VARCHAR(7) NOT NULL,
  is_default    BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Expenses Table**
```sql
CREATE TABLE expenses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) NOT NULL,
  category_id   UUID REFERENCES categories(id) NOT NULL,
  amount        DECIMAL(15,2) NOT NULL,
  note          TEXT,
  date          DATE NOT NULL,
  receipt_url   VARCHAR(500),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP -- Soft delete
);

CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
```

**Budgets Table**
```sql
CREATE TABLE budgets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) NOT NULL,
  month         VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  total_budget  DECIMAL(15,2) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month)
);
```

**Category Budgets Table**
```sql
CREATE TABLE category_budgets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id     UUID REFERENCES budgets(id) NOT NULL,
  category_id   UUID REFERENCES categories(id) NOT NULL,
  amount        DECIMAL(15,2) NOT NULL,
  UNIQUE(budget_id, category_id)
);
```

---

## ⚡ QUICK START RECOMMENDATION

**Untuk memulai development, fokus pada P0 (MVP) dengan urutan:**

1. **Backend First:**
   - Setup database schema
   - Auth API (register, login, logout)
   - Expense CRUD API
   - Category API

2. **Web Frontend:**
   - Auth pages
   - Dashboard
   - Expense form & list

3. **Mobile (Parallel jika ada 2 developer):**
   - Sama dengan web

---

## ✅ CHECKLIST KONFIRMASI PRIORITAS

- [ ] Setuju dengan pembagian P0/P1/P2/P3?
- [ ] Ada fitur yang perlu dipindah prioritasnya?
- [ ] Ada fitur tambahan yang perlu dimasukkan?
- [ ] Setuju mulai dengan MVP (P0)?
- [ ] Setuju dengan API specification di atas?
- [ ] Setuju dengan database schema?

---

## 🛠️ Tech Stack

### Frontend - Web
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| React.js | 18.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling |
| Vite | 5.x | Build Tool |
| React Query | 5.x | Data Fetching & Caching |
| React Router | 6.x | Routing |
| Chart.js / Recharts | - | Visualisasi Data |
| Zustand | 4.x | State Management |
| React Hook Form | 7.x | Form Handling |
| Zod | 3.x | Validation |

### Frontend - Mobile
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| React Native | 0.73.x | Cross-platform Mobile |
| Expo | 50.x | Development Platform |
| TypeScript | 5.x | Type Safety |
| React Navigation | 6.x | Routing |
| React Native Paper | 5.x | UI Components |
| AsyncStorage | - | Local Storage |
| React Query | 5.x | Data Fetching |

### Backend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Node.js | 20.x LTS | Runtime |
| Express.js / Fastify | - | API Framework |
| TypeScript | 5.x | Type Safety |
| Prisma | 5.x | ORM |
| PostgreSQL | 16.x | Database |
| Redis | 7.x | Caching & Session |
| JWT | - | Authentication |
| Multer | - | File Upload |
| Zod | 3.x | Validation |

### Infrastructure & DevOps
| Teknologi | Keterangan |
|-----------|------------|
| Docker | Containerization |
| GitHub Actions | CI/CD |
| Vercel | Web Hosting |
| Railway / Supabase | Backend Hosting |
| AWS S3 / Cloudinary | File Storage |
| Sentry | Error Monitoring |

---

## 🧪 Testing Plan

### 1. Unit Testing
| Area | Tools | Target Coverage |
|------|-------|-----------------|
| Backend API | Jest, Supertest | 80% |
| Frontend Components | Vitest, React Testing Library | 75% |
| Mobile Components | Jest, React Native Testing Library | 70% |
| Utility Functions | Jest/Vitest | 90% |

### 2. Integration Testing
| Area | Tools | Fokus |
|------|-------|-------|
| API Endpoints | Supertest, Postman | CRUD Operations, Auth Flow |
| Database | Prisma Test, Docker | Data Integrity |
| Frontend + API | MSW (Mock Service Worker) | Data Flow |

### 3. End-to-End Testing
| Platform | Tools | Scope |
|----------|-------|-------|
| Web | Playwright / Cypress | User Journey Lengkap |
| Mobile | Detox / Maestro | Critical Flows |

### 4. Performance Testing
| Tools | Fokus |
|-------|-------|
| Lighthouse | Web Performance, SEO, Accessibility |
| k6 / Artillery | API Load Testing |
| React DevTools | Component Re-renders |

### 5. Security Testing
| Area | Pendekatan |
|------|------------|
| Authentication | Token handling, session management |
| Authorization | Role-based access control |
| Input Validation | SQL Injection, XSS Prevention |
| API Security | Rate limiting, CORS |

### Test Automation Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                          │
├─────────────────────────────────────────────────────────────┤
│                        E2E Tests                            │
│                    ┌─────────────┐                          │
│                   /               \          10%            │
│                  /   Playwright    \                        │
│                 /     Detox         \                       │
│                ─────────────────────                        │
│              /   Integration Tests   \       20%            │
│             /   Supertest, MSW        \                     │
│            ───────────────────────────                      │
│          /       Unit Tests            \     70%            │
│         /   Jest, Vitest, RTL           \                   │
│        ─────────────────────────────────                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Development Progress Tracker

### 📅 Development Log

| Tanggal | Aktivitas | Status |
|---------|-----------|--------|
| 29 Dec 2024 | Setup project structure (monorepo) | ✅ Done |
| 29 Dec 2024 | Initialize backend (Express + TypeScript + Prisma) | ✅ Done |
| 29 Dec 2024 | Database schema design (Users, Categories, Expenses, Budgets) | ✅ Done |
| 29 Dec 2024 | Implement Auth API (Register, Login, Logout, Refresh Token) | ✅ Done |
| 29 Dec 2024 | Implement Category API (CRUD + Default Seeder) | ✅ Done |
| 29 Dec 2024 | Implement Expense API (CRUD + Filter + Pagination) | ✅ Done |
| 29 Dec 2024 | Implement Dashboard API (Summary) | ✅ Done |
| 29 Dec 2024 | PostgreSQL 18.1 installed | ✅ Done |
| 29 Dec 2024 | Database duitdiary created & seeded | ✅ Done |
| 29 Dec 2024 | **API Testing Complete** | ✅ Done |
| 29 Dec 2024 | **Code Refactoring & Documentation** | ✅ Done |
| 29 Dec 2024 | **Web Frontend: Setup Vite + React + TailwindCSS** | ✅ Done |
| 29 Dec 2024 | **Web Frontend: All Pages Complete (Login, Register, Dashboard, Expenses, Categories, Settings)** | ✅ Done |
| 29 Dec 2024 | **Mobile App: Setup Expo + React Native + TypeScript** | ✅ Done |
| 29 Dec 2024 | **Mobile App: Theme System (Eye-catching Colors, Gradients)** | ✅ Done |
| 29 Dec 2024 | **Mobile App: UI Components (Button, Input, Card, Header, etc.)** | ✅ Done |
| 29 Dec 2024 | **Mobile App: Auth Screens (Welcome, Login, Register)** | ✅ Done |
| 29 Dec 2024 | **Mobile App: Main Screens (Home, Expenses, Categories, Profile)** | ✅ Done |
| 29 Dec 2024 | **Mobile App: Navigation Setup (Auth Stack, Main Tabs)** | ✅ Done |

---

### 🔧 Code Refactoring (29 Dec 2024)

#### Changes Made:

1. **Added `src/constants/index.ts`**
   - Centralized HTTP status codes
   - Standardized error codes (AUTH_, USER_, CATEGORY_, EXPENSE_, BUDGET_)
   - Success messages for consistent API responses
   - Default values (CURRENCY, PAGE_SIZE, etc.)

2. **Added `src/errors/index.ts`**
   - Custom error classes (AppError, BadRequestError, NotFoundError, etc.)
   - Proper error inheritance for stack traces
   - Structured error handling with codes

3. **Updated Core Files with Documentation:**
   - `src/config/index.ts` - Added JSDoc comments for all config values
   - `src/utils/prisma.ts` - Added singleton pattern documentation
   - `src/utils/jwt.ts` - Added function documentation for token utilities
   - `src/utils/response.ts` - Added JSDoc for response helpers
   - `src/utils/validation.ts` - Added module header documentation
   - `src/types/index.ts` - Organized with section comments
   - `src/index.ts` - Added structured comments for middleware/routes

4. **Documentation Files:**
   - `README.md` - Complete rewrite with:
     - Tech stack table
     - Step-by-step installation guide
     - Project structure diagram
     - Architecture overview (ASCII art)
     - Full API documentation with examples
     - Database schema ERD
     - Environment variables guide
     - Development guidelines
     - Troubleshooting section
   - `CONTRIBUTING.md` - New file with:
     - Development setup guide
     - Architecture patterns explanation
     - Coding standards & conventions
     - Git workflow guidelines
     - Pull request templates
     - Code review process

#### Code Structure (Final):

```
apps/api/src/
├── config/           # ✅ Documented
│   └── index.ts
├── constants/        # ✅ NEW - Error codes, messages, defaults
│   └── index.ts
├── controllers/      # ✅ Existing
│   ├── auth.controller.ts
│   ├── category.controller.ts
│   ├── dashboard.controller.ts
│   ├── expense.controller.ts
│   └── index.ts
├── errors/           # ✅ NEW - Custom error classes
│   └── index.ts
├── middlewares/      # ✅ Existing
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validate.middleware.ts
│   └── index.ts
├── routes/           # ✅ Existing
│   ├── auth.routes.ts
│   ├── category.routes.ts
│   ├── dashboard.routes.ts
│   ├── expense.routes.ts
│   └── index.ts
├── services/         # ✅ Existing
│   ├── auth.service.ts
│   ├── category.service.ts
│   ├── dashboard.service.ts
│   ├── expense.service.ts
│   └── index.ts
├── types/            # ✅ Documented
│   └── index.ts
├── utils/            # ✅ Documented
│   ├── index.ts
│   ├── jwt.ts
│   ├── prisma.ts
│   ├── response.ts
│   └── validation.ts
└── index.ts          # ✅ Documented
```

---

### 🧪 API Testing Results (29 Dec 2024)

| # | Endpoint | Method | Status | Details |
|---|----------|--------|--------|---------|
| 1 | `/api/v1/health` | GET | ✅ PASSED | Server running, returns timestamp |
| 2 | `/api/v1/auth/register` | POST | ✅ PASSED | User created, tokens returned |
| 3 | `/api/v1/auth/login` | POST | ✅ PASSED | Login successful, JWT tokens work |
| 4 | `/api/v1/categories` | GET | ✅ PASSED | 10 default categories returned |
| 5 | `/api/v1/expenses` | POST | ✅ PASSED | Expense created (50000 Makanan) |
| 6 | `/api/v1/expenses` | GET | ✅ PASSED | Expenses list with pagination meta |
| 7 | `/api/v1/dashboard/summary` | GET | ✅ PASSED | Today/Week/Month stats, top categories |

**Test Summary:** 7/7 endpoints passed ✅

---

### Phase 1: Foundation (Week 1-2)
```
████████████████████████████████████████ 100% Complete
```
| Task | Status | Target |
|------|--------|--------|
| Setup monorepo structure | ✅ Done | Week 1 |
| Setup backend project | ✅ Done | Week 1 |
| Database schema design | ✅ Done | Week 1 |
| PostgreSQL installation | ✅ Done | Week 1 |
| Database setup & seeding | ✅ Done | Week 1 |

> **Note:** Setup web/mobile project dipindahkan ke Phase masing-masing.
> CI/CD & Testing Framework akan di-setup di Phase 6.

### Phase 2: Core Backend (Week 3-4)
```
████████████████████████████████████████ 100% Complete
```
| Task | Status | Target |
|------|--------|--------|
| Authentication API | ✅ Done | Week 3 |
| User management API | ✅ Done | Week 3 |
| Expense CRUD API | ✅ Done | Week 3-4 |
| Category management API | ✅ Done | Week 4 |
| Dashboard API | ✅ Done | Week 4 |
| **API Testing** | ✅ Done | Week 4 |
| **Code Refactoring** | ✅ Done | Week 4 |
| **Documentation (README, CONTRIBUTING)** | ✅ Done | Week 4 |
| File upload service | ⬜ Pending | Week 4 |
| Unit tests backend | ⬜ Pending | Week 4 |

### Phase 3: Web Frontend (Week 5-7)
```
████████████████████████████████████████ 100% Complete
```
| Task | Status | Target |
|------|--------|--------|
| **Setup Vite + React + TypeScript** | ✅ Done | Week 5 |
| **Setup TailwindCSS** | ✅ Done | Week 5 |
| **Project Structure (components, pages, hooks, stores)** | ✅ Done | Week 5 |
| **API Services Layer** | ✅ Done | Week 5 |
| **Zustand State Management** | ✅ Done | Week 5 |
| **UI Components (Button, Input, Card, Modal, etc.)** | ✅ Done | Week 5 |
| Auth pages (Login, Register) | ✅ Done | Week 5 |
| Dashboard layout with charts | ✅ Done | Week 5 |
| Expense CRUD (add, list, edit, delete, filter) | ✅ Done | Week 5-6 |
| Category management UI (CRUD) | ✅ Done | Week 6 |
| Settings page | ✅ Done | Week 6 |
| Responsive design | ✅ Done | Week 6 |
| TypeScript build passing | ✅ Done | Week 6 |

### Phase 4: Mobile App (Week 8-10)
```
████████████████████████████████████████ 100% Complete
```
| Task | Status | Target |
|------|--------|--------|
| **Setup Expo + React Native + TypeScript** | ✅ Done | Week 8 |
| **Install Dependencies (Navigation, Query, Forms, Charts)** | ✅ Done | Week 8 |
| **Theme System (Colors, Typography, Spacing)** | ✅ Done | Week 8 |
| **TypeScript Types & Interfaces** | ✅ Done | Week 8 |
| **API Services Layer** | ✅ Done | Week 8 |
| **Zustand State Management (Auth, UI)** | ✅ Done | Week 8 |
| **UI Components (Button, Input, Card, Header, etc.)** | ✅ Done | Week 8 |
| Navigation setup (Auth Stack, Main Tabs, Expense Stack) | ✅ Done | Week 8 |
| Auth screens (Welcome, Login, Register) | ✅ Done | Week 8 |
| Home & Dashboard (Summary Cards, Charts, Recent Expenses) | ✅ Done | Week 8-9 |
| Add/Edit expense (Form, Category Picker, Quick Amounts) | ✅ Done | Week 9 |
| Expenses list with filter | ✅ Done | Week 9 |
| Category management (CRUD, Color/Icon Picker) | ✅ Done | Week 9 |
| Profile screen with settings | ✅ Done | Week 9 |
| Toast notifications | ✅ Done | Week 9 |
| Offline mode | ⬜ Pending (P3) | Week 10 |
| Push notifications | ⬜ Pending (P3) | Week 10 |

### Phase 5: Advanced Features (Week 11-12)
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% Complete
```
| Task | Status | Target |
|------|--------|--------|
| Budget management | ⬜ Pending | Week 11 |
| Recurring expenses | ⬜ Pending | Week 11 |
| Export reports (PDF/Excel) | ⬜ Pending | Week 11 |
| Notification system | ⬜ Pending | Week 12 |
| Data sync optimization | ⬜ Pending | Week 12 |

### Phase 6: Testing & Deployment (Week 13-14)
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% Complete
```
| Task | Status | Target |
|------|--------|--------|
| E2E testing web | ⬜ Pending | Week 13 |
| E2E testing mobile | ⬜ Pending | Week 13 |
| Performance optimization | ⬜ Pending | Week 13 |
| Security audit | ⬜ Pending | Week 14 |
| Production deployment | ⬜ Pending | Week 14 |
| Documentation | ⬜ Pending | Week 14 |

---

## 📈 Overall Progress
```
Phase 1: Foundation      ████████████████████ 100%
Phase 2: Core Backend    ████████████████████ 100%
Phase 3: Web Frontend    ████████████████████ 100%
Phase 4: Mobile App      ████████████████████ 100%
Phase 5: Advanced        ░░░░░░░░░░░░░░░░░░░░ 0%
Phase 6: Testing/Deploy  ░░░░░░░░░░░░░░░░░░░░ 0%
─────────────────────────────────────────────
TOTAL PROGRESS           ██████████████░░░░░░ 66%
```

### 📱 Mobile App Structure (Completed)

```
apps/mobile/src/
├── components/ui/         # UI Components
│   ├── Button.tsx         # Gradient buttons
│   ├── Input.tsx          # Floating label inputs
│   ├── Card.tsx           # Cards & Summary cards
│   ├── Header.tsx         # Gradient headers
│   ├── ExpenseItem.tsx    # Expense list items
│   ├── CategoryItem.tsx   # Category list/chips/grid items
│   ├── EmptyState.tsx     # Empty state with icon
│   ├── Loading.tsx        # Loading indicator
│   └── Toast.tsx          # Toast notifications
├── constants/             # App constants (API, Storage keys, Icons)
├── lib/                   # API client & utilities
│   ├── api.ts             # Axios instance with interceptors
│   └── utils.ts           # Helper functions
├── navigation/            # React Navigation
│   ├── AuthNavigator.tsx  # Welcome/Login/Register stack
│   ├── MainTabNavigator.tsx # Bottom tabs with gradient icons
│   ├── ExpenseStackNavigator.tsx # Expenses list & add/edit
│   └── RootNavigator.tsx  # Auth state based navigation
├── screens/
│   ├── auth/              # Auth screens
│   │   ├── WelcomeScreen.tsx  # Onboarding with features
│   │   ├── LoginScreen.tsx    # Login form with social buttons
│   │   └── RegisterScreen.tsx # Registration form
│   └── main/              # Main app screens
│       ├── HomeScreen.tsx     # Dashboard with charts
│       ├── ExpensesScreen.tsx # Expense list with filter
│       ├── AddExpenseScreen.tsx # Add/edit expense form
│       ├── CategoriesScreen.tsx # Category CRUD
│       └── ProfileScreen.tsx  # User profile & settings
├── stores/                # Zustand state management
│   ├── authStore.ts       # Auth state (login, logout, user)
│   └── uiStore.ts         # UI state (theme, toasts, loading)
├── theme/                 # Design system
│   ├── colors.ts          # Eye-catching color palette with gradients
│   ├── typography.ts      # Font families, sizes, weights
│   ├── spacing.ts         # Spacing scale, border radius, shadows
│   └── index.ts           # Theme exports
└── types/                 # TypeScript types
    └── index.ts           # All interfaces & types
```

### 🎨 Mobile UI Highlights (Eye-Catching & User-Friendly)

| Feature | Implementation |
|---------|----------------|
| **Gradient Backgrounds** | Primary (Indigo→Violet), Secondary (Teal→Cyan), Accent (Orange→Coral) |
| **Colored Shadows** | Soft shadows with color tints for depth |
| **Animated Inputs** | Floating labels with smooth transitions |
| **Gradient Buttons** | Modern CTA buttons with shadows |
| **Colorful Categories** | 10 vibrant colors with icon picker |
| **Pie Charts** | Expense visualization by category |
| **Custom Tab Bar** | Bottom nav with gradient active icons |
| **Toast Notifications** | Animated success/error/info toasts |
| **Quick Amount Buttons** | +10K, +20K, +50K, etc. for fast input |
| **Category Grid Picker** | Visual category selection with checkmarks |

### 🎯 Next Steps: Advanced Features & Testing

---

## 📁 Struktur Folder (Proposed)

```
catatharian/
├── apps/
│   ├── web/                 # React Web App
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   └── utils/
│   │   └── tests/
│   │
│   ├── mobile/              # React Native App
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── navigation/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── tests/
│   │
│   └── api/                 # Backend API
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── middlewares/
│       │   └── utils/
│       ├── prisma/
│       └── tests/
│
├── packages/
│   └── shared/              # Shared types, utils, constants
│
├── docs/                    # Documentation
├── .github/                 # GitHub Actions
├── docker-compose.yml
└── README.md
```

---

## ✅ Checklist Sebelum Mulai Coding

- [ ] Review dan konfirmasi fitur
- [ ] Review dan konfirmasi tech stack
- [ ] Konfirmasi timeline development
- [ ] Setup repository
- [ ] Setup development environment
- [ ] Finalisasi database schema

---

## 📝 Catatan

- Timeline di atas adalah estimasi dan dapat disesuaikan
- Prioritas fitur dapat diubah sesuai kebutuhan
- Rekomendasi: Mulai dengan MVP (Minimum Viable Product) terlebih dahulu

---

## 🎨 PHASE 7: UI REDESIGN & IMPROVEMENT

> **Status:** 🔄 Planning Phase  
> **Started:** 29 Desember 2024  
> **Approach:** Preview-First (Redesign Login Page sebagai sample sebelum lanjut ke halaman lain)

### 📋 Overview

Berdasarkan review UI saat ini, berikut adalah rencana redesign untuk membuat tampilan lebih modern, menarik, dan konsisten.

---

### 🔍 Analisis Masalah UI Saat Ini

| Area | Masalah | Prioritas |
|------|---------|-----------|
| Background | Solid color polos, kurang menarik | High |
| Card | Basic white card, tanpa efek | High |
| Input Fields | Plain input tanpa icon/label | Medium |
| Buttons | Solid color tanpa animasi | Medium |
| Typography | Kurang hierarki visual | Medium |
| Ilustrasi | Tidak ada ilustrasi/graphics | Low |
| Spacing | Inkonsisten | Medium |
| Responsivitas | Perlu dicek | Medium |

---

### 🎯 Target Design System

#### 1. Color Palette
```
Primary:     #6366F1 (Indigo) → #8B5CF6 (Violet) - Gradient
Secondary:   #10B981 (Emerald)
Background:  #F8FAFC (Slate-50)
Card:        rgba(255,255,255,0.8) + backdrop-blur
Text:        #1E293B (Slate-800)
Muted:       #64748B (Slate-500)
```

#### 2. Design Patterns
- **Glassmorphism**: Frosted glass effect pada cards
- **Gradient Backgrounds**: Smooth gradients untuk visual appeal
- **Floating Labels**: Animated input labels
- **Micro-interactions**: Subtle hover/focus animations
- **8px Grid System**: Konsisten spacing

#### 3. Typography Scale
```
Heading 1:   text-3xl (30px) font-bold
Heading 2:   text-2xl (24px) font-semibold  
Heading 3:   text-xl (20px) font-semibold
Body:        text-base (16px) font-normal
Caption:     text-sm (14px) font-normal
```

---

### 📄 Pages Redesign Checklist

#### 🔐 Phase 7.1: Login Page (SAMPLE)
> *Halaman pertama yang akan diredesign sebagai sample*

| No | Task | Status | Details |
|----|------|--------|---------|
| 1 | Gradient Background | ✅ Done | Purple-Blue gradient dengan animated shapes |
| 2 | Glass Card Effect | ✅ Done | Backdrop blur + semi-transparent |
| 3 | Icon Input Fields | ✅ Done | Mail icon, Lock icon dengan glass variant |
| 4 | Gradient Button | ✅ Done | Hover animation + loading state |
| 5 | App Logo/Branding | ✅ Done | DuitDiary logo dengan tagline |
| 6 | Ilustrasi/Graphic | ⏳ Pending | Finance-related illustration |
| 7 | Remember Me Toggle | ✅ Done | Custom styled checkbox |
| 8 | Link Styling | ✅ Done | Forgot password, Register links |
| 9 | Form Validation UI | ✅ Done | Error states dengan glass style |
| 10 | Loading Animation | ✅ Done | Button loading spinner |
| 11 | Responsive Design | ✅ Done | Mobile/Tablet/Desktop optimized |

**Login Page Progress: 10/11 (91%)**

---

#### 📝 Phase 7.2: Register Page
| No | Task | Status | Details |
|----|------|--------|---------|
| 1 | Mirror Login Design | ✅ Done | Konsisten dengan login |
| 2 | Password Strength | ✅ Done | Visual indicator 5-level |
| 3 | Terms Checkbox | ✅ Done | Custom styled dengan links |
| 4 | Responsive Design | ✅ Done | Mobile/Tablet/Desktop optimized |

**Register Page Progress: 4/4 (100%)**

---

#### 📊 Phase 7.3: Dashboard Page
| No | Task | Status | Details |
|----|------|--------|---------|
| 1 | Header Redesign | ✅ Done | Gradient hero header dengan greeting, date, CTA |
| 2 | Summary Cards | ✅ Done | Modern cards dengan gradient accents, hover effects |
| 3 | Expense Chart | ✅ Done | Donut chart dengan modern styling |
| 4 | Recent List | ✅ Done | Card-based dengan hover effects |
| 5 | Navigation | ✅ Done | Gradient sidebar, mobile bottom menu |
| 6 | Period Selector | ✅ Done | Gradient pills dengan shadow |
| 7 | Responsive | ✅ Done | Mobile/Tablet/Desktop optimized |

**Dashboard Page Progress: 7/7 (100%)**

---

#### 💰 Phase 7.4: Expenses Page
| No | Task | Status | Details |
|----|------|--------|---------|
| 1 | Hero Header | ✅ Done | Gradient rose-pink header |
| 2 | Search Bar | ✅ Done | Modern rounded search input |
| 3 | Filter Bar | ✅ Done | Collapsible filters with active indicator |
| 4 | Expense Cards | ✅ Done | Hover effects, action buttons on hover |
| 5 | Pagination | ✅ Done | Responsive pagination |
| 6 | Empty State | ✅ Done | Illustrated empty state |
| 7 | Responsive | ✅ Done | Mobile/Tablet/Desktop |

**Expenses Page Progress: 7/7 (100%)**

---

#### 📁 Phase 7.5: Categories Page  
| No | Task | Status | Details |
|----|------|--------|---------|
| 1 | Hero Header | ✅ Done | Gradient violet-purple header |
| 2 | Category Cards | ✅ Done | Color accent, hover scale, action buttons |
| 3 | Grid Layout | ✅ Done | Responsive 2-3-4 column grid |
| 4 | Add Card Button | ✅ Done | Dashed border add new card |
| 5 | Empty State | ✅ Done | Illustrated empty state |
| 6 | Responsive | ✅ Done | Mobile/Tablet/Desktop |

**Categories Page Progress: 6/6 (100%)**

---

#### 👤 Phase 7.6: Profile Page
| No | Task | Status | Details |
|----|------|--------|---------|
| 1 | Hero Avatar | ✅ Done | Large gradient avatar with user info |
| 2 | Profile Cards | ✅ Done | Info cards dengan colored icons |
| 3 | Preferences Menu | ✅ Done | Theme, notifications settings |
| 4 | App Info | ✅ Done | Version, build info |
| 5 | Logout Button | ✅ Done | Styled danger button |
| 6 | Responsive | ✅ Done | 2-column layout on desktop |

**Profile Page Progress: 6/6 (100%)**

---

### 🧩 Shared Components to Create

| Component | Description | Priority |
|-----------|-------------|----------|
| `GlassCard` | Reusable glass effect card | High |
| `GradientButton` | Button dengan gradient & animation | High |
| `IconInput` | Input dengan icon & floating label | High |
| `LoadingSpinner` | Custom loading animation | Medium |
| `Toast` | Notification toast | Medium |
| `Modal` | Redesigned modal component | Medium |
| `EmptyState` | Placeholder when no data | Low |
| `Avatar` | User avatar component | Low |

---

### 📱 Responsive Breakpoints

```
Mobile:    < 640px   (sm)
Tablet:    640-1024px (md)
Desktop:   > 1024px   (lg)
```

---

### 📐 RESPONSIVE DESIGN SPECIFICATION

> **Prioritas:** HIGH - Wajib support semua ukuran layar

#### 🎯 Target Devices

| Device | Screen Size | Breakpoint | Priority |
|--------|-------------|------------|----------|
| iPhone SE | 375 x 667 | Mobile (sm) | High |
| iPhone 14 | 390 x 844 | Mobile (sm) | High |
| iPhone 14 Pro Max | 430 x 932 | Mobile (sm) | High |
| Samsung Galaxy S21 | 360 x 800 | Mobile (sm) | High |
| iPad Mini | 768 x 1024 | Tablet (md) | Medium |
| iPad Pro 11" | 834 x 1194 | Tablet (md) | Medium |
| iPad Pro 12.9" | 1024 x 1366 | Tablet (md) | Medium |
| Laptop | 1366 x 768 | Desktop (lg) | High |
| Desktop HD | 1920 x 1080 | Desktop (lg) | High |
| Desktop 2K | 2560 x 1440 | Desktop (xl) | Low |

---

#### 📏 TailwindCSS Breakpoints Used

```css
/* Default: Mobile First */
sm:   640px   /* Small devices (landscape phones) */
md:   768px   /* Medium devices (tablets) */
lg:   1024px  /* Large devices (laptops) */
xl:   1280px  /* Extra large devices (desktops) */
2xl:  1536px  /* 2K monitors and above */
```

---

#### 🔐 Login/Register Page - Responsive Specs

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|-------------------|
| **Layout** | Full width card, centered | Centered card 80% width | Centered card max-w-md |
| **Card Width** | `w-full px-4` | `w-[80%] max-w-lg` | `max-w-md` |
| **Card Padding** | `p-6` | `p-8` | `p-10` |
| **Logo Size** | `h-12 w-12` | `h-14 w-14` | `h-16 w-16` |
| **Title** | `text-xl` | `text-2xl` | `text-3xl` |
| **Input Height** | `h-11` | `h-12` | `h-12` |
| **Button Height** | `h-11` | `h-12` | `h-12` |
| **Font Size** | `text-sm` | `text-base` | `text-base` |
| **Spacing** | `space-y-4` | `space-y-5` | `space-y-6` |

**Mobile Mock-up:**
```
┌────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                    │
│   🪙 DuitDiary     │
│                    │
│ ┌────────────────┐ │
│ │ 📧 Email       │ │
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │ 🔒 Password    │ │
│ └────────────────┘ │
│                    │
│ [═══ SIGN IN ═══] │
│                    │
│ Don't have account?│
└────────────────────┘
```

---

#### 📊 Dashboard Page - Responsive Specs

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|-------------------|
| **Layout** | Single column | 2 columns | Sidebar + Content |
| **Navigation** | Bottom Tab Bar | Side Rail | Full Sidebar |
| **Summary Cards** | 1 per row, stack | 2 per row | 3-4 per row |
| **Chart** | Full width, 200px height | Full width, 280px | 60% width, 320px |
| **Recent List** | Full width | 2 columns | Right sidebar 40% |
| **Card Padding** | `p-4` | `p-5` | `p-6` |
| **Header Height** | `h-14` | `h-16` | `h-16` |

**Mobile Dashboard Layout:**
```
┌────────────────────┐
│ Hello, John ▼   🔔 │ ← Header
├────────────────────┤
│ ┌────────────────┐ │
│ │ Total: Rp 1.2M │ │ ← Summary Card
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │ Today: Rp 50K  │ │
│ └────────────────┘ │
├────────────────────┤
│   [Chart Area]     │ ← Full Width
│                    │
├────────────────────┤
│ Recent Expenses    │
│ ├─ Makan Rp 25K    │
│ ├─ Transport Rp 15K│
│ └─ Coffee Rp 10K   │
├────────────────────┤
│ 🏠  📊  ➕  📁  👤 │ ← Bottom Nav
└────────────────────┘
```

**Desktop Dashboard Layout:**
```
┌──────────────────────────────────────────────────────┐
│  🪙 DuitDiary    🔍 Search...         🔔  👤 John   │
├─────────┬────────────────────────────────────────────┤
│         │  Welcome back, John! 👋                    │
│  🏠 Home│                                            │
│  📊 Stats│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  📁 Cat │ │Total │ │Today │ │Week  │ │Month │      │
│  💰 Exp │ │1.2M  │ │50K   │ │350K  │ │1.2M  │      │
│  👤 Prof│ └──────┘ └──────┘ └──────┘ └──────┘      │
│         │                                            │
│         │ ┌─────────────────┐ ┌──────────────────┐  │
│         │ │                 │ │ Recent Expenses  │  │
│         │ │   PIE CHART     │ │ ├─ Makan   25K   │  │
│         │ │                 │ │ ├─ Trans   15K   │  │
│         │ │                 │ │ └─ Coffee  10K   │  │
│         │ └─────────────────┘ └──────────────────┘  │
└─────────┴────────────────────────────────────────────┘
```

---

#### 💰 Expenses Page - Responsive Specs

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|-------------------|
| **Layout** | List view | Grid 2 columns | Grid 3 columns |
| **Filter Bar** | Horizontal scroll chips | Wrap, 2 rows max | Single row |
| **FAB Position** | Bottom right `bottom-20` | Bottom right `bottom-8` | Top right in header |
| **Card Layout** | Full width | Card grid | Card grid |
| **Modal Width** | Full screen | `max-w-lg` centered | `max-w-lg` centered |
| **Date Picker** | Native mobile | Custom calendar | Custom calendar |

---

#### 📁 Categories Page - Responsive Specs

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|-------------------|
| **Grid Columns** | 2 columns | 3 columns | 4 columns |
| **Card Size** | `h-24` | `h-28` | `h-32` |
| **Icon Size** | `text-2xl` | `text-3xl` | `text-4xl` |
| **Gap** | `gap-3` | `gap-4` | `gap-6` |

---

#### 👤 Profile Page - Responsive Specs

| Element | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|-------------------|
| **Layout** | Single column | Single column centered | 2 column (sidebar + form) |
| **Avatar Size** | `h-20 w-20` | `h-24 w-24` | `h-28 w-28` |
| **Form Width** | Full width | `max-w-md` | `max-w-lg` |
| **Settings Cards** | Stack vertical | Stack vertical | Grid 2 columns |

---

#### 📱 Navigation Patterns

**Mobile (< 640px):** Bottom Tab Navigation
```
┌────────────────────────────────┐
│  🏠      📊      ➕      📁      👤  │
│ Home   Stats   Add   Cat   Profile│
└────────────────────────────────┘
```

**Tablet (640-1024px):** Side Rail (Icon only)
```
┌────┬─────────────────────────┐
│ 🏠 │                         │
│ 📊 │      Content Area       │
│ 📁 │                         │
│ 💰 │                         │
│ 👤 │                         │
└────┴─────────────────────────┘
```

**Desktop (> 1024px):** Full Sidebar with Labels
```
┌──────────────┬────────────────────────┐
│ 🏠 Dashboard │                        │
│ 📊 Analytics │                        │
│ 📁 Categories│     Content Area       │
│ 💰 Expenses  │                        │
│ 👤 Profile   │                        │
└──────────────┴────────────────────────┘
```

---

#### 🔧 Responsive Utilities

| Utility Class | Purpose |
|---------------|---------|
| `container mx-auto` | Centered container with max-width |
| `px-4 sm:px-6 lg:px-8` | Responsive horizontal padding |
| `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | Responsive grid |
| `hidden sm:block` | Hide on mobile, show on tablet+ |
| `sm:hidden` | Show on mobile, hide on tablet+ |
| `text-sm sm:text-base lg:text-lg` | Responsive font size |
| `space-y-4 sm:space-y-6` | Responsive vertical spacing |
| `flex-col sm:flex-row` | Stack to row on larger screens |

---

#### ✅ Responsive Testing Checklist

| Test | Devices | Status |
|------|---------|--------|
| iPhone SE (375px) | Mobile | ⏳ Pending |
| iPhone 14 (390px) | Mobile | ⏳ Pending |
| iPhone 14 Pro Max (430px) | Mobile | ⏳ Pending |
| iPad Mini (768px) | Tablet | ⏳ Pending |
| iPad Pro 11" (834px) | Tablet | ⏳ Pending |
| Laptop (1366px) | Desktop | ⏳ Pending |
| Desktop HD (1920px) | Desktop | ⏳ Pending |
| Orientation: Portrait | All | ⏳ Pending |
| Orientation: Landscape | All | ⏳ Pending |
| Touch interactions | Mobile/Tablet | ⏳ Pending |
| Hover states disabled | Mobile/Tablet | ⏳ Pending |

---

#### 🎯 Mobile-First Implementation Strategy

1. **Start with mobile styles (default)**
2. **Add tablet styles with `sm:` and `md:`**
3. **Add desktop styles with `lg:` and `xl:`**
4. **Test on real devices or Chrome DevTools**
5. **Fix edge cases and overflow issues**

---

### 🔄 Progress Tracker

| Phase | Description | Status | Progress |
|-------|-------------|--------|----------|
| 7.1 | Login Page | ✅ Complete | 91% |
| 7.2 | Register Page | ✅ Complete | 100% |
| 7.3 | Dashboard Page | ✅ Complete | 100% |
| 7.4 | Expenses Page | ✅ Complete | 100% |
| 7.5 | Categories Page | ✅ Complete | 100% |
| 7.6 | Profile Page | ✅ Complete | 100% |

**Overall Progress: 6/6 Pages (100%) 🎉**

---

### ✅ Approval Checklist

- [x] **Login Page Sample** - ✅ Implemented
- [x] User confirm design direction - ✅ Approved
- [ ] User review sample implementation
- [ ] Lanjut ke halaman lainnya

---

### 🎨 Design Reference Preview

**Login Page Mock-up Concept:**

```
┌─────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░  GRADIENT BACKGROUND  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░  (Purple → Blue)      ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                             │
│              ┌─────────────────────────┐                    │
│              │   🪙 DuitDiary          │ ← Glass Card      │
│              │   "Track your money"    │                    │
│              │                         │                    │
│              │   ┌───────────────────┐ │                    │
│              │   │ 📧 Email          │ │ ← Icon Input      │
│              │   └───────────────────┘ │                    │
│              │                         │                    │
│              │   ┌───────────────────┐ │                    │
│              │   │ 🔒 Password       │ │ ← Icon Input      │
│              │   └───────────────────┘ │                    │
│              │                         │                    │
│              │   ☐ Remember me         │                    │
│              │                         │                    │
│              │   ┌───────────────────┐ │                    │
│              │   │ ▓▓▓ SIGN IN ▓▓▓▓ │ │ ← Gradient Button │
│              │   └───────────────────┘ │                    │
│              │                         │                    │
│              │   Don't have account?   │                    │
│              │   Register here         │                    │
│              └─────────────────────────┘                    │
│                                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────────────┘
```

---

**Status Dokumen:** ✅ Backend, Web Frontend & Mobile App Complete - UI Redesign Phase Started  
**Terakhir Diperbarui:** 29 Desember 2024
