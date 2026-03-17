import './commands';

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
