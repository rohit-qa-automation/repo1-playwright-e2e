import { test, expect } from '../src/fixtures/test';
import { PRODUCTS, TAX_RATE } from '../src/data/products';
import { CUSTOMER } from '../src/data/users';

const round2 = (n: number) => Math.round(n * 100) / 100;

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('customer can buy two items and totals are correct @smoke', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const basket = [PRODUCTS.backpack, PRODUCTS.fleeceJacket];
    for (const p of basket) await inventoryPage.addToCart(p.name);

    await inventoryPage.openCart();
    await cartPage.expectItems(basket.map((p) => p.name));
    await cartPage.checkout();

    await checkoutPage.fillInformation(CUSTOMER);

    const expectedSubtotal = round2(basket.reduce((sum, p) => sum + p.price, 0));
    const expectedTax = round2(expectedSubtotal * TAX_RATE);
    const totals = await checkoutPage.totals();
    expect(totals.subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(totals.tax).toBeCloseTo(expectedTax, 2);
    expect(totals.total).toBeCloseTo(expectedSubtotal + expectedTax, 2);

    await checkoutPage.finish();
    await checkoutPage.expectComplete();
    await checkoutPage.expectCartCount(0);
  });

  const missingFields = [
    { field: 'first name', info: { ...CUSTOMER, firstName: '' }, error: 'First Name is required' },
    { field: 'last name', info: { ...CUSTOMER, lastName: '' }, error: 'Last Name is required' },
    { field: 'postal code', info: { ...CUSTOMER, postalCode: '' }, error: 'Postal Code is required' },
  ];

  for (const m of missingFields) {
    test(`checkout is blocked when ${m.field} is missing`, async ({
      inventoryPage,
      cartPage,
      checkoutPage,
      page,
    }) => {
      await inventoryPage.addToCart(PRODUCTS.onesie.name);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutPage.fillInformation(m.info);
      await checkoutPage.expectError(m.error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
