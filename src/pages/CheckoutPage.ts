import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Covers the three checkout screens: information, overview and complete. */
export class CheckoutPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(info: Partial<CustomerInfo>) {
    if (info.firstName !== undefined) await this.firstName.fill(info.firstName);
    if (info.lastName !== undefined) await this.lastName.fill(info.lastName);
    if (info.postalCode !== undefined) await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  /** Reads amounts such as "Item total: $12.34" from the overview labels. */
  private async amount(locator: Locator): Promise<number> {
    const text = (await locator.textContent()) ?? '';
    const match = text.match(/\$([\d.]+)/);
    if (!match) throw new Error(`No amount found in "${text}"`);
    return Number(match[1]);
  }

  async totals() {
    return {
      subtotal: await this.amount(this.subtotal),
      tax: await this.amount(this.tax),
      total: await this.amount(this.total),
    };
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectComplete() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectError(message: string | RegExp) {
    await expect(this.error).toContainText(message);
  }
}
