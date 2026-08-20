# 🤝 Contributing to Dompet Tenang

Terima kasih atas minat Anda untuk berkontribusi ke Dompet Tenang! Dokumen ini berisi panduan untuk developer yang akan bekerja pada proyek ini.

---

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Review Process](#code-review-process)

---

## 🛠 Development Setup

### Prerequisites

1. **Node.js** v20.x atau lebih tinggi
2. **PostgreSQL** v15.x atau lebih tinggi
3. **Git** untuk version control
4. **VS Code** (recommended) dengan extensions:
   - ESLint
   - Prettier
   - Prisma
   - TypeScript

### First Time Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd catatharian

# 2. Install dependencies
cd apps/api
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi lokal Anda

# 4. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start development
npm run dev
```

---

## 🏗 Project Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────┐
│                   ROUTES                         │
│   Mendefinisikan endpoint dan middleware chain   │
└─────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│                 CONTROLLERS                      │
│   Handle request/response, validation, error     │
│   handling. TIDAK berisi business logic.         │
└─────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│                  SERVICES                        │
│   Business logic layer. Interaksi dengan         │
│   database melalui Prisma. Reusable functions.   │
└─────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│                   PRISMA                         │
│   ORM layer untuk database operations.           │
└─────────────────────────────────────────────────┘
```

### Folder Responsibilities

| Folder | Tanggung Jawab |
|--------|----------------|
| `config/` | Environment configuration, constants |
| `constants/` | Error codes, success messages, defaults |
| `controllers/` | Request handling, response formatting |
| `errors/` | Custom error classes |
| `middlewares/` | Auth, validation, error handling |
| `routes/` | Route definitions |
| `services/` | Business logic, database operations |
| `types/` | TypeScript interfaces |
| `utils/` | Helper functions, reusable utilities |

---

## 📝 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ DO: Use explicit types
function getUserById(id: string): Promise<User | null> {
  // ...
}

// ❌ DON'T: Implicit any
function getUserById(id) {
  // ...
}

// ✅ DO: Use interfaces for objects
interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

// ❌ DON'T: Inline object types everywhere
function createUser(data: { name: string; email: string; password: string }) {
  // ...
}
```

### Naming Conventions

```typescript
// Files: kebab-case
auth.controller.ts
expense.service.ts

// Classes: PascalCase
class AuthController { }
class ExpenseService { }

// Functions/Methods: camelCase
function getUserById() { }
async function createExpense() { }

// Constants: SCREAMING_SNAKE_CASE
const ERROR_CODES = { }
const DEFAULT_PAGE_SIZE = 10;

// Interfaces: PascalCase with 'I' prefix (optional)
interface UserResponse { }
interface IAuthService { }
```

### File Structure Template

```typescript
/**
 * ============================================
 * Dompet Tenang API - [Module Name]
 * ============================================
 * [Brief description of the file's purpose]
 * 
 * @author Dompet Tenang Team
 * @see [Related documentation]
 * ============================================
 */

// 1. Imports (grouped: external, internal, types)
import express from 'express';
import { prisma } from '../utils/prisma.js';
import type { UserResponse } from '../types/index.js';

// 2. Constants/Types (if any)
const CONSTANT_VALUE = 'value';

// 3. Main code (classes, functions)
export class SomeClass {
  // ...
}

// 4. Exports (if not inline)
export default someExport;
```

### Controller Pattern

```typescript
// Controller: Handle HTTP, delegate to service
export class ExpenseController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      // 1. Extract user/data from request
      const { userId } = (req as AuthenticatedRequest).user!;
      const data: CreateExpenseInput = req.body;
      
      // 2. Call service
      const expense = await expenseService.create(userId, data);
      
      // 3. Send response
      sendCreated(res, expense, 'Expense created successfully');
    } catch (error) {
      // 4. Handle error
      const message = error instanceof Error ? error.message : 'Failed';
      sendError(res, message, 400, 'CREATE_FAILED');
    }
  }
}
```

### Service Pattern

```typescript
// Service: Business logic, database operations
export class ExpenseService {
  async create(userId: string, data: CreateExpenseInput): Promise<ExpenseResponse> {
    // 1. Validate business rules
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId }
    });
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    // 2. Perform database operation
    const expense = await prisma.expense.create({
      data: {
        userId,
        categoryId: data.categoryId,
        amount: data.amount,
        // ...
      }
    });
    
    // 3. Return formatted response
    return this.formatExpense(expense);
  }
}
```

---

## 🔀 Git Workflow

### Branch Naming

```
feature/add-budget-api
fix/expense-validation-error
docs/update-readme
refactor/auth-service
```

### Commit Messages

Format: `<type>: <description>`

| Type | Description |
|------|-------------|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `docs` | Dokumentasi |
| `style` | Formatting (no code change) |
| `refactor` | Code refactoring |
| `test` | Add/update tests |
| `chore` | Build/config changes |

Examples:
```bash
git commit -m "feat: Add budget management API"
git commit -m "fix: Resolve expense date validation error"
git commit -m "docs: Update API documentation"
git commit -m "refactor: Simplify auth service"
```

### Branch Strategy

```
main (production)
  └── develop (staging)
        ├── feature/add-budget-api
        ├── fix/expense-validation
        └── ...
```

---

## 🔍 Pull Request Guidelines

### Before Submitting

1. ✅ Run `npm run dev` - pastikan server berjalan
2. ✅ Test semua endpoint yang terpengaruh
3. ✅ Pastikan tidak ada TypeScript errors
4. ✅ Update dokumentasi jika perlu
5. ✅ Tambahkan komentar pada kode kompleks

### PR Template

```markdown
## Description
[Describe what this PR does]

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## Testing
- [ ] Tested locally
- [ ] All endpoints working
- [ ] No TypeScript errors

## Checklist
- [ ] Code follows project conventions
- [ ] Comments added where needed
- [ ] Documentation updated
```

---

## 👀 Code Review Process

### Reviewer Checklist

1. **Functionality**: Apakah kode bekerja sesuai requirement?
2. **Code Quality**: Apakah mengikuti coding standards?
3. **Error Handling**: Apakah error ditangani dengan baik?
4. **Security**: Ada security concerns?
5. **Performance**: Ada potential performance issues?
6. **Documentation**: Apakah kode terdokumentasi dengan baik?

### Response Time

- Small PRs (< 100 lines): 1 hari kerja
- Medium PRs (100-500 lines): 2 hari kerja
- Large PRs (> 500 lines): 3-5 hari kerja

---

## 📞 Contact

Jika ada pertanyaan, silakan hubungi tim development.

---

**Happy Coding! 🚀**
