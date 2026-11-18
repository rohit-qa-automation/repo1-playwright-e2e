import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../src/fixtures/test';
import { PRODUCTS } from '../src/data/products';
import { KNOWN_A11Y_ISSUES } from '../src/data/a11y-baseline';

/**
 * WCAG 2.1 A/AA scan with axe-core on the key pages.
 *
 * - The full axe result is attached to every test (see the HTML/Allure report).
 * - The test fails on any critical or serious violation that is NOT in the
 *   documented baseline (src/data/a11y-baseline.ts), so existing issues are
 *   tracked while new regressions break the build.
 */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const pages = [
  { name: 'login', path: '/', loggedIn: false },
  { name: 'inventory', path: '/inventory.html', loggedIn: true },
  { name: 'cart', path: '/cart.html', loggedIn: true, addItem: true },
] as const;

for (const p of pages) {
  test.describe(`Accessibility: ${p.name} page`, () => {
    if (!p.loggedIn) test.use({ storageState: { cookies: [], origins: [] } });

    test(`${p.name} page has no new serious WCAG 2.1 AA violations @a11y`, async ({
      page,
      inventoryPage,
    }, testInfo) => {
      if ('addItem' in p && p.addItem) {
        await inventoryPage.goto();
        await inventoryPage.addToCart(PRODUCTS.backpack.name);
      }
      await page.goto(p.path);

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      await testInfo.attach(`axe-${p.name}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

      const known = KNOWN_A11Y_ISSUES[p.name] ?? [];
      const blocking = results.violations
        .filter((v) => v.impact === 'critical' || v.impact === 'serious')
        .filter((v) => !known.includes(v.id))
        .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} element(s)`);

      expect(blocking, 'New serious accessibility violations').toEqual([]);
    });
  });
}
