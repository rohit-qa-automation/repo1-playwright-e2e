# Playwright E2E Framework: Demo Shop

[![Playwright tests](https://github.com/rohit-qa-automation/repo1-playwright-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/rohit-qa-automation/repo1-playwright-e2e/actions/workflows/playwright.yml)

A production-style **Playwright + TypeScript** end-to-end test suite for [Sauce Demo](https://www.saucedemo.com), a public e-commerce site built for automation practice. It shows how I set up test automation for SaaS teams:

- maintainable code
- fast parallel runs
- accessibility checks
- a CI gate on every pull request

![Test run](docs/demo.gif)

**Live reports:** [Playwright HTML report](https://rohit-qa-automation.github.io/repo1-playwright-e2e/playwright/) · [Allure report](https://rohit-qa-automation.github.io/repo1-playwright-e2e/allure/)

## What's covered

| Area | Tests |
|---|---|
| Login | Valid login, locked-out user, wrong password, empty fields (data-driven), logout + protected-route check |
| Inventory | Sort by price (both ways) and name, cart badge add/remove, cart persists across reload |
| Checkout | Full purchase with **subtotal, 8% tax and total verified**, plus validation for each required field |
| Accessibility | axe-core **WCAG 2.1 AA** scan of the login, inventory and cart pages, with a baseline of known issues |
| Known defects | `problem_user` image bug documented with `test.fail()`, so the suite notices when it gets fixed |

The suite has 19 tests on each browser. It runs on **Chromium locally (about 15 s)** and on **Chromium + Firefox in CI**.

## Design

```
src/
  pages/        Page Object Model (BasePage → Login, Inventory, Cart, Checkout)
  fixtures/     Custom `test` that injects page objects as fixtures
  data/         Users, products, tax rate, accessibility baseline
tests/
  auth.setup.ts Logs in once and saves the session (storageState) for all specs
  *.spec.ts     Specs by feature; tags: @smoke, @a11y
.github/workflows/playwright.yml   CI: 2 browsers × 2 shards, merged reports, GitHub Pages
```

Key choices:
- **`data-test` locators** (`testIdAttribute`) and role-based locators. No brittle CSS or XPath.
- **Login once via a setup project**, so tests start authenticated and stay independent and parallel-safe.
- **Page objects as fixtures**, so specs read like user stories and need no `new Page()` boilerplate.
- **Assertions retry automatically** (web-first `expect`). There are no hard waits anywhere.
- **Traces, screenshots and video kept on failure** for fast debugging in CI.
- **The accessibility baseline** lets you adopt a11y checks on a legacy app without a wall of red: existing issues are tracked, and new ones fail the build.

## Run it

```bash
npm ci
npx playwright install chromium
npm test                 # all tests on Chromium
npm run test:all         # Chromium + Firefox (needs: npx playwright install firefox)
npm run test:smoke       # @smoke only
npm run test:a11y        # accessibility scan only
npm run test:headed      # watch it run in Chromium
npm run report           # open the HTML report
```

Optional: copy `.env.example` to `.env` to point at another environment (`BASE_URL`).

## CI

On every push and pull request to `main`, GitHub Actions:
1. type-checks the code;
2. runs the suite on Chromium and Firefox, each split into 2 shards in parallel;
3. merges the shard results into a single Playwright HTML report and an Allure report;
4. publishes both reports to GitHub Pages (from `main` only).

A weekly scheduled run also catches changes on the demo site.

## Need this for your product?

I set up suites like this for SaaS teams: framework, critical flows, API checks, accessibility and CI, handed over with docs, typically in 7–10 days. <!-- add your Upwork / Contra link here -->
