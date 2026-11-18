import { test, expect } from '../src/fixtures/test';
import { PRODUCTS } from '../src/data/products';
import { USERS, PASSWORD } from '../src/data/users';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();
  });

  test('sorts products by price, low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts products by price, high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sorts products by name, Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.names();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('adding and removing items updates the cart badge @smoke', async ({ inventoryPage }) => {
    await inventoryPage.expectCartCount(0);
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.onesie.name);
    await inventoryPage.expectCartCount(2);
    await inventoryPage.removeFromCart(PRODUCTS.backpack.name);
    await inventoryPage.expectCartCount(1);
  });

  test('cart contents survive a page reload', async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await page.reload();
    await inventoryPage.expectCartCount(1);
  });
});

test.describe('Known defects', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  // problem_user is a deliberately broken account on the demo site: every
  // product shows the same image. test.fail() documents the bug — the test
  // passes while the bug exists and will flag when it gets fixed.
  test('problem_user sees a distinct image for each product', async ({ loginPage, inventoryPage }) => {
    test.fail(true, 'Known defect: problem_user gets the same image for every product');
    await loginPage.goto();
    await loginPage.login(USERS.problem, PASSWORD);
    await inventoryPage.expectLoaded();
    const sources = await inventoryPage.items
      .locator('img.inventory_item_img')
      .evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).src));
    expect(new Set(sources).size).toBe(sources.length);
  });
});
