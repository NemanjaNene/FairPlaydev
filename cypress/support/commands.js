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
