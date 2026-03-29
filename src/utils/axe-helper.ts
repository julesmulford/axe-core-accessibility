import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';

export type WcagLevel = 'wcag2a' | 'wcag2aa' | 'wcag21a' | 'wcag21aa' | 'wcag22aa';

export interface AxeScanOptions {
  /** WCAG conformance levels to check. Defaults to WCAG 2.1 AA. */
  levels?: WcagLevel[];
  /** CSS selectors for regions to exclude from the scan. */
  exclude?: string[];
  /** CSS selector to restrict the scan to a specific region. */
  include?: string;
  /** axe-core rule IDs to disable for this scan. */
  disabledRules?: string[];
}

export interface ViolationSummary {
  id: string;
  impact: string | null;
  description: string;
  nodes: number;
  helpUrl: string;
}

/**
 * Run an axe accessibility scan against the current page state.
 *
 * @returns Array of violations. An empty array means the scan passed.
 */
export async function scanForViolations(
  page: Page,
  options: AxeScanOptions = {}
): Promise<ViolationSummary[]> {
  const { levels = ['wcag2a', 'wcag2aa'], exclude = [], include, disabledRules = [] } = options;

  let builder = new AxeBuilder({ page }).withTags(levels);

  if (include) {
    builder = builder.include(include);
  }

  for (const selector of exclude) {
    builder = builder.exclude(selector);
  }

  if (disabledRules.length > 0) {
    builder = builder.disableRules(disabledRules);
  }

  const results = await builder.analyze();

  return results.violations.map((v) => ({
    id: v.id,
    impact: v.impact ?? null,
    description: v.description,
    nodes: v.nodes.length,
    helpUrl: v.helpUrl,
  }));
}

/**
 * Format violations into a readable string for test failure messages.
 */
export function formatViolations(violations: ViolationSummary[]): string {
  if (violations.length === 0) return 'No violations found.';

  return violations
    .map(
      (v, i) =>
        `${i + 1}. [${v.impact?.toUpperCase() ?? 'UNKNOWN'}] ${v.id} — ${v.description}\n` +
        `   Affected nodes: ${v.nodes}\n` +
        `   Help: ${v.helpUrl}`
    )
    .join('\n\n');
}

/**
 * Filter violations by impact level.
 */
export function filterByImpact(
  violations: ViolationSummary[],
  minImpact: 'minor' | 'moderate' | 'serious' | 'critical'
): ViolationSummary[] {
  const impactOrder: Record<string, number> = {
    minor: 1,
    moderate: 2,
    serious: 3,
    critical: 4,
  };
  const threshold = impactOrder[minImpact] ?? 1;
  return violations.filter((v) => impactOrder[v.impact ?? 'minor'] >= threshold);
}
