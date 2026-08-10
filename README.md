# DuitDiary — Catat Keuangan

Aplikasi pencatatan keuangan pribadi (pemasukan & pengeluaran) dengan dashboard, kategori, upload struk, dan saran finansial otomatis.

## Project Structure

Monorepo:

| Path | Deskripsi |
|------|-----------|
| [apps/api](./apps/api) | Backend API (Node.js + Express + TypeScript + Prisma + PostgreSQL) |
| [apps/web](./apps/web) | Web frontend (React + Vite + TypeScript + Tailwind CSS) |
| [apps/mobile](./apps/mobile) | Mobile app (React Native + Expo) — WIP |
| [packages/shared](./packages/shared) | Shared utilities & types |

## Features

- **Auth** — Register, login, logout, lupa/reset password
- **Transaksi** — Pemasukan & pengeluaran (menu Transaksi dengan submenu)
- **Kategori** — Default + kustom, ikon Lucide, kategori default terkunci
- **Dashboard** — Ringkasan saldo, grafik perbandingan, breakdown per kategori, AI saran & notice
- **Struk** — Upload gambar/PDF sebagai bukti transaksi
- **Kalkulator** — Hitung nominal cepat di form transaksi
- **Profil** — Upload foto profil, 3 tema (Neo Ledger, Midnight, Ocean Mist)
- **Responsif** — Desktop sidebar + mobile bottom nav

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL (atau Docker)
- Git

### Installation

```bash
git clone https://github.com/andri5/duitdiary.git
cd duitdiary
npm install
```

### Environment

```bash
cp apps/api/.env.example apps/api/.env
```

Sesuaikan di `apps/api/.env`:

- `DATABASE_URL` — koneksi PostgreSQL
- `PORT` — default `3001` jika 3000 sudah terpakai
- `CORS_ORIGIN` / `APP_URL` — biasanya `http://localhost:5173`
- `JWT_SECRET` & `JWT_REFRESH_SECRET`

### Database

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Run (dari root monorepo)

```bash
# Terminal 1 — API
npm run api

# Terminal 2 — Web
npm run web
```

- Web: http://127.0.0.1:5173/
- API: http://localhost:3001/api/v1/health

## Tech Stack

**API:** Express, Prisma, Zod, JWT, Multer, Helmet, bcrypt  

**Web:** React 19, React Router, TanStack Query, Zustand, React Hook Form, Recharts, Framer Motion, Tailwind CSS v4

## Documentation

- [Backend](./apps/api/README.md)
- [Web](./apps/web/README.md)
- [Contributing](./CONTRIBUTING.md)

## License

MIT — see [LICENSE](./LICENSE)

## Author

- **Andri** — [GitHub](https://github.com/andri5)

## Support

Buka issue di [GitHub Issues](https://github.com/andri5/duitdiary/issues).
