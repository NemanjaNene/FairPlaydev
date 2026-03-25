Cypress.Commands.add('visitDev', (path = '/') => {
  const user = Cypress.env('basicAuthUser');
  const pass = Cypress.env('basicAuthPass');
  cy.visit(path, {
    auth: {
      username: user,
      password: pass
    }
  });
});

Cypress.Commands.add('fillPaymentCardholderName', (name = 'Test User') => {
  cy.contains('Name and Surname of card holder').parent().find('input').clear().type(name);
  cy.wait(500);
});

Cypress.Commands.add('urlShouldIncludePurchaseSuccess', (timeout = 30000) => {
  cy.url({ timeout }).should((url) => {
    const ok =
      url.includes('/successfull-purchase') || url.includes('/successful-purchase');
    expect(ok, `expected URL to include success purchase path, got: ${url}`).to.be.true;
  });
});

Cypress.Commands.add('login', (email, password) => {
  const userEmail = email || Cypress.env('testUserEmail');
  const userPassword = password || Cypress.env('testUserPassword');

  cy.session([userEmail], () => {
    cy.visitDev('/auth');
    cy.wait(2000);
    cy.get('#email').type(userEmail);
    cy.get('input[type="password"]').type(userPassword);
    cy.contains('button', 'LOG IN').click();
    cy.url({ timeout: 15000 }).should('not.include', '/auth');
  });
});
