# 🧪 TESTING MANUAL - NEGATIVE SCENARIOS & VALIDATION

**Date:** December 31, 2025  
**Status:** Setup untuk manual testing  
**Focus:** CRUD validation + Negative scenarios

---

## 📋 NEGATIVE TEST SCENARIOS

### 1. AUTHENTICATION TESTS

#### Register Endpoint Negative Cases

```
Test 1.1: Missing Email
  Request: POST /auth/register
  Body: { "password": "Test123!", "name": "John" }
  Expected: 400 Bad Request
  Error: "Email is required"

Test 1.2: Invalid Email Format
  Request: POST /auth/register
  Body: { "email": "invalid-email", "password": "Test123!", "name": "John" }
  Expected: 400 Bad Request
  Error: "Invalid email format"

Test 1.3: Missing Password
  Request: POST /auth/register
  Body: { "email": "test@example.com", "name": "John" }
  Expected: 400 Bad Request
  Error: "Password is required"

Test 1.4: Weak Password (< 6 characters)
  Request: POST /auth/register
  Body: { "email": "test@example.com", "password": "Test1", "name": "John" }
  Expected: 400 Bad Request
  Error: "Password must be at least 6 characters"

Test 1.5: Duplicate Email
  Request: POST /auth/register (email already exists)
  Body: { "email": "existing@example.com", "password": "Test123!", "name": "John" }
  Expected: 409 Conflict
  Error: "Email already registered"

Test 1.6: Missing Name
  Request: POST /auth/register
  Body: { "email": "test@example.com", "password": "Test123!" }
  Expected: 400 Bad Request
  Error: "Name is required"

Test 1.7: Name too short (< 2 characters)
  Request: POST /auth/register
  Body: { "email": "test@example.com", "password": "Test123!", "name": "J" }
  Expected: 400 Bad Request
  Error: "Name must be at least 2 characters"

Test 1.8: Extra fields (security test)
  Request: POST /auth/register with admin: true
  Body: { "email": "test@example.com", "password": "Test123!", "name": "John", "admin": true }
  Expected: 200 OK (extra fields ignored, user NOT admin)
  Verify: New user is regular user, not admin
```

#### Login Endpoint Negative Cases

```
Test 2.1: Missing Email
  Request: POST /auth/login
  Body: { "password": "Test123!" }
  Expected: 400 Bad Request
  Error: "Email is required"

Test 2.2: Missing Password
  Request: POST /auth/login
  Body: { "email": "test@example.com" }
  Expected: 400 Bad Request
  Error: "Password is required"

Test 2.3: Wrong Email (user not found)
  Request: POST /auth/login
  Body: { "email": "notfound@example.com", "password": "Test123!" }
  Expected: 401 Unauthorized
  Error: "Invalid email or password"

Test 2.4: Wrong Password
  Request: POST /auth/login
  Body: { "email": "test@example.com", "password": "WrongPassword123" }
  Expected: 401 Unauthorized
  Error: "Invalid email or password"

Test 2.5: Invalid Email Format
  Request: POST /auth/login
  Body: { "email": "invalid-email", "password": "Test123!" }
  Expected: 400 Bad Request
  Error: "Invalid email format"
```

#### Protected Route Tests

```
Test 3.1: Missing Authorization Header
  Request: GET /auth/me (no Authorization header)
  Expected: 401 Unauthorized
  Error: "Authorization header missing"

Test 3.2: Invalid Token Format
  Request: GET /auth/me
  Header: Authorization: "InvalidToken123"
  Expected: 401 Unauthorized
  Error: "Invalid token"

Test 3.3: Expired Token
  Request: GET /auth/me
  Header: Authorization: "Bearer <expired-token>"
  Expected: 401 Unauthorized
  Error: "Token expired"

Test 3.4: Tampered Token
  Request: GET /auth/me
  Header: Authorization: "Bearer <valid-token-with-changed-payload>"
  Expected: 401 Unauthorized
  Error: "Invalid token"
```

---

### 2. EXPENSE TESTS

#### Create Expense Negative Cases

```
Test 4.1: Missing Category ID
  Request: POST /expenses
  Body: { "amount": 100, "description": "Food", "date": "2025-12-31" }
  Expected: 400 Bad Request
  Error: "Category ID is required"

Test 4.2: Invalid Category ID (UUID format)
  Request: POST /expenses
  Body: { "categoryId": "invalid-uuid", "amount": 100, "description": "Food", "date": "2025-12-31" }
  Expected: 400 Bad Request
  Error: "Invalid category ID format"

Test 4.3: Category Not Found
  Request: POST /expenses
  Body: { "categoryId": "550e8400-e29b-41d4-a716-446655440000", "amount": 100, "description": "Food" }
  Expected: 404 Not Found
  Error: "Category not found"

Test 4.4: Missing Amount
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "description": "Food", "date": "2025-12-31" }
  Expected: 400 Bad Request
  Error: "Amount is required"

Test 4.5: Negative Amount
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": -100, "description": "Food" }
  Expected: 400 Bad Request
  Error: "Amount must be greater than 0"

Test 4.6: Zero Amount
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": 0, "description": "Food" }
  Expected: 400 Bad Request
  Error: "Amount must be greater than 0"

Test 4.7: Invalid Amount (not a number)
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": "abc", "description": "Food" }
  Expected: 400 Bad Request
  Error: "Amount must be a number"

Test 4.8: Very Large Amount (> 999999999)
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": 9999999999, "description": "Food" }
  Expected: 400 Bad Request
  Error: "Amount exceeds maximum allowed value"

Test 4.9: Missing Date
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": 100, "description": "Food" }
  Expected: 400 Bad Request OR auto-fill with current date
  
Test 4.10: Invalid Date Format
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": 100, "date": "31-12-2025", "description": "Food" }
  Expected: 400 Bad Request
  Error: "Invalid date format"

Test 4.11: Future Date (> today)
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": 100, "date": "2026-01-01", "description": "Food" }
  Expected: 400 Bad Request OR Allow with warning
  Decision: Clarify if future expenses allowed

Test 4.12: Missing Description (optional?)
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": 100, "date": "2025-12-31" }
  Expected: 200 OK (description optional) OR 400 Bad Request
  Decision: Clarify if required

Test 4.13: Description Too Long (> 500 characters)
  Request: POST /expenses
  Body: { "categoryId": "<valid-uuid>", "amount": 100, "description": "<500+ chars>", "date": "2025-12-31" }
  Expected: 400 Bad Request
  Error: "Description max 500 characters"

Test 4.14: Wrong User Category (accessing another user's category)
  User A creates category
  User B tries to create expense with User A's category
  Expected: 403 Forbidden OR 404 Not Found
```

#### Update Expense Negative Cases

```
Test 5.1: Invalid Expense ID
  Request: PUT /expenses/invalid-uuid
  Expected: 400 Bad Request

Test 5.2: Expense Not Found
  Request: PUT /expenses/550e8400-e29b-41d4-a716-446655440000
  Expected: 404 Not Found
  Error: "Expense not found"

Test 5.3: Another User's Expense
  User A creates expense
  User B tries to update User A's expense
  Expected: 403 Forbidden

Test 5.4: Update with negative amount
  Expected: 400 Bad Request

Test 5.5: Update category to another user's category
  Expected: 403 Forbidden or 404 Not Found
```

#### Delete Expense Negative Cases

```
Test 6.1: Invalid Expense ID
  Request: DELETE /expenses/invalid-uuid
  Expected: 400 Bad Request

Test 6.2: Expense Not Found
  Request: DELETE /expenses/550e8400-e29b-41d4-a716-446655440000
  Expected: 404 Not Found

Test 6.3: Another User's Expense
  User A creates expense
  User B tries to delete User A's expense
  Expected: 403 Forbidden

Test 6.4: Delete non-existent expense (already deleted)
  Request: DELETE same expense twice
  Expected: 404 Not Found on second delete
```

---

### 3. CATEGORY TESTS

#### Create Category Negative Cases

```
Test 7.1: Missing Category Name
  Request: POST /categories
  Body: { "description": "Food category" }
  Expected: 400 Bad Request
  Error: "Category name is required"

Test 7.2: Duplicate Category Name (same user)
  User creates "Food" category
  User tries to create "Food" category again
  Expected: 409 Conflict
  Error: "Category already exists"

Test 7.3: Category Name Too Long
  Request: POST /categories
  Body: { "name": "<100+ chars>", "description": "..." }
  Expected: 400 Bad Request
  Error: "Category name max 50 characters"

Test 7.4: Category Name Too Short (< 2)
  Request: POST /categories
  Body: { "name": "F" }
  Expected: 400 Bad Request
  Error: "Category name must be at least 2 characters"

Test 7.5: Invalid Color Format
  Request: POST /categories
  Body: { "name": "Food", "color": "invalid-color" }
  Expected: 400 Bad Request
  Error: "Invalid color format (must be hex: #RRGGBB)"

Test 7.6: Missing Color (optional?)
  Request: POST /categories
  Body: { "name": "Food" }
  Expected: 200 OK with default color
```

#### Update Category Negative Cases

```
Test 8.1: Invalid Category ID
  Request: PUT /categories/invalid-uuid
  Expected: 400 Bad Request

Test 8.2: Category Not Found
  Request: PUT /categories/550e8400-e29b-41d4-a716-446655440000
  Expected: 404 Not Found

Test 8.3: Another User's Category
  User A creates category
  User B tries to update User A's category
  Expected: 403 Forbidden

Test 8.4: Update to duplicate name
  User has "Food" category
  Try to rename "Transport" to "Food"
  Expected: 409 Conflict (if unique names required per user)
```

#### Delete Category Negative Cases

```
Test 9.1: Delete Category with Expenses
  Category has 5 expenses
  Try to delete category
  Expected: 400 Bad Request (cascade delete vs prevent)
  Error: "Cannot delete category with expenses" OR auto-cascade delete expenses
  Decision: Clarify behavior

Test 9.2: Another User's Category
  User A creates category
  User B tries to delete User A's category
  Expected: 403 Forbidden
```

---

### 4. DASHBOARD TESTS

#### Query Parameter Tests

```
Test 10.1: Invalid Date Range
  Request: GET /dashboard/trends?startDate=2025-12-31&endDate=2025-12-01
  Expected: 400 Bad Request
  Error: "Start date must be before end date"

Test 10.2: Future Date Range
  Request: GET /dashboard/trends?startDate=2026-01-01&endDate=2026-01-31
  Expected: 200 OK with empty data OR warning

Test 10.3: Invalid Date Format in Query
  Request: GET /dashboard/trends?startDate=31-12-2025
  Expected: 400 Bad Request

Test 10.4: Invalid Category Filter
  Request: GET /dashboard/breakdown?categoryId=invalid-uuid
  Expected: 400 Bad Request

Test 10.5: Another User's Category in Filter
  User A has category
  User B queries: GET /dashboard/breakdown?categoryId=<UserA's categoryId>
  Expected: Empty data (should only get own categories)
```

---

## ✅ POSITIVE TEST SCENARIOS (Happy Path)

### Basic CRUD Flow

```
Scenario: Complete User Journey

1. Register new user
   POST /auth/register
   ✅ User created
   ✅ Can login

2. Login
   POST /auth/login
   ✅ Get JWT token
   ✅ Token valid

3. Create categories
   POST /categories (Food, Transport, Entertainment)
   ✅ 3 categories created

4. Create expenses
   POST /expenses (5 expenses across categories)
   ✅ All expenses created

5. List expenses
   GET /expenses
   ✅ All 5 expenses returned
   ✅ Filters working

6. Update expense
   PUT /expenses/:id
   ✅ Expense updated
   ✅ New data returned

7. Delete expense
   DELETE /expenses/:id
   ✅ Expense deleted
   ✅ GET returns 404 after deletion

8. Dashboard summary
   GET /dashboard/summary
   ✅ Correct totals calculated

9. Dashboard breakdown
   GET /dashboard/breakdown
   ✅ Expenses grouped by category
   ✅ Correct counts

10. Dashboard trends
    GET /dashboard/trends
    ✅ 30-day data returned
    ✅ Daily breakdown correct

11. Logout
    POST /auth/logout (if implemented)
    ✅ Token invalidated
```

---

## 🔒 SECURITY TEST SCENARIOS

```
Test: SQL Injection Attempt
  Request: POST /expenses
  Body: { "description": "'; DROP TABLE expenses; --" }
  Expected: Stored as regular string (Prisma prevents injection)

Test: XSS Attempt
  Request: POST /categories
  Body: { "name": "<script>alert('xss')</script>" }
  Expected: Stored as string (frontend escapes on display)

Test: CSRF Attack
  Expected: Token-based auth prevents this

Test: Rate Limiting
  Send 100 login attempts in 1 second
  Expected: After 10 attempts, get 429 Too Many Requests

Test: Authorization
  User A token to access User B's resources
  Expected: 403 Forbidden
```

---

## 📝 MANUAL TESTING CHECKLIST

### Before Testing:
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Database populated with test data
- [ ] Postman or Insomnia open
- [ ] Browser DevTools open (Network tab)

### During Testing:
- [ ] Note any unexpected behaviors
- [ ] Check HTTP status codes
- [ ] Verify error messages are clear
- [ ] Check response time (< 200ms ideal)
- [ ] Monitor network requests

### After Testing:
- [ ] Document all findings
- [ ] Create GitHub issues for bugs
- [ ] Fix validation gaps
- [ ] Re-test after fixes
- [ ] Commit test results

---

## 📊 TESTING REPORT TEMPLATE

```markdown
# Manual Testing Report - [Date]

## Positive Tests
- [ ] Register: PASS/FAIL
- [ ] Login: PASS/FAIL
- [ ] Create Expense: PASS/FAIL
- [ ] List Expenses: PASS/FAIL
- [ ] Update Expense: PASS/FAIL
- [ ] Delete Expense: PASS/FAIL

## Negative Tests
- [ ] Invalid Email: PASS/FAIL
- [ ] Duplicate Email: PASS/FAIL
- [ ] Wrong Password: PASS/FAIL
- [ ] Negative Amount: PASS/FAIL
- [ ] Missing Fields: PASS/FAIL

## Issues Found
1. Issue: [Description]
   Expected: [What should happen]
   Actual: [What happened]
   Severity: [Critical/High/Medium/Low]

## Fixes Needed
- [ ] Fix 1
- [ ] Fix 2
- [ ] Fix 3
```

---

**Document Status:** ✅ READY FOR MANUAL TESTING  
**Next Step:** Improve backend & frontend validation, then start services
