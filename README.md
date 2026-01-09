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
- 12 unique test scenarios
- 60 total tests (across 5 browser configurations)
- Edge cases: zero, negative, empty, non-numeric, unrealistic values
- All tests passing in Firefox

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

### Business Logic Gaps

1. **AC #4 - Unrealistic Values**
   - **Requirement**: Should not calculate BMI for unrealistic values (e.g., 10cm, 500kg)
   - **Actual Behavior**: App calculates BMI for all numeric inputs
   - **Status**: Documented in tests, gap between requirements and implementation

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
