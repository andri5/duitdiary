# 🚀 Quick Start Guide - Running Playwright Tests

## Prerequisites
```bash
# Navigate to web app directory
cd d:\duitdiary\apps\web

# Ensure dependencies are installed
npm install
```

---

## Starting the Development Server

```bash
# Terminal 1: Start dev server
npm run dev
# App will be available at http://localhost:5173
```

---

## Running Tests (Terminal 2)

### 1. **Run All Tests** (Headless)
```bash
npm test
```
- Runs all 98 test cases
- Tests run in background (no browser visible)
- Faster execution
- Perfect for CI/CD pipelines

---

### 2. **Run Tests with UI Dashboard** (Recommended for development)
```bash
npm run test:ui
```
- Opens interactive UI dashboard
- See tests as they run
- Filter by status (passed/failed)
- Replay failed tests
- Perfect for debugging

---

### 3. **Run Tests in Browser** (Headed mode)
```bash
npm run test:headed
```
- Browser window opens showing test execution
- See exactly what's happening on screen
- Slower but more visual
- Great for understanding test behavior

---

### 4. **Debug Mode** (Step through tests)
```bash
npm run test:debug
```
- Opens Playwright Inspector
- Step through tests line by line
- Set breakpoints
- Inspect DOM and elements
- Perfect for fixing failing tests

---

## Running Specific Test Suites

### CRUD Operations (12 tests)
```bash
npm test -- tests/crud.spec.ts
```
Tests: Auth, Categories, Expenses create/read/update/delete

### Component Interactions (15 tests)
```bash
npm test -- tests/interactions.spec.ts
```
Tests: Buttons, Forms, Modals, Navigation, Filters

### Animation Performance (11 tests)
```bash
npm test -- tests/animations.spec.ts
```
Tests: FPS, Smoothness, Memory, Response times

### Responsive Layouts (13 tests)
```bash
npm test -- tests/responsive.spec.ts
```
Tests: Mobile, Tablet, Desktop, Breakpoints

### Accessibility (24 tests)
```bash
npm test -- tests/accessibility.spec.ts
```
Tests: Keyboard, ARIA, Contrast, Focus management

### QA & Polish (23 tests)
```bash
npm test -- tests/qa.spec.ts
```
Tests: Errors, Edge cases, Regression, Data integrity

---

## Running Specific Individual Tests

```bash
# Run single test by name
npm test -- -g "TC-001"
npm test -- -g "User Registration"
npm test -- -g "Button Click Handler"

# Run tests matching pattern
npm test -- -g "CRUD"
npm test -- -g "Responsive"
```

---

## Test Report & Results

### After Running Tests
- **HTML Report:** Automatically generated in `playwright-report/`
- **View Report:** `npx playwright show-report`

### Report Contents
- ✅ Passed tests (green)
- ❌ Failed tests (red) with screenshots
- ⏭️ Skipped tests
- Timing for each test
- Screenshots on failure

---

## Common Issues & Fixes

### Tests Fail: "Target page, context or browser has been closed"
**Solution:** Make sure dev server is running in Terminal 1
```bash
npm run dev
```

### Tests Timeout: "Timeout 30000ms exceeded"
**Solution:** Backend might be slow. Increase timeout in playwright.config.ts
```typescript
timeout: 60000, // 60 seconds
```

### Playwright Not Found
**Solution:** Reinstall dependencies
```bash
npm install --save-dev @playwright/test
```

### Tests Pass Locally But Fail in CI
**Solution:** Run in CI mode
```bash
CI=true npm test
```

---

## Continuous Integration (CI) Setup

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test

- name: Upload report
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## Performance Tips

### Make Tests Faster
1. **Run in parallel:** Already enabled in config
2. **Reduce number of retries:** Set `retries: 0` in config
3. **Use headless mode:** `npm test` (faster than `npm run test:headed`)

### Debug Slow Tests
```bash
npm run test:debug
# Then step through slowly to find the issue
```

---

## Test Configuration

### File: `playwright.config.ts`

Key settings:
```typescript
{
  testDir: './tests',           // Where tests are located
  fullyParallel: true,          // Run tests in parallel
  retries: 2,                   // Retry failed tests
  workers: undefined,           // Auto-detect worker count
  baseURL: 'http://localhost:5173',  // Dev server URL
  timeout: 30000,               // Test timeout (30 seconds)
}
```

---

## Environment Variables

### Set in Terminal
```bash
# Windows PowerShell
$env:CI = "true"
npm test

# Windows CMD
set CI=true
npm test
```

---

## Test Results Summary

**Total Tests:** 98  
**Estimated Runtime:** ~10-15 minutes (full suite)

### By Category
- CRUD: 12 tests (~2 min)
- Interactions: 15 tests (~2 min)
- Performance: 11 tests (~2 min)
- Responsive: 13 tests (~2 min)
- Accessibility: 24 tests (~3 min)
- QA: 23 tests (~3 min)

---

## Next Steps

1. **Run full test suite:** `npm run test:ui`
2. **Review results:** Check which tests pass/fail
3. **Fix failures:** Debug with `npm run test:debug`
4. **Add more tests:** Follow test pattern in existing files
5. **Integrate to CI:** Add to GitHub Actions/GitLab CI

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Best Practices](https://playwright.dev/docs/intro)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Config Reference](https://playwright.dev/docs/test-configuration)

---

**Generated:** December 31, 2025  
**DuitDiary Testing Framework - Complete Setup**
