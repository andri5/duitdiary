# 🧹 PROJECT CLEANUP & STANDARDS GUIDE

**Date:** January 1, 2026  
**Status:** Ready for Implementation  
**Phase:** Code Organization & Standards

---

## 📋 PART 1: FILES TO DELETE

### Documentation Files (Consolidate to plan.md only)
These files are redundant and should be deleted:

```
❌ APPROVAL_NEEDED.md          → Archive (already approved)
❌ CONTRIBUTING.md              → Move to docs/ folder
❌ DEVELOPMENT_STATUS.md        → Archive (replaced by plan.md)
❌ FINAL_REPORT.md              → Archive (testing complete)
❌ MANUAL_TESTING_GUIDE.md      → Merge into TEST_GUIDE.md
❌ NEXT_ACTION.md               → Remove (use NEXT_ACTIONS.md)
❌ SESSION_COMPLETE.md          → Archive (reference only)
❌ SOLO_DEVELOPER_ROADMAP.md    → Archive (use plan.md)
❌ STATUS.md                    → Archive (use plan.md)
❌ SUMMARY.md                   → Archive (use FINAL_REPORT.md)
❌ TESTING_READY.md             → Archive
❌ TESTING_RESULTS.md           → Archive
❌ TEST_PLAN.md                 → Archive
❌ WEEK1_FINAL.md               → Archive
❌ WEEK1_PROGRESS.md            → Archive
❌ WEEK2_STATUS.md              → Archive
❌ OPTION1_COMPLETE.md          → Archive
❌ CRUD_TESTING_REPORT.md       → Archive (reference only)
```

### Generated Files (Cleanup)
```
❌ start-frontend.bat                             → Replace with npm scripts
❌ [Any GitHub tokens in repo root]               → NEVER commit!
```

### Keep Only
```
✅ plan.md                      → Master project plan
✅ README.md                    → Project overview
✅ package.json                 → Root dependencies
✅ .gitignore                   → Git ignore patterns
✅ LICENSE                      → Project license
✅ color-preview.html           → Design reference
```

**Total to Delete:** 21 files

---

## 📁 PART 2: RECOMMENDED FOLDER STRUCTURE

### Root Level (Cleaned Up)
```
duitdiary/
├── docs/                       📚 NEW - Documentation
│   ├── API.md                  - API endpoints reference
│   ├── CONTRIBUTING.md         - Contribution guidelines
│   ├── TESTING.md              - Testing procedures
│   └── ARCHITECTURE.md         - System architecture
│
├── apps/
│   ├── api/                    🔧 Backend
│   ├── web/                    🎨 Frontend
│   ├── mobile/                 📱 Mobile
│   └── shared/                 🔄 Shared code (types, utils)
│
├── scripts/                    📜 NEW - Utility scripts
│   ├── start-all.sh            - Start all services
│   ├── test-all.sh             - Run all tests
│   └── clean.sh                - Cleanup script
│
├── .github/
│   └── workflows/              CI/CD pipelines
│
├── plan.md                     📋 Master plan (ONLY)
├── README.md                   📖 Project info
├── package.json                📦 Root config
├── tsconfig.json               🔧 TypeScript config
└── .gitignore                  🚫 Git ignore
```

---

## 💻 PART 3: CODE STANDARDS

### TypeScript Standards
✅ **Use strict mode** (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

✅ **File naming:**
- Controllers: `user.controller.ts`
- Services: `user.service.ts`
- Middlewares: `auth.middleware.ts`
- Types: Use interfaces, not types for exports
- Components: PascalCase (UserCard.tsx)
- Hooks: camelCase with `use` prefix (useUser.ts)

✅ **Exports:**
```typescript
// ✅ GOOD - Named export
export const getUserService = () => { }
export interface IUser { }

// ❌ AVOID - Default export
export default class UserService { }
```

### Backend Code Standards (apps/api)

**Folder Structure:**
```
apps/api/src/
├── controllers/           - HTTP request handlers
├── services/              - Business logic
├── middlewares/           - Express middlewares
├── routes/                - API routes
├── types/                 - TypeScript interfaces
├── utils/                 - Helper functions
├── config/                - Configuration
├── constants/             - Constants
├── errors/                - Custom error classes
└── __tests__/             - Unit tests
```

**File Organization:**
```typescript
// ✅ GOOD ORDER IN FILES:
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Main exports
// 5. Helper functions (private)
```

**Naming Conventions:**
```typescript
// Controllers
export class UserController {
  async getUser(req: Request, res: Response): Promise<void> { }
}

// Services
export class UserService {
  async getUserById(id: string): Promise<IUser> { }
}

// Types
export interface IUser {
  id: string;
  name: string;
}

// Constants
export const USER_ROLES = ['admin', 'user'] as const;
```

### Frontend Code Standards (apps/web)

**Folder Structure:**
```
apps/web/src/
├── pages/                 - Page components (route-level)
├── components/            - Reusable components
│   ├── common/            - Shared across app
│   ├── forms/             - Form components
│   ├── layout/            - Layout components
│   ├── ui/                - UI primitives
│   └── auth/              - Auth components
├── hooks/                 - Custom React hooks
├── services/              - API calls
├── stores/                - State management (Zustand)
├── types/                 - TypeScript types
├── lib/                   - Utility functions
├── assets/                - Images, fonts
└── styles/                - Global styles
```

**Component Structure:**
```typescript
// ✅ GOOD - Functional component with clear structure
interface UserCardProps {
  user: IUser;
  onEdit?: (user: IUser) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Logic
  const handleClick = () => { };
  
  // Render
  return <div>{ }</div>;
};

export default UserCard;
```

**Naming Conventions:**
```typescript
// Components: PascalCase
export const UserCard: React.FC = () => { };
export const ExpenseList: React.FC = () => { };

// Hooks: use prefix + camelCase
export const useUser = () => { };
export const useExpenses = () => { };

// Props: ComponentNameProps
interface UserCardProps { }
interface ExpenseListProps { }

// Event handlers: on + VerbNoun
const handleClick = () => { };
const onSubmit = () => { };
const onError = () => { };
```

### Documentation Standards

**Every file should have:**
```typescript
/**
 * @file user.controller.ts
 * @description Handles HTTP requests for user operations
 * @author Your Name
 */

/**
 * Gets a user by ID
 * @param userId - The user's unique identifier
 * @returns Promise<IUser>
 * @throws UserNotFound if user doesn't exist
 */
export async function getUser(userId: string): Promise<IUser> {
  // implementation
}
```

**README in each app:**
```
apps/api/README.md
apps/web/README.md
```

Should include:
- What this app does
- How to run it
- Environment variables
- Project structure
- Key files explanation

---

## 🧪 PART 4: VERIFICATION CHECKLIST

Before moving to UI redesign, verify:

### Backend (apps/api)
- [ ] All files follow naming conventions
- [ ] TypeScript strict mode enabled
- [ ] JSDoc comments on all exports
- [ ] Error handling consistent
- [ ] No unused imports
- [ ] Tests still passing: 26/26 ✅

### Frontend (apps/web)
- [ ] Components in correct folders
- [ ] Props properly typed
- [ ] All components documented
- [ ] No console.log in production code
- [ ] Imports organized (external → internal)
- [ ] Unused files deleted

### Root Level
- [ ] Only 5-6 config files at root
- [ ] docs/ folder created
- [ ] README.md updated
- [ ] .gitignore properly configured
- [ ] No credentials in git

---

## 📋 CLEANUP ACTION PLAN

**Step 1: Archive Old Files**
```bash
# Create archive folder
mkdir -p archive
# Move old docs
mv APPROVAL_NEEDED.md archive/
mv FINAL_REPORT.md archive/
# ... etc
```

**Step 2: Delete Sensitive Files**
```bash
# REMOVE IMMEDIATELY - GitHub tokens!
rm ghp_*.* 
```

**Step 3: Create docs/ folder**
```bash
mkdir docs/
touch docs/API.md
touch docs/TESTING.md
touch docs/ARCHITECTURE.md
```

**Step 4: Create scripts/ folder**
```bash
mkdir scripts/
# Add utility scripts
```

**Step 5: Update root files**
- [ ] Create new README.md
- [ ] Create docs/CONTRIBUTING.md
- [ ] Create docs/TESTING.md

**Step 6: Code organization**
- [ ] Check all files follow standards
- [ ] Add missing JSDoc comments
- [ ] Organize imports
- [ ] Remove unused files

---

## ✅ COMPLETION CHECKLIST

After cleanup is done:

- [ ] Project structure organized
- [ ] All code follows standards
- [ ] Old files archived/deleted
- [ ] Documentation in docs/
- [ ] All tests still passing
- [ ] Services ready for testing
- [ ] Ready for UI redesign phase

---

## 🚀 NEXT PHASE: UI REDESIGN

After cleanup approval, we will:
1. Create `REDESIGN_UI.md` with detailed plan
2. Show current vs. proposed UI
3. Document component changes needed
4. Create mock-ups/wireframes
5. **Wait for your approval before coding**

---

**Status:** Ready for Implementation  
**Awaiting:** Your confirmation to proceed with cleanup
