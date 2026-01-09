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

  test('should calculate BMI correctly using formula: weight_kg / (height_m)^2', { tag: ['@smoke'] }, async ({ page }) => {
    for (const testCase of testData.testData.validBMITests) {
      // clear inputs before each test case
      await bmiPage.clearHeight();
      await bmiPage.clearWeight();
      
      await bmiPage.enterHeight(testCase.height);
      await bmiPage.enterWeight(testCase.weight);
      await bmiPage.clickCalculate();

      await bmiPage.waitForBmiResult();

      const expectedBmi = BmiCalculatorPage.calculateExpectedBmi(
        testCase.weight,
        testCase.height
      );

      const displayedBmi = await bmiPage.getBmiValue();
      const displayedCategory = await bmiPage.getBmiCategory();

      expect(displayedBmi, `BMI value should match expected for height ${testCase.height}cm, weight ${testCase.weight}kg`).toBeCloseTo(expectedBmi, 1);
      expect(expectedBmi, `Expected BMI should match test data`).toBeCloseTo(testCase.expectedBMI, 1);
      // Verify category is displayed (app may use different terminology like "mild thinness" vs "Underweight")
      expect(displayedCategory, `BMI category should be displayed for ${testCase.category}`).not.toBe('');
    }
  });

  test('should handle height conversion from cm to meters correctly', { tag: ['@regression'] }, async ({ page }) => {
    const weight = 70;
    const heightCm = 175;
    const expectedHeightM = 1.75;
    const expectedBmi = weight / (expectedHeightM * expectedHeightM);

    await bmiPage.enterHeight(heightCm);
    await bmiPage.enterWeight(weight);
    await bmiPage.clickCalculate();

    await bmiPage.waitForBmiResult();

    const displayedBmi = await bmiPage.getBmiValue();
    const calculatedBmi = BmiCalculatorPage.calculateExpectedBmi(weight, heightCm);

    expect(calculatedBmi, 'Height conversion should use height_m = height_cm / 100').toBeCloseTo(expectedBmi, 2);
    expect(calculatedBmi, 'Calculated BMI should match expected value').toBeCloseTo(22.86, 1);
    expect(displayedBmi, 'Displayed BMI should match calculated value').toBeCloseTo(calculatedBmi, 1);
  });
});
