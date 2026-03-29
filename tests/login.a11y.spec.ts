import { test, expect } from '../src/fixtures/axe-fixtures';
import { scanForViolations, formatViolations, filterByImpact } from '../src/utils/axe-helper';

/**
 * Accessibility tests for the Login page.
 *
 * WCAG success criteria covered:
 * - 1.1.1 Non-text Content (image alt text)
 * - 1.3.1 Info and Relationships (form labels)
 * - 1.4.3 Contrast Minimum (text contrast)
 * - 2.4.7 Focus Visible (keyboard focus indicators)
 * - 4.1.2 Name, Role, Value (form controls)
 */
test.describe('Login Page Accessibility', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('@smoke @wcag2aa Login page passes WCAG 2.1 AA scan', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });

    expect(violations, `Accessibility violations found:\n${formatViolations(violations)}`).toHaveLength(0);
  });

  test('@wcag2a Login page has no critical or serious violations', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa'],
    });

    const highImpact = filterByImpact(violations, 'serious');
    expect(
      highImpact,
      `Serious/critical violations found:\n${formatViolations(highImpact)}`
    ).toHaveLength(0);
  });

  test('@wcag2aa Login form fields have accessible labels', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa'],
      include: 'form',
    });

    expect(violations, `Form accessibility violations:\n${formatViolations(violations)}`).toHaveLength(0);
  });

  test('@wcag2a Login page passes WCAG 2.0 Level A', async ({ page }) => {
    const violations = await scanForViolations(page, {
      levels: ['wcag2a'],
    });

    expect(violations, `WCAG 2.0 A violations:\n${formatViolations(violations)}`).toHaveLength(0);
  });
});
