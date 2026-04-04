import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Pulse Analytics');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login.*/);
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth or use demo mode
    await page.goto('/dashboard');
  });

  test('dashboard loads with KPI cards', async ({ page }) => {
    await expect(page.locator('text=Organic Reach')).toBeVisible();
    await expect(page.locator('text=Paid / Boosted')).toBeVisible();
  });

  test('sidebar navigation works', async ({ page }) => {
    await page.click('text=Post Analytics');
    await expect(page).toHaveURL(/.*posts.*/);
  });
});

test.describe('Posts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts');
  });

  test('posts table loads', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });

  test('search filters posts', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'test');
    await page.waitForTimeout(300);
    // Table should update based on search
  });
});

test.describe('Settings', () => {
  test('platforms page loads', async ({ page }) => {
    await page.goto('/settings/platforms');
    await expect(page.locator('h1')).toContainText('Platforms');
  });

  test('connected accounts page toggles social and ad account lists', async ({ page }) => {
    await page.goto('/settings/accounts');
    await expect(page.getByRole('tab', { name: 'Social profiles' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: 'Instagram Business' })).toBeVisible();
    await page.getByRole('tab', { name: 'Ad accounts' }).click();
    await expect(page.getByRole('tab', { name: 'Ad accounts' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: 'Meta Ads' })).toBeVisible();
  });
});
