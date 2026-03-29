# axe-core-accessibility

Accessibility test suite using Playwright + axe-core — WCAG 2.0/2.1/2.2 automated checks against OrangeHRM Demo with HTML reporting and CI/CD.

Accessibility testing suite using `@axe-core/playwright` and Playwright Test. Demonstrates enterprise patterns: WCAG level parameterisation, impact-based filtering, region-scoped scanning, reusable axe helper utilities, and structured failure messages that link directly to WCAG documentation.

## Tech Stack

| Component      | Technology                            |
|----------------|---------------------------------------|
| Test Runner    | Playwright Test 1.44+                 |
| Accessibility  | @axe-core/playwright 4.10             |
| Language       | TypeScript 5.4                        |
| Linting        | ESLint + @typescript-eslint           |
| Formatting     | Prettier                              |
| Target         | OrangeHRM Demo (opensource-demo.orangehrmlive.com) |
| CI             | GitHub Actions                        |

## Project Structure

```
axe-core-accessibility/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── fixtures/
│   │   └── axe-fixtures.ts       # Extended test fixtures (page objects, auth)
│   ├── pages/
│   │   ├── login-page.ts         # Login page object
│   │   └── dashboard-page.ts     # Dashboard page object
│   └── utils/
│       └── axe-helper.ts         # scanForViolations, formatViolations, filterByImpact
├── tests/
│   ├── login.a11y.spec.ts        # Login page WCAG checks
│   ├── dashboard.a11y.spec.ts    # Dashboard WCAG checks (authenticated)
│   ├── navigation.a11y.spec.ts   # Key pages: My Info, Leave, Time, Performance
│   └── forms.a11y.spec.ts        # Add Employee, Leave Request forms
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .eslintrc.json
├── .prettierrc
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- `npm 10+` (bundled with Node.js)

## Setup

```bash
npm ci
npx playwright install --with-deps chromium
```

## Running Tests

```bash
# All tests
npm test

# Smoke tests only (@smoke tag)
npm run test:smoke

# WCAG 2.0 A checks only
npm run test:wcag2a

# WCAG 2.1 AA checks only
npm run test:wcag2aa

# Run headed (visible browser)
npm run test:headed

# Open HTML report
npm run report
```

## Test Tags

Each test is tagged with the relevant scope:

| Tag | Meaning |
|-----|---------|
| `@smoke` | Critical path — included in smoke CI gate |
| `@wcag2a` | WCAG 2.0 Level A checks |
| `@wcag2aa` | WCAG 2.1 Level AA checks (includes 2.0 A) |

## Test Coverage

| Spec | Page | Tags | Key Criteria |
|------|------|------|-------------|
| `login.a11y.spec.ts` | Login | `@smoke @wcag2a @wcag2aa` | Form labels, contrast, focus, 4.1.2 |
| `dashboard.a11y.spec.ts` | Dashboard | `@smoke @wcag2a @wcag2aa` | Landmarks, navigation, headings |
| `navigation.a11y.spec.ts` | My Info, Leave, Time, Performance | `@wcag2aa` | 2.4.1, 2.4.3, 3.2.3 |
| `forms.a11y.spec.ts` | Add Employee, Leave, Error states | `@smoke @wcag2a @wcag2aa` | 3.3.1, 3.3.2, 1.3.1, 4.1.2 |

## axe-helper Utilities

```typescript
import { scanForViolations, formatViolations, filterByImpact } from './src/utils/axe-helper';

// Full page scan at WCAG 2.1 AA
const violations = await scanForViolations(page, {
  levels: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  exclude: ['.cookie-banner'],
});

// Only serious/critical violations
const highImpact = filterByImpact(violations, 'serious');

// Readable failure message with WCAG help links
console.log(formatViolations(violations));
```

## Failure Output

When violations are found, the test failure message includes:

```
1. [CRITICAL] color-contrast — Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds
   Affected nodes: 3
   Help: https://dequeuniversity.com/rules/axe/4.10/color-contrast

2. [SERIOUS] label — Ensures every form element has a label
   Affected nodes: 1
   Help: https://dequeuniversity.com/rules/axe/4.10/label
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://opensource-demo.orangehrmlive.com` | Target application URL |
| `ADMIN_USER` | `Admin` | Login username |
| `ADMIN_PASS` | `admin123` | Login password |

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **Lint** — ESLint check on all TypeScript files
2. **Smoke tests** — `@smoke`-tagged tests on Chromium
3. **Full WCAG 2.1 AA suite** — all tests on Chromium (runs after smoke passes)
4. Uploads Playwright HTML report and JSON results as artifacts
