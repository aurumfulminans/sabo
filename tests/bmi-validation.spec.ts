import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/testHelpers';
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';
import { loadBMITestData } from './utils/testDataLoader';

test.describe('BMI Calculator - Acceptance Criteria #4', () => {
  let bmiPage: BmiCalculatorPage;
  const testData = loadBMITestData();

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAdBlocking(page);
    bmiPage = new BmiCalculatorPage(page);
    await bmiPage.goto();
    await TestHelpers.waitForStablePage(page);
  });

  test('should not calculate BMI when height is missing', { tag: ['@regression'] }, async ({ page }) => {
    await bmiPage.enterWeight(70);
    await bmiPage.clearHeight();
    
    // Browser validation may prevent clicking, so we check if button is enabled
    const isButtonEnabled = await bmiPage.calculateButton.isEnabled();
    if (isButtonEnabled) {
      await bmiPage.clickCalculate();
      await bmiPage.waitForCalculationComplete(false);
      const isResultVisible = await bmiPage.isBmiResultVisible();
      expect(isResultVisible, 'BMI should not be calculated when height is missing').toBe(false);
    } else {
      // Browser validation prevents clicking - this is expected behavior
      expect(isButtonEnabled, 'Browser validation should prevent calculation when height is missing').toBe(false);
    }
  });

  test('should not calculate BMI when weight is missing', { tag: ['@regression'] }, async ({ page }) => {
    await bmiPage.enterHeight(175);
    await bmiPage.clearWeight();
    await bmiPage.clickCalculate();

    await bmiPage.waitForCalculationComplete(false);

    const isResultVisible = await bmiPage.isBmiResultVisible();
    expect(isResultVisible, 'BMI should not be calculated when weight is missing').toBe(false);
  });

  test('should handle invalid inputs from dataset', { tag: ['@regression'] }, async ({ page }) => {
    for (const testCase of testData.testData.invalidInputTests) {
      // Ensure page is still valid, reload if needed
      try {
        await page.url();
      } catch {
        await bmiPage.goto();
        await TestHelpers.waitForStablePage(page);
      }
      
      // Handle popups that might appear
      await TestHelpers.handlePopups(page);
      
      // Use fill with empty string to clear, then set new values
      if (testCase.requiresProgrammatic) {
        await bmiPage.setHeightProgrammatically(testCase.height);
        await bmiPage.setWeightProgrammatically(testCase.weight);
      } else {
        // Clear first
        try {
          await bmiPage.heightInput.fill('');
          await bmiPage.weightInput.fill('');
        } catch {
          // If fill fails, try programmatic
          await bmiPage.setHeightProgrammatically('');
          await bmiPage.setWeightProgrammatically('');
        }
        
        if (testCase.height !== '') await bmiPage.enterHeight(testCase.height as number);
        if (testCase.weight !== '') await bmiPage.enterWeight(testCase.weight as number);
      }

      // Wait a moment for inputs to settle
      await page.waitForLoadState('domcontentloaded');
      
      // Check if button is enabled (browser validation may disable it)
      const isButtonEnabled = await bmiPage.calculateButton.isEnabled();
      
      if (isButtonEnabled) {
        await bmiPage.clickCalculate();
        await bmiPage.waitForCalculationComplete(testCase.shouldCalculate === true);

        const isResultVisible = await bmiPage.isBmiResultVisible();
        
        if (testCase.shouldCalculate === false) {
          expect(isResultVisible, `Expected no BMI calculation for: ${testCase.description}`).toBe(false);
        }
      } else {
        // Browser validation prevents clicking - this is expected for invalid inputs
        expect(isButtonEnabled, `Browser validation should prevent calculation for: ${testCase.description}`).toBe(false);
      }
    }
  });

  test('should document business logic gap for unrealistic values', { tag: ['@regression'] }, async ({ page }) => {
    if (!testData.testData.boundaryTests) return;

    for (const testCase of testData.testData.boundaryTests) {
      await bmiPage.clearHeight();
      await bmiPage.clearWeight();

      if (testCase.requiresProgrammatic) {
        await bmiPage.setHeightProgrammatically(testCase.height);
        await bmiPage.setWeightProgrammatically(testCase.weight);
      } else {
        await bmiPage.enterHeight(testCase.height as number);
        await bmiPage.enterWeight(testCase.weight as number);
      }

      await bmiPage.clickCalculate();
      await bmiPage.waitForCalculationComplete(true);

      const isResultVisible = await bmiPage.isBmiResultVisible();
      
      if (testCase.shouldCalculate === true) {
        expect(isResultVisible, `Business logic gap: App calculates BMI for ${testCase.description}`).toBe(true);
      }
    }
  });

  test('should handle negative BMI cases', { tag: ['@regression'] }, async ({ page }) => {
    const negativeCases = [
      { height: -170, weight: 70, description: 'Negative height' },
      { height: 170, weight: -70, description: 'Negative weight' },
      { height: -170, weight: -70, description: 'Both negative' },
    ];

    for (const testCase of negativeCases) {
      await bmiPage.clearHeight();
      await bmiPage.clearWeight();

      await bmiPage.enterHeight(testCase.height);
      await bmiPage.enterWeight(testCase.weight);
      await bmiPage.clickCalculate();

      await bmiPage.waitForCalculationComplete(false);

      const isResultVisible = await bmiPage.isBmiResultVisible();
      expect(isResultVisible, `BMI should not be calculated for ${testCase.description}`).toBe(false);
      
      // Verify inputs are still present (negative values are valid for number inputs)
      const heightValue = await bmiPage.getHeightValue();
      const weightValue = await bmiPage.getWeightValue();
      expect(heightValue, `Height input should contain value: ${testCase.height}`).toBe(String(testCase.height));
      expect(weightValue, `Weight input should contain value: ${testCase.weight}`).toBe(String(testCase.weight));
    }
  });
});
