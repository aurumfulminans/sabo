import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/testHelpers';
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';
import { loadBMITestData } from './utils/testDataLoader';

test.describe('BMI Calculator - Acceptance Criteria #4', () => {
  const testData = loadBMITestData();

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAdBlocking(page);
    const bmiPage = new BmiCalculatorPage(page);
    await bmiPage.goto();
    await TestHelpers.waitForStablePage(page);
  });

  test('should not calculate BMI when height is missing', { tag: ['@regression'] }, async ({ page }) => {
    const bmiPage = new BmiCalculatorPage(page);
    await bmiPage.enterWeight(70);
    await bmiPage.clearHeight();
    
    const isButtonEnabled = await bmiPage.calculateButton.isEnabled();
    if (isButtonEnabled) {
      await bmiPage.clickCalculate();
      await bmiPage.waitForCalculationComplete(false);
      const isResultVisible = await bmiPage.isBmiResultVisible();
      expect(isResultVisible, 'BMI should not be calculated when height is missing').toBe(false);
    } else {
      expect(isButtonEnabled, 'Browser validation should prevent calculation when height is missing').toBe(false);
    }
  });

  test('should not calculate BMI when weight is missing', { tag: ['@regression'] }, async ({ page }) => {
    const bmiPage = new BmiCalculatorPage(page);
    await bmiPage.enterHeight(175);
    await bmiPage.clearWeight();
    await bmiPage.clickCalculate();

    await bmiPage.waitForCalculationComplete(false);

    const isResultVisible = await bmiPage.isBmiResultVisible();
    expect(isResultVisible, 'BMI should not be calculated when weight is missing').toBe(false);
  });

  for (const testCase of testData.testData.invalidInputTests) {
    test(`should handle invalid input: ${testCase.description}`, { tag: ['@regression'] }, async ({ page }) => {
      const bmiPage = new BmiCalculatorPage(page);
      
      await TestHelpers.handlePopups(page);
      
      if (testCase.requiresProgrammatic) {
        await bmiPage.setHeightProgrammatically(testCase.height);
        await bmiPage.setWeightProgrammatically(testCase.weight);
      } else {
        try {
          await bmiPage.heightInput.fill('');
          await bmiPage.weightInput.fill('');
        } catch {
          await bmiPage.setHeightProgrammatically('');
          await bmiPage.setWeightProgrammatically('');
        }
        
        if (testCase.height !== '') await bmiPage.enterHeight(testCase.height as number);
        if (testCase.weight !== '') await bmiPage.enterWeight(testCase.weight as number);
      }

      await page.waitForLoadState('domcontentloaded');
      
      const isButtonEnabled = await bmiPage.calculateButton.isEnabled();
      
      if (isButtonEnabled) {
        await bmiPage.clickCalculate();
        await bmiPage.waitForCalculationComplete(testCase.shouldCalculate === true);

        const isResultVisible = await bmiPage.isBmiResultVisible();
        
        if (testCase.shouldCalculate === false) {
          expect(isResultVisible, `Expected no BMI calculation for: ${testCase.description}`).toBe(false);
        }
      } else {
        expect(isButtonEnabled, `Browser validation should prevent calculation for: ${testCase.description}`).toBe(false);
      }
    });
  }

  if (testData.testData.boundaryTests) {
    for (const testCase of testData.testData.boundaryTests) {
      test(`should NOT calculate BMI for unrealistic values: ${testCase.description}`, { tag: ['@regression'] }, async ({ page }) => {
        const bmiPage = new BmiCalculatorPage(page);
        
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
        await bmiPage.waitForCalculationComplete(false);

        const isResultVisible = await bmiPage.isBmiResultVisible();
        
        // AC #4: App should NOT calculate BMI for unrealistic values
        // This test will fail if app calculates (creates bug report)
        expect(isResultVisible, `App should NOT calculate BMI for ${testCase.description} - this is a bug`).toBe(false);
      });
    }
  }

  const negativeCases = [
    { height: -170, weight: 70, description: 'Negative height' },
    { height: 170, weight: -70, description: 'Negative weight' },
    { height: -170, weight: -70, description: 'Both negative' },
  ];

  for (const testCase of negativeCases) {
    test(`should handle negative BMI case: ${testCase.description}`, { tag: ['@regression'] }, async ({ page }) => {
      const bmiPage = new BmiCalculatorPage(page);
      
      await bmiPage.clearHeight();
      await bmiPage.clearWeight();

      await bmiPage.enterHeight(testCase.height);
      await bmiPage.enterWeight(testCase.weight);
      await bmiPage.clickCalculate();

      await bmiPage.waitForCalculationComplete(false);

      const isResultVisible = await bmiPage.isBmiResultVisible();
      expect(isResultVisible, `BMI should not be calculated for ${testCase.description}`).toBe(false);
      
      const heightValue = await bmiPage.getHeightValue();
      const weightValue = await bmiPage.getWeightValue();
      expect(heightValue, `Height input should contain value: ${testCase.height}`).toBe(String(testCase.height));
      expect(weightValue, `Weight input should contain value: ${testCase.weight}`).toBe(String(testCase.weight));
    });
  }
});
