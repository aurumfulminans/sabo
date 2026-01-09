import { Page, Locator } from '@playwright/test';

export class BmiCalculatorPage {
  readonly page: Page;
  readonly heightInput: Locator;
  readonly weightInput: Locator;
  readonly calculateButton: Locator;
  readonly reportSection: Locator;
  readonly bmiValue: Locator;
  readonly clearButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heightInput = page.locator('#height');
    this.weightInput = page.locator('#weight');
    this.calculateButton = page.getByRole('button', { name: 'Calculate' });
    
    this.reportSection = page
      .getByRole('heading', { name: 'Report' })
      .locator('..');
    
    this.bmiValue = page.locator('text=/Your BMI is \\d+\\.?\\d*/');
    // Category will be extracted from BMI result text
    
    this.clearButton = page.locator('button:has-text("Clear"), button[onclick*="clear" i]').first();
    
    this.errorMessage = page.locator('.alert, .error, [role="alert"], .text-danger, .invalid-feedback').first();
  }

  async goto() {
    await this.page.goto('https://practice.expandtesting.com/bmi');
  }

  async enterHeight(heightCm: number | string) {
    await this.heightInput.fill(String(heightCm));
  }

  async enterWeight(weightKg: number | string) {
    await this.weightInput.fill(String(weightKg));
  }

  async clickCalculate() {
    await this.calculateButton.click();
  }

  async clickClear() {
    await this.clearButton.click();
  }

  async getBmiText(): Promise<string> {
    return await this.bmiValue.textContent() || '';
  }

  async getBmiValue(): Promise<number> {
    const text = await this.getBmiText();
    const match = text.match(/Your BMI is (\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getBmiCategory(): Promise<string> {
    // Extract category from BMI result text like "Your BMI is 24.2 kg/m2 (Normal)"
    const text = await this.getBmiText();
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
  }

  async getHeightValue(): Promise<string> {
    return await this.heightInput.inputValue();
  }

  async getWeightValue(): Promise<string> {
    return await this.weightInput.inputValue();
  }

  async getResultText(): Promise<string> {
    return await this.reportSection.textContent() || '';
  }

  async isBmiResultVisible(): Promise<boolean> {
    try {
      await this.bmiValue.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForBmiResult(): Promise<void> {
    await this.bmiValue.waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForBmiResultHidden(): Promise<void> {
    await this.bmiValue.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async waitForCalculationComplete(shouldHaveResult: boolean = true): Promise<void> {
    if (shouldHaveResult) {
      await this.waitForBmiResult();
    } else {
      await this.waitForBmiResultHidden();
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      const error = await this.errorMessage.textContent();
      return error || '';
    } catch {
      return '';
    }
  }

  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  async clearHeight() {
    try {
      // Try standard clear first
      await this.heightInput.clear();
    } catch {
      // If that fails, use programmatic clearing for required number inputs
      try {
        await this.setHeightProgrammatically('');
      } catch {
        // Page might be closed, ignore
      }
    }
  }

  async clearWeight() {
    try {
      // Try standard clear first
      await this.weightInput.clear();
    } catch {
      // If that fails, use programmatic clearing for required number inputs
      try {
        await this.setWeightProgrammatically('');
      } catch {
        // Page might be closed, ignore
      }
    }
  }

  async setHeightProgrammatically(value: string | number) {
    try {
      await this.page.evaluate(
        ({ selector, value }) => {
          const input = document.querySelector(selector) as HTMLInputElement;
          if (input) {
            input.value = String(value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        },
        { selector: '#height', value }
      );
    } catch (error) {
      // Page might be closed or in invalid state
      console.log('Failed to set height programmatically:', error);
    }
  }

  async setWeightProgrammatically(value: string | number) {
    try {
      await this.page.evaluate(
        ({ selector, value }) => {
          const input = document.querySelector(selector) as HTMLInputElement;
          if (input) {
            input.value = String(value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        },
        { selector: '#weight', value }
      );
    } catch (error) {
      // Page might be closed or in invalid state
      console.log('Failed to set weight programmatically:', error);
    }
  }

  static calculateExpectedBmi(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }
}
