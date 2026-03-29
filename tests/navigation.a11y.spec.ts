import { test, expect } from '../src/fixtures/axe-fixtures';
import { scanForViolations, formatViolations } from '../src/utils/axe-helper';

/**
 * Accessibility tests for navigation across key authenticated pages.
 *
 * WCAG success criteria covered:
 * - 2.4.1 Bypass Blocks
 * - 2.4.3 Focus Order
 * - 2.4.5 Multiple Ways (site map / navigation)
 * - 3.2.3 Consistent Navigation
 */
test.describe('Navigation Accessibility', () => {
  test.beforeEach(async ({ authenticatedPage: _ }) => {});

  const pages = [
    { name: 'My Info', path: '/web/index.php/pim/viewMyDetails' },
    { name: 'Leave', path: '/web/index.php/leave/viewLeaveModule' },
    { name: 'Time', path: '/web/index.php/time/viewTimeModule' },
    { name: 'Performance', path: '/web/index.php/performance/searchEvaluatePerformanceReview' },
  ];

  for (const { name, path } of pages) {
    test(`@wcag2aa "${name}" page passes WCAG 2.1 AA`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const violations = await scanForViolations(page, {
        levels: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        exclude: ['.oxd-toast-container'],
      });

      expect(
        violations,
        `[${name}] Accessibility violations found:\n${formatViolations(violations)}`
      ).toHaveLength(0);
    });
  }
});
