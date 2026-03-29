import { test, expect } from '../src/fixtures/axe-fixtures';
import { scanForViolations, formatViolations, filterByImpact } from '../src/utils/axe-helper';

/**
 * Accessibility tests for the Dashboard — authenticated area.
 *
 * WCAG success criteria covered:
 * - 1.3.1 Info and Relationships (navigation landmarks)
 * - 2.1.1 Keyboard (all functionality accessible via keyboard)
 * - 2.4.1 Bypass Blocks (skip navigation links)
 * - 2.4.2 Page Titled (meaningful page title)
 * - 2.4.6 Headings and Labels
 * - 4.1.1 Parsing (valid HTML)
 */
test.describe('Dashboard Accessibility', () => {
  test.use({ storageState: undefined });

  test.beforeEach(async ({ authenticatedPage: _ }) => {
    // authenticatedPage fixture handles login
  });

  test('@smoke @wcag2aa Dashboard passes WCAG 2.1 AA scan', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      exclude: ['.oxd-toast-container'],
    });

    expect(violations, `Accessibility violations found:\n${formatViolations(violations)}`).toHaveLength(0);
  });

  test('@wcag2a Dashboard has no critical or serious violations', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa'],
      exclude: ['.oxd-toast-container'],
    });

    const highImpact = filterByImpact(violations, 'serious');
    expect(
      highImpact,
      `Serious/critical violations:\n${formatViolations(highImpact)}`
    ).toHaveLength(0);
  });

  test('@wcag2aa Navigation landmarks are correctly defined', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa'],
      include: '.oxd-sidepanel',
    });

    expect(violations, `Navigation landmark violations:\n${formatViolations(violations)}`).toHaveLength(0);
  });

  test('@wcag2aa Main content area is accessible', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa'],
      include: '.oxd-layout-container',
      exclude: ['.oxd-toast-container'],
    });

    expect(violations, `Main content violations:\n${formatViolations(violations)}`).toHaveLength(0);
  });
});
