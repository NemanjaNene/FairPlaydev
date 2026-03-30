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

Cypress.Commands.add('clickPriceContainingEuros', (amount, options = {}) => {
  const escaped = String(amount).replace(/\./g, '\\.');
  const pattern = new RegExp(`€\\s*${escaped}(?:[^0-9]|$)`);
  const chain = cy.contains(pattern);
  if (options.first) {
    chain.first().click({ force: true });
  } else {
    chain.click({ force: true });
  }
});

Cypress.Commands.add('containsEuroPrice', (amount) => {
  const escaped = String(amount).replace(/\./g, '\\.');
  cy.contains(new RegExp(`€\\s*${escaped}(?:[^0-9]|$)`)).should('exist');
});

Cypress.Commands.add('fillPaymentCardholderName', (name = 'Test User') => {
  cy.contains('Name and Surname of card holder').parent().find('input').clear().type(name);
  cy.wait(500);
});

Cypress.Commands.add('fillPaymentDetails', (opts = {}) => {
  const { name = 'Test User', ...cardOpts } = opts;
  cy.fillPaymentTestCard(cardOpts);
  cy.fillPaymentCardholderName(name);
});

Cypress.Commands.add('fillPaymentTestCard', (opts = {}) => {
  const number = String(opts.number || '4242424242424242').replace(/\s/g, '');
  const cvv = opts.cvv || '123';
  const rawExpiry = opts.expiry || '12/34';
  const expiryForDom =
    opts.expiryDisplay || (String(rawExpiry).includes('/') ? String(rawExpiry) : '12/34');
  const expiryDigits = String(rawExpiry).replace(/\D/g, '');

  cy.get('body', { timeout: 20000 }).then(($body) => {
    const stripeCount = $body.find('iframe[src*="js.stripe.com"]').length;
    if (stripeCount > 0) {
      cy.fillStripeTestCard({ ...opts, expiry: expiryDigits });
    } else {
      cy.contains('Card number', { timeout: 10000 })
        .parent()
        .find('input')
        .filter(':visible')
        .first()
        .clear({ force: true })
        .type(number, { force: true });
      cy.contains('Expiry date')
        .parent()
        .find('input')
        .filter(':visible')
        .first()
        .clear({ force: true })
        .type(expiryForDom, { force: true });

      cy.get('body')
        .find('input:visible')
        .then(($inputs) => {
          const el = $inputs
            .filter((i, input) => {
              const a = (input.getAttribute('autocomplete') || '').toLowerCase();
              const n = (input.getAttribute('name') || '').toLowerCase();
              return a.includes('cvc') || a.includes('csc') || n.includes('cvc');
            })
            .get(0);
          if (el) {
            cy.wrap(el).clear({ force: true }).type(cvv, { force: true });
          }
        });
    }
  });
});

Cypress.Commands.add('fillStripeTestCard', (opts = {}) => {
  const number = String(opts.number || '4242424242424242').replace(/\s/g, '');
  const expiry = String(opts.expiry || '1234').replace(/\D/g, '');
  const cvv = opts.cvv || '123';

  const typeInIframe = (index, value) => {
    // Stripe often mounts iframes with visibility:hidden; they are still used for input.
    cy.get('iframe[src*="js.stripe.com"]', { timeout: 20000 })
      .eq(index)
      .should('exist')
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

Cypress.Commands.add('clickPayNow', () => {
  // Move focus away from card field so the card-number info tooltip does not block clicks.
  cy.contains('ORDER SUMMARY', { timeout: 10000 }).click({ force: true });
  cy.contains('button', 'PAY NOW', { timeout: 30000 })
    .should('be.visible')
    .scrollIntoView()
    .should('not.be.disabled')
    .click({ force: true });
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
    cy.get('input[type="email"]').filter(':visible').first().clear().type(userEmail);
    cy.get('input[type="password"]').filter(':visible').first().type(userPassword);
    cy.contains('button', 'LOG IN').click();
    cy.url({ timeout: 15000 }).should('not.include', '/auth');
  });
});
