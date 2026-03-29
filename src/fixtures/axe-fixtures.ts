import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';

type AxeFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: void;
};

/**
 * Extended test fixtures that provide pre-built page objects and
 * an authenticated session for tests that need it.
 */
export const test = base.extend<AxeFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.ADMIN_USER ?? 'Admin',
      process.env.ADMIN_PASS ?? 'admin123'
    );
    await use();
  },
});

export { expect } from '@playwright/test';
