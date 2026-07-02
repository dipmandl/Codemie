import type { Page } from '@playwright/test';

export async function setLocalStorageItem(page: Page, key: string, value: string) {
  await page.evaluate(
    ([k, v]) => {
      localStorage.setItem(k, v);
    },
    [key, value] as const
  );
}

export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((k) => localStorage.getItem(k), key);
}
