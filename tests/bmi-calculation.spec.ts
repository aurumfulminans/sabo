import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/testHelpers';
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';
import { loadBMITestData } from './utils/testDataLoader';

test.describe('BMI Calculator - Acceptance Criteria #1', () => {
  let bmiPage: BmiCalculatorPage;
  const testData = loadBMITestData();

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAdBlocking(page);
    bmiPage = new BmiCalculatorPage(page);
    await bmiPage.goto();
    await TestHelpers.waitForStablePage(page);
  });

  test('should calculate BMI correctly using formula: weight_kg / (height_m)^2', async ({ page }) => {
    for (const testCase of testData.testData.validBMITests) {
      // clear inputs before each test case
      await bmiPage.clearHeight();
      await bmiPage.clearWeight();
      
      await bmiPage.enterHeight(testCase.height);
      await bmiPage.enterWeight(testCase.weight);
      await bmiPage.clickCalculate();

      await bmiPage.bmiValue.waitFor({ state: 'visible', timeout: 5000 });

      const expectedBmi = BmiCalculatorPage.calculateExpectedBmi(
        testCase.weight,
        testCase.height
      );

      const displayedBmi = await bmiPage.getBmiValue();

      // verify the calculated BMI matches expected (allowing for rounding)
      expect(displayedBmi).toBeCloseTo(expectedBmi, 1);
      expect(expectedBmi).toBeCloseTo(testCase.expectedBMI, 1);
    }
  });

  test('should handle height conversion from cm to meters correctly', async ({ page }) => {
    const weight = 70;
    const heightCm = 175;
    const expectedHeightM = 1.75;
    const expectedBmi = weight / (expectedHeightM * expectedHeightM);

    await bmiPage.enterHeight(heightCm);
    await bmiPage.enterWeight(weight);
    await bmiPage.clickCalculate();

    await bmiPage.bmiValue.waitFor({ state: 'visible', timeout: 5000 });

    const displayedBmi = await bmiPage.getBmiValue();
    const calculatedBmi = BmiCalculatorPage.calculateExpectedBmi(weight, heightCm);

    expect(calculatedBmi).toBeCloseTo(expectedBmi, 2);
    expect(calculatedBmi).toBeCloseTo(22.86, 1);
    expect(displayedBmi).toBeCloseTo(calculatedBmi, 1);
  });
});
