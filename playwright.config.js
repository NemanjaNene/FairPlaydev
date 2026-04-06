const { defineConfig } = require('@playwright/test');

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
      username: process.env.BASIC_AUTH_USER || '',
      password: process.env.BASIC_AUTH_PASS || '',
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
