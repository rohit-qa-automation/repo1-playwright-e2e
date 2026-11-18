import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';

export const STORAGE_STATE = '.auth/standard_user.json';
const isCI = !!process.env.CI;
// Local runs use Chromium only for speed; CI (or ALL_BROWSERS=1) adds Firefox.
const allBrowsers = isCI || process.env.ALL_BROWSERS === '1';

const reporter: PlaywrightTestConfig['reporter'] = isCI
  ? [
      ['blob'], // merged into one HTML report by the CI "report" job
      ['github'], // inline failure annotations on the pull request
      ['list'],
      ['allure-playwright', { resultsDir: 'allure-results' }],
    ]
  : [
      ['list'],
      ['html', { open: 'never' }],
      ['allure-playwright', { resultsDir: 'allure-results' }],
    ];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    ...(allBrowsers
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
            dependencies: ['setup'],
          },
        ]
      : []),
  ],
});
