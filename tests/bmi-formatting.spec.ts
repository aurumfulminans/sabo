import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/testHelpers';
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';

test.describe('BMI Calculator - Acceptance Criteria #2', () => {
  let bmiPage: BmiCalculatorPage;

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAdBlocking(page);
    bmiPage = new BmiCalculatorPage(page);
    await bmiPage.goto();
    await TestHelpers.waitForStablePage(page);
  });

  test('should display BMI with one decimal place', async ({ page }) => {
    const testCases = [
      { weight: 70, height: 175 },
      { weight: 80, height: 180 },
      { weight: 60, height: 165 },
      { weight: 90, height: 190 },
      { weight: 50, height: 150 },
    ];

    for (const testCase of testCases) {
      await bmiPage.enterHeight(testCase.height);
      await bmiPage.enterWeight(testCase.weight);
      await bmiPage.clickCalculate();

      await bmiPage.bmiValue.waitFor({ state: 'visible', timeout: 5000 });

      const bmiText = await bmiPage.getBmiText();
      const formatMatch = bmiText.match(/Your BMI is (\d+)\.(\d) kg\/m2/);
      expect(formatMatch, `BMI should be displayed with one decimal place: ${bmiText}`).not.toBeNull();
      expect(bmiText).toContain('kg/m2');
    }
  });
});
