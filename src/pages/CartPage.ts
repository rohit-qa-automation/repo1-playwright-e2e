import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async expectItems(names: string[]) {
    await expect(this.items.getByTestId('inventory-item-name')).toHaveText(names);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
