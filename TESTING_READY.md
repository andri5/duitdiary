# ✅ TESTING SETUP READY - START MANUAL TESTING NOW!

**Date:** December 31, 2025, 23:55 UTC  
**Status:** ✅ ALL SERVICES RUNNING  
**Mode:** Manual Testing Ready

---

## 🚀 SERVICES STATUS

### ✅ BACKEND API
- **Status:** RUNNING
- **Port:** 3000 (not 3001)
- **URL:** http://localhost:3000
- **Health:** http://localhost:3000/api/v1/health
- **Database:** PostgreSQL connected
- **Auth:** JWT enabled

### ✅ FRONTEND WEB
- **Status:** RUNNING
- **Port:** 5173
- **URL:** http://localhost:5173
- **React:** Vite dev server ready
- **Hot Reload:** Enabled

### ✅ TESTING FILES
- **Backend Tests:** `apps/api/src/__tests__/` ready
- **Jest Config:** `apps/api/jest.config.js` ready
- **Validation Middleware:** `apps/api/src/middlewares/validation.middleware.ts`
- **Rate Limiting:** `apps/api/src/middlewares/rateLimit.middleware.ts`
- **Form Validation:** `apps/web/src/hooks/useFormValidation.ts`

---

## 📝 WHAT YOU CAN TEST NOW

### 1. MANUAL API TESTING (Postman/Insomnia/curl)

**Base URL:** `http://localhost:3000/api/v1`

#### Test 1: Register New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

Expected: 200 OK
Response: { "success": true, "data": { "id": "...", "email": "...", ... } }
```

#### Test 2: Login User
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

Expected: 200 OK
Response: { "success": true, "data": { "token": "eyJ...", "user": {...} } }
```

#### Test 3: Create Category
```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Food",
    "color": "#FF6B6B"
  }'

Expected: 201 Created
```

#### Test 4: Create Expense
```bash
curl -X POST http://localhost:3000/api/v1/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "categoryId": "CATEGORY_ID_HERE",
    "amount": 50000,
    "description": "Lunch",
    "date": "2025-12-31"
  }'

Expected: 201 Created
```

#### Test 5: Get Dashboard Summary
```bash
curl http://localhost:3000/api/v1/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

Expected: 200 OK with totals
```

---

### 2. MANUAL FRONTEND TESTING

Open http://localhost:5173 in browser

#### Test Flow:
1. [ ] **Register Page**
   - Navigate to Register
   - Try invalid email → Should show error
   - Try short password → Should show error
   - Register with valid data
   - Verify: User created, redirected to login

2. [ ] **Login Page**
   - Try wrong email → Should show error message
   - Try wrong password → Should show error message
   - Login with correct credentials
   - Verify: Token saved, redirected to dashboard

3. [ ] **Dashboard Page**
   - Verify: Summary cards show (though may be 0)
   - Verify: Charts display (may be empty)
   - Verify: Layout responsive on different screen sizes

4. [ ] **Expenses Page**
   - Create new expense
   - Try invalid amount (negative, empty) → Should prevent
   - Create valid expense
   - Verify: Expense appears in list
   - Update expense
   - Delete expense
   - Verify: Deleted expense gone from list

5. [ ] **Categories Page**
   - Create new category
   - Try duplicate name → Should prevent
   - Try empty name → Should prevent
   - Create valid category
   - Update category
   - Delete category

---

### 3. NEGATIVE TEST SCENARIOS

#### Backend Negative Tests (use Postman)

**Test:** Register with missing email
```json
{
  "password": "Test123!",
  "name": "Test"
}
```
Expected: 400 Bad Request with "Email is required" error

**Test:** Register with duplicate email
```json
{
  "email": "test@example.com",  // If already exists
  "password": "Test123!",
  "name": "Test"
}
```
Expected: 409 Conflict with "Email already registered"

**Test:** Create expense with negative amount
```json
{
  "categoryId": "uuid-here",
  "amount": -100,
  "description": "Test"
}
```
Expected: 400 Bad Request with "Amount must be greater than 0"

**Test:** Access protected route without token
```bash
curl http://localhost:3000/api/v1/expenses
```
Expected: 401 Unauthorized with "Authorization header missing"

---

## 📊 TESTING CHECKLIST

### Phase 1: Happy Path (Positive Tests)
- [ ] Register user
- [ ] Login user
- [ ] Create category
- [ ] Create expense
- [ ] List expenses
- [ ] Update expense
- [ ] Delete expense
- [ ] View dashboard

### Phase 2: Negative Tests
- [ ] Invalid email format
- [ ] Duplicate email
- [ ] Weak password
- [ ] Wrong password
- [ ] Missing fields
- [ ] Negative amounts
- [ ] Invalid dates
- [ ] Unauthorized access

### Phase 3: Edge Cases
- [ ] Rate limiting (send 10+ login attempts fast)
- [ ] Very large amounts
- [ ] Very long descriptions
- [ ] Expired token
- [ ] Concurrent requests

### Phase 4: UI Responsiveness
- [ ] Mobile layout (375px)
- [ ] Tablet layout (768px)
- [ ] Desktop layout (1920px)
- [ ] Form error display
- [ ] Loading states

---

## 🔍 ISSUES TO WATCH FOR

### Backend Validation
- [ ] Email validation working?
- [ ] Password strength checking?
- [ ] Amount validation (negative, zero)?
- [ ] Date in future rejected?
- [ ] Required fields enforced?

### Frontend Validation
- [ ] Form errors displaying?
- [ ] Disabled submit button on error?
- [ ] Success messages showing?
- [ ] Loading states visible?
- [ ] Error messages clear?

### Security
- [ ] JWT token required for protected routes?
- [ ] Rate limiting working?
- [ ] CORS properly configured?
- [ ] Passwords not in console/network?
- [ ] SQL injection prevented?

---

## 🛠️ DEBUGGING TOOLS

### Backend Debug
```bash
# Check backend is running
netstat -ano | findstr :3000

# View backend logs
# Watch the backend terminal for errors

# Test API endpoints
# Use Postman, Insomnia, or curl
```

### Frontend Debug
```bash
# Open DevTools in browser (F12)
# Network tab: Check API calls
# Console tab: Check for JavaScript errors
# Application tab: Check localStorage for tokens
```

### Database Debug
```bash
# View database in Prisma Studio
cd apps/api
npx prisma studio
# Opens on http://localhost:5555
```

---

## 📋 AFTER TESTING

### If All Tests Pass ✅
1. Note any issues found
2. Plan fixes for next phase
3. Document what works
4. Commit test results

### If Issues Found ❌
1. Create GitHub issues with:
   - Description of issue
   - Steps to reproduce
   - Expected vs actual
   - Screenshot if possible
2. Fix issues
3. Re-test the fix
4. Commit fix

---

## 📞 QUICK COMMANDS

```bash
# Terminal 1 - Backend (already running)
cd apps/api
npm run dev

# Terminal 2 - Frontend (already running)
cd apps/web
npm run dev

# Terminal 3 - Database GUI
cd apps/api
npx prisma studio

# Terminal 4 - Run Tests
cd apps/api
npm test

# Check Service Status
curl http://localhost:3000/api/v1/health
curl http://localhost:5173
```

---

## 🎯 NEXT STEPS

### After Manual Testing Complete:
1. **Document Findings** - What works, what doesn't
2. **Fix Issues** - Address any bugs found
3. **Write Unit Tests** - Add Jest tests
4. **Integration Tests** - Full flow testing
5. **Production Deployment** - Deploy to staging

---

## 📚 USEFUL LINKS

- **Postman:** https://www.postman.com/downloads/
- **Insomnia:** https://insomnia.rest/download
- **Browser DevTools:** F12 in Chrome/Firefox/Edge
- **Prisma Studio:** `npx prisma studio`
- **GitHub Issues:** https://github.com/andri5/duitdiary/issues

---

**Status:** ✅ READY FOR TESTING!  
**Time:** About to start manual testing phase  
**Next Review:** After you complete manual testing

🚀 **START TESTING NOW!** Open http://localhost:5173 in your browser!
