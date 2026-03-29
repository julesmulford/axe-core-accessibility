import { test, expect } from '../src/fixtures/axe-fixtures';
import { scanForViolations, formatViolations } from '../src/utils/axe-helper';

/**
 * Accessibility tests for interactive form pages.
 *
 * WCAG success criteria covered:
 * - 1.3.1 Info and Relationships (labels, fieldsets)
 * - 1.3.5 Identify Input Purpose (autocomplete)
 * - 2.5.3 Label in Name
 * - 3.3.1 Error Identification
 * - 3.3.2 Labels or Instructions
 * - 4.1.2 Name, Role, Value
 */
test.describe('Forms Accessibility', () => {
  test.beforeEach(async ({ authenticatedPage: _ }) => {});

  test('@smoke @wcag2aa Add Employee form passes WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/web/index.php/pim/addEmployee');
    await page.waitForSelector('.orangehrm-edit-employee-name');

    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      exclude: ['.oxd-toast-container'],
    });

    expect(
      violations,
      `Add Employee form violations:\n${formatViolations(violations)}`
    ).toHaveLength(0);
  });

  test('@wcag2aa Add Employee form fields have correct labels and roles', async ({ page }) => {
    await page.goto('/web/index.php/pim/addEmployee');
    await page.waitForSelector('.orangehrm-edit-employee-name');

    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa'],
      include: '.orangehrm-edit-employee-name',
    });

    expect(
      violations,
      `Employee name form violations:\n${formatViolations(violations)}`
    ).toHaveLength(0);
  });

  test('@wcag2aa Login form validation errors are accessible', async ({ page, loginPage }) => {
    await loginPage.navigate();

    // Submit empty form to trigger validation errors
    await page.click('button[type="submit"]');
    await page.waitForSelector('.oxd-input-field-error-message', { timeout: 3000 });

    const violations = await scanForViolations(page, {
      levels: ['wcag2a', 'wcag2aa'],
      include: 'form',
    });

    expect(
      violations,
      `Form error state violations:\n${formatViolations(violations)}`
    ).toHaveLength(0);
  });

  test('@wcag2a Leave request form passes WCAG 2.0 A', async ({ page }) => {
    await page.goto('/web/index.php/leave/applyLeave');
    await page.waitForLoadState('networkidle');

    const violations = await scanForViolations(page, {
      levels: ['wcag2a'],
      exclude: ['.oxd-toast-container'],
    });

    expect(
      violations,
      `Leave form WCAG 2.0 A violations:\n${formatViolations(violations)}`
    ).toHaveLength(0);
  });
});
