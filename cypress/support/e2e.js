import './commands';

function stripRefersionLocalStorage(win) {
  try {
    Object.keys(win.localStorage)
      .filter((key) => key.startsWith('rfsn_v4_'))
      .forEach((key) => win.localStorage.removeItem(key));
  } catch {
    /* ignore (e.g. storage unavailable) */
  }
}

beforeEach(() => {
  cy.clearCookie('affiliateCode');
  cy.window().then(stripRefersionLocalStorage);
});

Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Minified React error') ||
    err.message.includes('#418') ||
    err.message.includes('#423') ||
    err.message.includes('hydrat')
  ) {
    return false;
  }
});
