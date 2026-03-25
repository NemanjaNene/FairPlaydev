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

Cypress.Commands.add('fillStripeTestCard', (opts = {}) => {
  const number = opts.number || '4242424242424242';
  const expiry = String(opts.expiry || '1234').replace(/\D/g, '');
  const cvv = opts.cvv || '123';

  const typeInIframe = (index, value) => {
    cy.get('iframe[src*="js.stripe.com"]', { timeout: 20000 })
      .eq(index)
      .should('be.visible')
      .then(($iframe) => {
        const doc = $iframe[0].contentDocument;
        expect(doc, 'Stripe iframe document').not.to.be.null;
        const input = doc.querySelector('input');
        expect(input, 'Stripe iframe input').not.to.be.null;
        cy.wrap(input)
          .click({ force: true })
          .clear({ force: true })
          .type(value, { force: true });
      });
  };

  cy.get('iframe[src*="js.stripe.com"]', { timeout: 20000 }).then(($iframes) => {
    expect($iframes.length, 'Stripe iframe count').to.be.at.least(1);
    if ($iframes.length >= 3) {
      typeInIframe(0, number);
      typeInIframe(1, expiry);
      typeInIframe(2, cvv);
    } else {
      typeInIframe(0, number);
      if ($iframes.length > 1) typeInIframe(1, expiry);
      if ($iframes.length > 2) typeInIframe(2, cvv);
    }
  });
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
