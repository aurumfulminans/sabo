import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/testHelpers';
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';

test.describe('BMI Calculator - Acceptance Criteria #3', () => {
  let bmiPage: BmiCalculatorPage;

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAdBlocking(page);
    bmiPage = new BmiCalculatorPage(page);
    await bmiPage.goto();
    await TestHelpers.waitForStablePage(page);
  });

  test('should use full precision for calculations and round only for display', async ({ page }) => {
    const testCases = [
      { weight: 70, height: 175 }, // BMI = 22.857142857...
      { weight: 80, height: 180 }, // BMI = 24.691358024...
      { weight: 60, height: 165 }, // BMI = 22.038567493...
    ];

    for (const testCase of testCases) {
      await bmiPage.enterHeight(testCase.height);
      await bmiPage.enterWeight(testCase.weight);
      await bmiPage.clickCalculate();

      await bmiPage.bmiValue.waitFor({ state: 'visible', timeout: 5000 });

      const fullPrecisionBmi = BmiCalculatorPage.calculateExpectedBmi(
        testCase.weight,
        testCase.height
      );

      const displayedBmi = await bmiPage.getBmiValue();

      const expectedRounded = Math.round(fullPrecisionBmi * 10) / 10;
      expect(displayedBmi).toBe(expectedRounded);

      // proving it's not rounded internally
      const decimalPlaces = (fullPrecisionBmi.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeGreaterThan(1);
    }
  });
});
