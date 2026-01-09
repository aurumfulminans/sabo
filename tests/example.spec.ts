import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/testHelpers';

test.describe('BMI Calculator', () => {
  test.beforeEach(async ({ page }) => {
    // Set up ad blocking to prevent popup interference
    await TestHelpers.setupAdBlocking(page);
    
    // Navigate to the BMI calculator
    await page.goto('https://practice.expandtesting.com/bmi');
    
    // Wait for page to be stable
    await TestHelpers.waitForStablePage(page);
  });

  test('example - basic page load', async ({ page }) => {
    // Example test to verify the page loads correctly
    // TODO: Replace with your actual test implementation
    
    // Verify the page title or main heading
    await expect(page).toHaveTitle(/BMI/i);
    
    // Check that key form elements are present
    const heightInput = page.locator('#height, input[placeholder*="height" i]').first();
    const weightInput = page.locator('#weight, input[placeholder*="weight" i]').first();
    const calculateButton = page.locator('button[onclick="bmical()"], button:has-text("Calculate")').first();
    
    await expect(heightInput).toBeVisible();
    await expect(weightInput).toBeVisible();
    await expect(calculateButton).toBeVisible();
  });

  // TODO: Add your test implementations here
  // Examples:
  // - test('should calculate BMI correctly', async ({ page }) => { ... });
  // - test('should show error for invalid input', async ({ page }) => { ... });
  // - test('should clear form when Clear button is clicked', async ({ page }) => { ... });
});