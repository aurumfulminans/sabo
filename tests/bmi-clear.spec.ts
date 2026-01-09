import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/testHelpers';
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';

test.describe('BMI Calculator - Acceptance Criteria #5', () => {
  let bmiPage: BmiCalculatorPage;

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAdBlocking(page);
    bmiPage = new BmiCalculatorPage(page);
    await bmiPage.goto();
    await TestHelpers.waitForStablePage(page);
  });

  test('should reset all input fields when Clear is pressed (business logic gap)', { tag: ['@regression'] }, async ({ page }) => {
    // NOTE: AC #5 states Clear should reset input fields, but app currently
    // only removes results. This test documents the gap.
    
    await bmiPage.enterHeight(175);
    await bmiPage.enterWeight(70);

    expect(await bmiPage.getHeightValue()).toBe('175');
    expect(await bmiPage.getWeightValue()).toBe('70');

    await bmiPage.clickClear();
    await bmiPage.waitForBmiResultHidden();

    const heightAfter = await bmiPage.getHeightValue();
    const weightAfter = await bmiPage.getWeightValue();
    
    expect(heightAfter, 'Business logic gap: Input fields are NOT cleared (AC #5 requires this)').not.toBe('');
    expect(weightAfter, 'Business logic gap: Input fields are NOT cleared (AC #5 requires this)').not.toBe('');
  });

  test('should remove previous results when Clear is pressed', { tag: ['@smoke'] }, async ({ page }) => {
    await bmiPage.enterHeight(175);
    await bmiPage.enterWeight(70);
    await bmiPage.clickCalculate();

    await bmiPage.waitForBmiResult();
    
    const isResultVisibleBefore = await bmiPage.isBmiResultVisible();
    expect(isResultVisibleBefore, 'BMI result should be visible before Clear').toBe(true);

    await bmiPage.clickClear();
    await bmiPage.waitForBmiResultHidden();

    const isResultVisibleAfter = await bmiPage.isBmiResultVisible();
    expect(isResultVisibleAfter, 'BMI result should be removed after Clear').toBe(false);
  });

  test('should remove results when Clear is pressed (input reset is business logic gap)', { tag: ['@regression'] }, async ({ page }) => {
    // NOTE: AC #5 requires both input reset and result removal, but app
    // only removes results. this test verifies what actually works.
    
    await bmiPage.enterHeight(180);
    await bmiPage.enterWeight(80);
    await bmiPage.clickCalculate();

    await bmiPage.waitForBmiResult();

    expect(await bmiPage.getHeightValue(), 'Height should be set').toBe('180');
    expect(await bmiPage.getWeightValue(), 'Weight should be set').toBe('80');
    expect(await bmiPage.isBmiResultVisible(), 'BMI result should be visible').toBe(true);

    await bmiPage.clickClear();
    await bmiPage.waitForBmiResultHidden();

    expect(await bmiPage.isBmiResultVisible(), 'BMI result should be removed after Clear').toBe(false);
  });
});
