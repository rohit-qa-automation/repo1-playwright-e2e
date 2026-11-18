import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { USERS, PASSWORD } from '../src/data/users';
import { STORAGE_STATE } from '../playwright.config';

/**
 * Logs in once and saves the session, so the other specs start already
 * logged in instead of repeating the login UI in every test.
 */
setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard, PASSWORD);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: STORAGE_STATE });
});
