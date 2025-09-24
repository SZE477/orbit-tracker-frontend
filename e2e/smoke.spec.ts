import { test, expect } from '@playwright/test';

test('has title and loads categories', async ({ page }) => {
  await page.goto('http://localhost:5173/explorer');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SatViz/);

  // Expect the main heading to be visible.
  await expect(page.getByRole('heading', { name: 'SatViz' })).toBeVisible();

  // Mock the API response for categories
  await page.route('**/api/categories', async route => {
    const json = [{ id: 1, name: 'Starlink', slug: 'starlink', color: '#ffffff' }];
    await route.fulfill({ json });
  });
  
  // Wait for the category to appear in the sidebar
  await expect(page.getByLabel('Starlink')).toBeVisible({ timeout: 10000 });
});