import { test as base, expect, type Page } from '@playwright/test';

// NOTE:
// This project is a static site. We keep a minimal shared fixture that:
// - Navigates to the dashboard page
// - Clears localStorage to avoid cross-test pollution

export const test = base.extend<{ dashboardPage: Page }>({
  dashboardPage: async ({ page, baseURL }, use) => {
    await page.goto(`${baseURL}/product_release_dashboard/index.html`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await use(page);
  },
});

export { expect };
