const { test, expect } = require('@playwright/test');

test.describe('Flex Product Start/Stop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/services/my-products');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display Flex products in collapsed state', async ({ page }) => {
    await page.waitForTimeout(3000);
    const hasFlexProducts = await page.getByText('FAIRPLAY FLEX').first().isVisible().catch(() => false);
    test.skip(!hasFlexProducts, 'No active Flex products on this profile');

    await expect(page.getByText('ACTIVE PRODUCTS')).toBeVisible();
    await expect(page.getByText('FAIRPLAY FLEX').first()).toBeVisible();
  });

  test('should expand Flex product card and show details', async ({ page }) => {
    await page.waitForTimeout(3000);
    test.skip(!(await page.getByText('FAIRPLAY FLEX').first().isVisible().catch(() => false)), 'No active Flex products');

    await page.getByText('FAIRPLAY FLEX').first().click();

    await expect(page.getByText('Billing Cycle')).toBeVisible();
    await expect(page.getByText('Coverage')).toBeVisible();
    await expect(page.getByText('185+ DESTINATIONS')).toBeVisible();
    await expect(page.getByText('Contract end date')).toBeVisible();
  });

  test('should click STOP and toggle to START', async ({ page }) => {
    await page.waitForTimeout(3000);
    test.skip(!(await page.getByText('FAIRPLAY FLEX').first().isVisible().catch(() => false)), 'No active Flex products');

    await page.getByText('FAIRPLAY FLEX').first().click();

    const stopButton = page.getByRole('button', { name: 'STOP' });
    await stopButton.scrollIntoViewIfNeeded();
    await stopButton.click();

    await expect(page.getByRole('button', { name: 'START' })).toBeVisible({ timeout: 10000 });
  });

  test('should click START and toggle back to STOP', async ({ page }) => {
    await page.waitForTimeout(3000);
    test.skip(!(await page.getByText('FAIRPLAY FLEX').first().isVisible().catch(() => false)), 'No active Flex products');

    await page.getByText('FAIRPLAY FLEX').first().click();

    const startButton = page.getByRole('button', { name: 'START' });
    await startButton.scrollIntoViewIfNeeded();
    await startButton.click();

    await expect(page.getByRole('button', { name: 'STOP' })).toBeVisible({ timeout: 10000 });
  });

  test('should complete full STOP → START cycle', async ({ page }) => {
    await page.waitForTimeout(3000);
    test.skip(!(await page.getByText('FAIRPLAY FLEX').first().isVisible().catch(() => false)), 'No active Flex products');

    await page.getByText('FAIRPLAY FLEX').first().click();

    const stopButton = page.getByRole('button', { name: 'STOP' });
    await stopButton.scrollIntoViewIfNeeded();
    await stopButton.click();

    await expect(page.getByRole('button', { name: 'START' })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'START' }).click();

    await expect(page.getByRole('button', { name: 'STOP' })).toBeVisible({ timeout: 10000 });
  });
});
