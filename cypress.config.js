const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://dev.yes-to-fairplay.com',

    viewportWidth: 1920,
    viewportHeight: 1080,

    defaultCommandTimeout: 15000,
    pageLoadTimeout: 45000,
    requestTimeout: 15000,

    testIsolation: true,

    retries: {
      runMode: 2,
      openMode: 0
    },

    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,

    chromeWebSecurity: false,

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    env: {
      testUserEmail: process.env.CYPRESS_TEST_USER_EMAIL || '',
      testUserPassword: process.env.CYPRESS_TEST_USER_PASSWORD || '',
      basicAuthUser: process.env.CYPRESS_BASIC_AUTH_USER || '',
      basicAuthPass: process.env.CYPRESS_BASIC_AUTH_PASS || ''
    },

    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(`\n[CYPRESS]: ${message}\n`);
          return null;
        }
      });

      return config;
    }
  }
});
