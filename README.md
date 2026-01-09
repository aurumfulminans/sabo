# BMI Calculator – Automation Assignment

This repository contains the specification and user stories for a demo BMI Calculator web app used in QA automation interviews.

## Objective
Implement automated tests verifying that the application behaves according to the stories in [`user-stories.md`](./user-stories.md).

Target app: [https://practice.expandtesting.com/bmi](https://practice.expandtesting.com/bmi)

## Project Setup

This project is pre-configured with **Playwright + TypeScript** for test automation.

### What's Already Configured
✅ **Playwright & TypeScript setup** - Ready to run tests  
✅ **Browser configuration** - Chrome, Firefox, Safari, Mobile  
✅ **Test reporting** - HTML reports, screenshots, videos on failure  
✅ **Ad blocking helper** - Handles popup ads that interfere with tests  

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup Instructions

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

# Run tests with browser UI visible
npm run test:headed

# Interactive test development
npm run test:ui

# Run specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile

# Debug mode (step-by-step)
npm run test:debug

# Show HTML test report
npm run test:report
```

## Project Structure

```
├── tests/                          # Your test files go here
│   └── utils/
│       └── testHelpers.ts          # Ad blocking utility (provided)
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── user-stories.md                 # Requirements to test
```

## Implementation Approach

You have **complete freedom** in how you structure your tests. The only provided utility is `testHelpers.ts` for handling ads.

### Suggested Workflow

1. **Create your first test file**:
   ```bash
   # Example: tests/bmi-calculator.spec.ts
   ```

2. **Use the ad blocking helper** (recommended):
   ```typescript
   import { test, expect } from '@playwright/test';
   import { TestHelpers } from './utils/testHelpers';

   test.beforeEach(async ({ page }) => {
     // Block ads and popups
     await TestHelpers.setupAdBlocking(page);
     
     // Navigate to the app
     await page.goto('https://practice.expandtesting.com/bmi');
     
     // Wait for page stability
     await TestHelpers.waitForStablePage(page);
   });
   ```

3. **Organize as you prefer**:
   - Single test file or multiple files
   - Page Object Model or direct page interactions
   - Custom utilities or inline code
   - Any test data organization

### Key Implementation Notes

**Handle the Calculate Button**: The calculate button uses `onclick="bmical()"`:
```html
<button type="button" class="btn btn-primary" onclick="bmical()">Calculate</button>
```

**Ad Blocking**: The target site has popup ads. Use the provided `TestHelpers`:
- `TestHelpers.setupAdBlocking(page)` - Blocks ad networks
- `TestHelpers.waitForStablePage(page)` - Waits for page stability
- `TestHelpers.handlePopups(page)` - Closes any remaining popups

## Deliverables

1. **Test code** covering the user stories
2. **Clear test organization** and structure
3. **HTML test report** (`npm run test:report`)
4. **At least one failure screenshot** (automatically captured)

## User Stories Coverage

Your tests should verify user story in [`user-stories.md`](./user-stories.md):

1. **Calculate BMI** - Basic calculation, formatting, validation

## Tips for Success

- **Start simple**: Create one basic test to verify your setup works
- **Use debug mode**: `npm run test:debug` for step-by-step troubleshooting
- **Check reports**: HTML reports in `playwright-report/` show detailed results
- **Handle ads**: The provided `TestHelpers` solves the popup interference issue
- **Test thoroughly**: Cover happy paths, error cases, and edge scenarios

## Development Environment

- **Headed mode**: See browser interactions with `npm run test:headed`
- **UI mode**: Interactive test runner with `npm run test:ui`
- **Debug mode**: Step through tests with `npm run test:debug`
- **Auto-screenshots**: Failures automatically capture screenshots and videos

Focus on **correctness**, **code structure**, and **clarity**. Good luck!
