const { expect } = require('@playwright/test');

async function selectProductTab(page, tabName) {
  const tab = page.getByRole('tab', { name: tabName });
  await tab.waitFor({ state: 'visible', timeout: 10000 });

  await tab.evaluate(node => node.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(500);

  await tab.click();
  await page.waitForTimeout(2000);
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
