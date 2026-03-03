import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and has correct title', async ({ page }) => {
    await page.goto(process.env.E2E_BASE_URL || 'http://localhost:3000');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('preflight');
  });
});
