import { Page } from '@playwright/test';

/**
 * Page object for the OrangeHRM Dashboard.
 */
export class DashboardPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/dashboard/index');
    await this.page.waitForSelector('.oxd-topbar-header');
  }

  async navigateToMenu(menuItem: string): Promise<void> {
    await this.page.click(`.oxd-nav-item:has-text("${menuItem}")`);
    await this.page.waitForLoadState('networkidle');
  }
}
