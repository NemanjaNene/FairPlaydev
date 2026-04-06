const { expect } = require('@playwright/test');

async function selectProductTab(page, tabName) {
  const tab = page.getByText(tabName).first();
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
}

async function containsEuroPrice(page, amount) {
  const escaped = String(amount).replace(/\./g, '\\.');
  await expect(page.getByText(new RegExp(`€\\s*${escaped}(?:[^0-9]|$)`))).toBeVisible();
}

async function clickPriceContainingEuros(page, amount, opts = {}) {
  const escaped = String(amount).replace(/\./g, '\\.');
  const locator = page.getByText(new RegExp(`€\\s*${escaped}(?:[^0-9]|$)`));
  if (opts.first) {
    await locator.first().click({ force: true });
  } else {
    await locator.click({ force: true });
  }
}

module.exports = {
  selectProductTab,
  containsEuroPrice,
  clickPriceContainingEuros,
};
