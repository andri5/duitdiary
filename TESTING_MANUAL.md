# 🧪 MANUAL TESTING GUIDE & SERVICE SETUP

**Date:** January 1, 2026  
**Status:** Ready for Testing  
**Phase:** Pre-UI Redesign Testing

---

## 🚀 STEP 1: START SERVICES

### Start Backend API

```bash
cd d:\duitdiary\apps\api
npm run dev
```

**Expected Output:**
```
🚀 DuitDiary API Server
Server running on: http://localhost:3000
Database connected: PostgreSQL
Ready for requests
```

### Start Frontend Dev Server

```bash
cd d:\duitdiary\apps\web
npm run dev
```

**Expected Output:**
```
VITE v5.x ready in 405 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Verify Both Services

```bash
# Check backend health
curl http://localhost:3000/api/v1/health

# Check frontend response
curl http://localhost:5173
```

**Status Dashboard:**
```
✅ Backend: http://localhost:3000
✅ Frontend: http://localhost:5173
✅ Both running and connected
```

---

## 🧑‍💼 STEP 2: MANUAL TESTING SCENARIOS

### Test Scenario 1: User Registration

**Test Case 1.1: Valid Registration**
```
Steps:
  1. Go to http://localhost:5173
  2. Click "Sign Up" / "Register"
  3. Enter:
     - Name: "Test User"
     - Email: "testuser@example.com"
     - Password: "SecurePass123!"
     - Confirm Password: "SecurePass123!"
  4. Click Register button

Expected Results:
  ✅ User created successfully
  ✅ Redirected to login page
  ✅ Success toast notification
  ✅ Email must be unique
```

**Test Case 1.2: Invalid Email**
```
Steps:
  1. Enter: email@invalid
  2. Click Register

Expected Results:
  ✅ Show validation error
  ✅ Error message: "Invalid email format"
  ✅ Button disabled until fixed
```

**Test Case 1.3: Weak Password**
```
Steps:
  1. Enter password: "123"
  2. Try to register

Expected Results:
  ✅ Show password strength indicator
  ✅ Error: "Password must be at least 8 characters"
  ✅ Suggest stronger password
```

---

### Test Scenario 2: User Login

**Test Case 2.1: Valid Login**
```
Steps:
  1. Go to Login page
  2. Enter: testuser@example.com / SecurePass123!
  3. Click Login

Expected Results:
  ✅ Successfully logged in
  ✅ Redirected to dashboard
  ✅ User session created
  ✅ Token stored in localStorage
```

**Test Case 2.2: Wrong Password**
```
Steps:
  1. Enter correct email
  2. Enter wrong password
  3. Click Login

Expected Results:
  ✅ Error: "Invalid password"
  ✅ Status 401 Unauthorized
  ✅ Stay on login page
```

**Test Case 2.3: Non-existent User**
```
Steps:
  1. Enter: nonexistent@email.com
  2. Enter any password
  3. Click Login

Expected Results:
  ✅ Error: "User not found" or "Invalid credentials"
  ✅ Status 404 or 401
```

---

### Test Scenario 3: Dashboard

**Test Case 3.1: Dashboard Load**
```
Steps:
  1. Login successfully
  2. Check dashboard page

Expected Results:
  ✅ Summary cards visible
  ✅ Balance shows correct total
  ✅ Recent transactions displayed
  ✅ Charts rendering properly
```

**Test Case 3.2: Period Selection**
```
Steps:
  1. Select "This Month"
  2. Select "This Year"
  3. Select Custom Date Range

Expected Results:
  ✅ Data updates for each period
  ✅ Charts refresh
  ✅ Summary numbers change
  ✅ No loading errors
```

**Test Case 3.3: Dashboard with No Data**
```
Steps:
  1. Login with new user (no expenses)
  2. Check dashboard

Expected Results:
  ✅ Show empty state
  ✅ Show helpful message
  ✅ Provide action button "Add Expense"
```

---

### Test Scenario 4: Expense Management

**Test Case 4.1: Create Expense**
```
Steps:
  1. Click "Add Expense" button
  2. Fill in:
     - Amount: 50000
     - Description: "Lunch meeting"
     - Category: "Food"
     - Date: 2025-12-31
  3. Click Submit

Expected Results:
  ✅ Expense created
  ✅ Modal closes
  ✅ Success notification
  ✅ Expense appears in list
  ✅ Dashboard updates
```

**Test Case 4.2: Edit Expense**
```
Steps:
  1. Click Edit on an expense
  2. Change amount: 75000
  3. Click Update

Expected Results:
  ✅ Expense updated
  ✅ List refreshes
  ✅ Dashboard recalculates
  ✅ Success notification
```

**Test Case 4.3: Delete Expense**
```
Steps:
  1. Click Delete on an expense
  2. Confirm deletion

Expected Results:
  ✅ Show confirmation dialog
  ✅ Expense removed from list
  ✅ Dashboard updates
  ✅ Success notification
  ✅ Option to undo (ideal)
```

**Test Case 4.4: Filter Expenses**
```
Steps:
  1. Filter by Category: "Food"
  2. Filter by Date Range: "This Month"
  3. Filter by Amount: Min 10000, Max 100000

Expected Results:
  ✅ List updates for each filter
  ✅ Counts shown
  ✅ Filters can be combined
  ✅ "Clear Filters" button works
```

**Test Case 4.5: Search Expenses**
```
Steps:
  1. Type in search: "lunch"
  2. Type in search: "coffee"

Expected Results:
  ✅ Results filtered in real-time
  ✅ Highlights matching text
  ✅ Case-insensitive search
  ✅ Search by description & category
```

---

### Test Scenario 5: Category Management

**Test Case 5.1: Create Category**
```
Steps:
  1. Go to Categories page
  2. Click "Add Category"
  3. Fill in:
     - Name: "Entertainment"
     - Description: "Movies, concerts, etc"
     - Color: #FF6B6B
  4. Click Create

Expected Results:
  ✅ Category created
  ✅ Appears in list
  ✅ Color applied correctly
  ✅ Success notification
```

**Test Case 5.2: Edit Category**
```
Steps:
  1. Click Edit on a category
  2. Change: Name → "Movies & Entertainment"
  3. Click Update

Expected Results:
  ✅ Category updated
  ✅ Name reflects change
  ✅ Color preserved
```

**Test Case 5.3: Delete Category (with expenses)**
```
Steps:
  1. Create category with expenses
  2. Try to delete category

Expected Results:
  ✅ Error: "Cannot delete - has expenses"
  ✅ Show related expenses
  ✅ Suggestion: "Move expenses first"
```

**Test Case 5.4: Delete Category (empty)**
```
Steps:
  1. Create empty category
  2. Delete it

Expected Results:
  ✅ Show confirmation
  ✅ Category deleted
  ✅ Success notification
```

---

### Test Scenario 6: Error Handling

**Test Case 6.1: Network Error**
```
Steps:
  1. Stop backend API
  2. Try to load dashboard

Expected Results:
  ✅ Show error message
  ✅ Provide retry option
  ✅ Don't crash the app
```

**Test Case 6.2: Invalid Input**
```
Steps:
  1. Try to create expense with:
     - Empty amount
     - Invalid date
     - Missing category

Expected Results:
  ✅ Show validation errors
  ✅ Highlight invalid fields
  ✅ Helpful error messages
  ✅ Clear how to fix
```

**Test Case 6.3: Session Timeout**
```
Steps:
  1. Login
  2. Wait for token expiry
  3. Try to access protected page

Expected Results:
  ✅ Show session expired message
  ✅ Redirect to login
  ✅ Option to login again
```

---

### Test Scenario 7: Responsive Design

**Test Case 7.1: Mobile View (< 768px)**
```
Steps:
  1. Open DevTools (F12)
  2. Set to iPhone 12 size
  3. Navigate through pages

Expected Results:
  ✅ Layout responds correctly
  ✅ Touch targets >= 44px
  ✅ Text readable without zooming
  ✅ No horizontal scroll
  ✅ Buttons easily clickable
```

**Test Case 7.2: Tablet View (768px - 1024px)**
```
Steps:
  1. Set to iPad size
  2. Check page layouts

Expected Results:
  ✅ Optimal use of space
  ✅ Two-column layouts work
  ✅ Sidebar visible
```

**Test Case 7.3: Desktop View (> 1024px)**
```
Steps:
  1. Full-screen browser
  2. Maximize window

Expected Results:
  ✅ Layouts fully optimized
  ✅ Whitespace balanced
  ✅ Charts large enough
```

---

### Test Scenario 8: Performance

**Test Case 8.1: Page Load Speed**
```
Steps:
  1. Open DevTools Network tab
  2. Hard refresh (Ctrl+Shift+R)
  3. Measure load time

Expected Results:
  ✅ First Contentful Paint: < 2s
  ✅ Total load: < 4s
  ✅ No errors in console
```

**Test Case 8.2: Large Data Set**
```
Steps:
  1. Create 100+ expenses
  2. Load expenses page
  3. Filter/search

Expected Results:
  ✅ Page loads smoothly
  ✅ No lag in filtering
  ✅ Pagination works
  ✅ Search performs well
```

---

## 📋 TEST LOG TEMPLATE

Create a test log for tracking:

```markdown
# Test Log - [Date]

## Test Session: [Session Name]

### Test Case: [1.1 Valid Registration]
- **Status:** ✅ PASS / ❌ FAIL
- **Time:** 14:30
- **Notes:** User created successfully
- **Issues:** None

### Test Case: [1.2 Invalid Email]
- **Status:** ❌ FAIL
- **Time:** 14:35
- **Notes:** Error message shows "Invalid email format"
- **Issues:** 
  - [ ] Error message unclear
  - [ ] Button not disabling
- **Fix:** Update validation message

...

## Summary
- Total Tests: 30
- Passed: 28
- Failed: 2
- Pass Rate: 93%

## Issues Found
1. [ISSUE] - [Description] - [Priority: High/Medium/Low]
```

---

## 🔍 TESTING CHECKLIST

### Before Testing
- [ ] Both services running
- [ ] No console errors
- [ ] Database connected
- [ ] Network available

### During Testing
- [ ] Follow each test case step-by-step
- [ ] Record results in test log
- [ ] Take screenshots of failures
- [ ] Note browser/OS version
- [ ] Document any unexpected behavior

### After Testing
- [ ] Review all failures
- [ ] Create bug reports for each failure
- [ ] Prioritize fixes (High/Medium/Low)
- [ ] Retest fixes before UI redesign

---

## 📊 TESTING METRICS

Track these metrics:

```
Test Execution:
  - Total Test Cases: 30
  - Passed: ?
  - Failed: ?
  - Pass Rate: ?%
  
Quality:
  - Critical Issues: ?
  - Major Issues: ?
  - Minor Issues: ?
  
Coverage:
  - Auth Pages: ? %
  - Dashboard: ? %
  - CRUD Operations: ? %
  - Error Handling: ? %
```

---

## 🐛 BUG REPORT TEMPLATE

If you find bugs:

```markdown
## Bug: [Title]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Screenshots:**
[Add screenshot]

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop

**Notes:**
Any additional information
```

---

## ✅ SIGN-OFF

After completing all manual tests:

```
Testing Status: [⏳ In Progress / ✅ Complete]

Total Test Cases: 30
Passed: __
Failed: __
Pass Rate: __

Critical Issues: __
Major Issues: __
Minor Issues: __

Ready for UI Redesign: [YES / NO]

Tester Name: ___________
Date: ___________
```

---

## 🚀 NEXT STEPS

After manual testing:

1. ✅ Document all findings
2. ✅ Fix critical/major issues
3. ✅ Retest fixes
4. ✅ Create REDESIGN_UI.md (DONE ✓)
5. ⏳ Get UI redesign approval
6. ⏳ Start UI redesign coding

---

**Status:** Ready for Manual Testing  
**Services Setup:** Complete  
**Awaiting:** Test Results & Feedback
