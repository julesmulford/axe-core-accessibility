import { Page } from '@playwright/test';

/**
 * Page object for the OrangeHRM login screen.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await this.page.waitForSelector('input[name="username"]');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('**/dashboard**');
  }
}
