# DuitDiary - Personal Finance Management App

A comprehensive personal finance management system built with modern web technologies. DuitDiary helps you track expenses, manage budgets, and visualize your spending patterns.

## 📱 Project Structure

This is a monorepo containing multiple applications:

### Applications

- **[apps/api](./apps/api)** - Backend API (Node.js + Express + TypeScript + Prisma)
- **[apps/web](./apps/web)** - Web Frontend (React + Vite + TypeScript)
- **[apps/mobile](./apps/mobile)** - Mobile App (React Native + Expo + TypeScript)

### Shared Packages

- **[packages/shared](./packages/shared)** - Shared utilities and types

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/andri5/duitdiary.git
cd duitdiary
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
# API
cp apps/api/.env.example apps/api/.env

# Web
cp apps/web/.env.example apps/web/.env (if exists)

# Mobile
cp apps/mobile/.env.example apps/mobile/.env (if exists)
```

4. Setup database:
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Running the Applications

#### Backend API
```bash
cd apps/api
npm run dev
```

#### Web Frontend
```bash
cd apps/web
npm run dev
```

#### Mobile App
```bash
cd apps/mobile
npm start
```

## 📚 Documentation

- [Backend Documentation](./apps/api/README.md)
- [Web Frontend Documentation](./apps/web/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Development Plan](./plan.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

- **Andri** - [GitHub Profile](https://github.com/andri5)

## 🎯 Features

- 💰 Expense tracking
- 📊 Financial dashboard with analytics
- 🏷️ Category management
- 👥 User authentication
- 📱 Responsive design
- 🌐 Cross-platform (Web & Mobile)

## 📞 Support

For support, please open an issue on [GitHub Issues](https://github.com/andri5/duitdiary/issues).
