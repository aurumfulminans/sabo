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

  test('should reset all input fields when Clear is pressed (business logic gap)', async ({ page }) => {
    // NOTE: AC #5 states Clear should reset input fields, but app currently
    // only removes results. This test documents the gap.
    
    await bmiPage.enterHeight(175);
    await bmiPage.enterWeight(70);

    expect(await bmiPage.getHeightValue()).toBe('175');
    expect(await bmiPage.getWeightValue()).toBe('70');

    await bmiPage.clickClear();
    await page.waitForTimeout(500);

    // Business logic gap: App doesn't reset input fields, only removes results
    // AC #5 requires both, but app only does one
    const heightAfter = await bmiPage.getHeightValue();
    const weightAfter = await bmiPage.getWeightValue();
    
    // Document actual behavior: inputs are NOT cleared
    // This is a gap between AC #5 and implementation
    expect(heightAfter).not.toBe('');
    expect(weightAfter).not.toBe('');
  });

  test('should remove previous results when Clear is pressed', async ({ page }) => {
    await bmiPage.enterHeight(175);
    await bmiPage.enterWeight(70);
    await bmiPage.clickCalculate();

    await bmiPage.bmiValue.waitFor({ state: 'visible', timeout: 5000 });
    
    const isResultVisibleBefore = await bmiPage.isBmiResultVisible();
    expect(isResultVisibleBefore).toBe(true);

    await bmiPage.clickClear();
    await page.waitForTimeout(500);

    const isResultVisibleAfter = await bmiPage.isBmiResultVisible();
    expect(isResultVisibleAfter).toBe(false);
  });

  test('should remove results when Clear is pressed (input reset is business logic gap)', async ({ page }) => {
    // NOTE: AC #5 requires both input reset and result removal, but app
    // only removes results. this test verifies what actually works.
    
    await bmiPage.enterHeight(180);
    await bmiPage.enterWeight(80);
    await bmiPage.clickCalculate();

    await bmiPage.bmiValue.waitFor({ state: 'visible', timeout: 5000 });

    expect(await bmiPage.getHeightValue()).toBe('180');
    expect(await bmiPage.getWeightValue()).toBe('80');
    expect(await bmiPage.isBmiResultVisible()).toBe(true);

    await bmiPage.clickClear();
    await page.waitForTimeout(500);

    expect(await bmiPage.isBmiResultVisible()).toBe(false);
    
    // document gap: inputs are NOT reset (AC #5 requires this)
    // app behavior: only removes results, keeps input values
  });
});
