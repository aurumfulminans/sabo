# BMI Calculator – Automation Assignment

Automated test suite for BMI Calculator web application using Playwright and TypeScript.

Target app: [https://practice.expandtesting.com/bmi](https://practice.expandtesting.com/bmi)

## What's Implemented

✅ **All 5 Acceptance Criteria Covered**
- AC #1: BMI calculation formula verification
- AC #2: One decimal place display format
- AC #3: Full precision calculations with display rounding
- AC #4: Input validation (missing, non-numeric, unrealistic values)
- AC #5: Clear button functionality

✅ **Test Coverage**
- 31 passing tests (4 failing as expected - bug reports)
- 35 total tests in Firefox
- Edge cases: zero, negative, empty, non-numeric, unrealistic values
- Each test case is isolated for better reporting and debugging

**Why Firefox?**
Tests are verified in Firefox due to macOS compatibility. The test suite supports all configured browsers (Chromium, Firefox, WebKit, Mobile), but Firefox was chosen as the primary testing browser for verification. All browsers can be run using the commands below.



## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install browser binaries**:
   ```bash
   npx playwright install
   ```

3. **Verify setup** (optional):
   ```bash
   npx playwright test --list
   ```

## Available Commands

```bash
# Run all tests
npm test

# Run specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile

# Run with browser UI visible
npm run test:headed

# Interactive test development
npm run test:ui

# Debug mode (step-by-step)
npm run test:debug

# Show HTML test report
npm run test:report
```

## Test Data

Test data is centralized in `tests/fixtures/bmi-test-data.json`:
- **validBMITests**: 4 test cases with expected BMI and categories
- **invalidInputTests**: 8 edge cases (zero, negative, empty, non-numeric)
- **boundaryTests**: 4 unrealistic value cases

## Known Issues

### Business Logic Gaps (Bug Reports)

1. **AC #4 - Unrealistic Values** **4 Tests Failing**
   - **Requirement**: Should not calculate BMI for unrealistic values (e.g., 10cm, 500kg)
   - **Actual Behavior**: App calculates BMI for all numeric inputs
   - **Test Status**: Tests fail as expected, creating bug reports
   - **Failures**: Unrealistic height (too low/high), unrealistic weight (too low/high)
   - **Note**: These failures are intentional - tests correctly identify application bugs

2. **AC #5 - Clear Button**
   - **Requirement**: Should reset both input fields and remove results
   - **Actual Behavior**: Only removes results, input fields remain unchanged
   - **Status**: Documented in tests, gap between requirements and implementation

### Platform Compatibility

1. **Chromium on macOS 11.x (Big Sur)**
   - **Issue**: Chromium requires macOS 12+ (Monterey or later)
   - **Error**: Missing `LocalAuthenticationEmbeddedUI.framework` framework
   - **Workaround**: Used Firefox or WebKit instead

### Technical Notes

- Non-numeric inputs require programmatic assignment (browser blocks typing into `type="number"` inputs)
- Tests use `page.evaluate()` to bypass browser validation for edge case testing
- All gaps are clearly documented in test code with comments

## Code Quality Improvements (10 minutes on Sunday)

The test suite follows Playwright best practices:

**Stability (Phase 1)**
- Removed all `waitForTimeout()` calls - replaced with state-based waits
- Tests use explicit assertions instead of fixed delays

**Selectors (Phase 2)**
- Removed `.first()` calls that masked multiple matches
- Using semantic selectors (`getByRole`, `[role="alert"]`)
- More precise locators for better reliability

**Test Structure (Phase 2)**
- Each test case is isolated (35 individual tests vs. loops inside tests)
- Better test reporting - can see exactly which case failed
- Uses Playwright's standard loop-to-create-tests pattern