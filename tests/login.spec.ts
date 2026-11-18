import { test, expect } from '../src/fixtures/test';
import { USERS, PASSWORD } from '../src/data/users';

// Login tests must start logged out, so they ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  const invalidCases = [
    {
      title: 'locked-out user sees a lockout message',
      username: USERS.lockedOut,
      password: PASSWORD,
      error: 'Sorry, this user has been locked out.',
    },
    {
      title: 'wrong password is rejected',
      username: USERS.standard,
      password: 'not-the-password',
      error: 'Username and password do not match any user in this service',
    },
    {
      title: 'empty username is rejected',
      username: '',
      password: PASSWORD,
      error: 'Username is required',
    },
    {
      title: 'empty password is rejected',
      username: USERS.standard,
      password: '',
      error: 'Password is required',
    },
  ];

  for (const c of invalidCases) {
    test(c.title, async ({ loginPage, page }) => {
      await loginPage.login(c.username, c.password);
      await loginPage.expectError(c.error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('user can log out', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await inventoryPage.expectLoaded();
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    // After logout the inventory page must not be reachable directly.
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
