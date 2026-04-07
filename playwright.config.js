const { defineConfig } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

let local = {};
const envFile = path.resolve(__dirname, 'cypress.env.json');
if (fs.existsSync(envFile)) {
  local = JSON.parse(fs.readFileSync(envFile, 'utf8'));
}

process.env.TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || local.testUserEmail || '';
process.env.TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || local.testUserPassword || '';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'https://dev.yes-to-fairplay.com',
    httpCredentials: {
      username: process.env.BASIC_AUTH_USER || local.basicAuthUser || '',
      password: process.env.BASIC_AUTH_PASS || local.basicAuthPass || '',
    },
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 15000,
    navigationTimeout: 45000,
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    {
      name: 'logged-in',
      dependencies: ['setup'],
      use: {
        storageState: '.auth/user.json',
      },
      testIgnore: ['**/auth/**', '**/referral/**'],
    },
    {
      name: 'logged-out',
      testMatch: ['**/auth/**', '**/referral/**'],
    },
  ],
});
