import { test, expect } from '../fixtures';
import { DeleteReleaseNotePage } from '../pages/DeleteReleaseNotePage';
import { DeleteReleaseNoteData as D } from '../data/delete-release-note.data';
import { getLocalStorageItem } from '../utils/helpers';

test.describe('CS-20 Delete release note with confirmation', () => {
  test('Confirming deletion removes the release note from the UI list', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    const titleToDelete = D.seedReleases[0].title;

    const beforeTitles = await page.getCardTitles();
    expect(beforeTitles).toContain(titleToDelete);

    dashboardPage.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.deleteButtonForTitle(titleToDelete).click();

    await expect(page.cardByTitle(titleToDelete)).toHaveCount(0);
  });

  test('Confirming deletion persists removal to localStorage and survives refresh', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    const titleToDelete = D.seedReleases[0].title;

    dashboardPage.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.deleteButtonForTitle(titleToDelete).click();

    const raw = await getLocalStorageItem(dashboardPage, D.storageKey);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string) as Array<{ id: string; title: string }>;
    expect(parsed.some((r) => r.title === titleToDelete)).toBe(false);

    await dashboardPage.reload();
    await expect(page.cardByTitle(titleToDelete)).toHaveCount(0);
  });

  test('Canceling deletion makes no changes to UI or localStorage', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    const titleToDelete = D.seedReleases[0].title;

    const beforeRaw = await getLocalStorageItem(dashboardPage, D.storageKey);
    const beforeTitles = await page.getCardTitles();

    dashboardPage.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();
    });

    await page.deleteBtttonForTitle(titleToDelete).click();

    const afterRaw = await getLocalStorageItem(dashboardPage, D.storageKey);
    const afterTitles = await page.getCardTitles();

    expect(afterRaw).toBe(beforeRaw);
    expect(afterTitles).toEqual(beforeTitles);
  });

  test('Deleting the last remaining release note shows the empty-state message', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, [D.seedReleases[0]]);

    const titleToDelete = D.seedReleases[0].title;

    dashboardPage.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.deleteButtonForTitle(titleToDelete).click();

    await expect.poll(async () => await page.isEmptyStateVisible()).toBe(true);
  });

  test('Deleting while product filter is active updates the list and keeps filter value', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    await page.setProductFilter(D.filters.productBilling);

    const titles = await page.getCardTitles();
    expect(titles.length).toBe(1);
    expect(titles[0]).toBe(D.seedReleases[0].title);

    dashboardPage.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.deleteButtonForTitle(D.seedReleases[0].title).click();

    expect(await dashboardPage.locator('#product-filter').inputValue()).toBe(D.filters.productBilling);
    await expect.poll(async () => await page.isEmptyStateVisible()).toBe(true);
  });

  test('Deleting while breaking-only filter is active updates the list and keeps filter value', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleasesBreakingOnly);

    await page.setBreakingFilter(D.filters.breakingOnlyValue);

    const titles = await page.getCardTitles();
    expect(titles.length).toBe(q);
    expect(titles[0]).toBe(D.seedReleases[1].title);

    dashboardPage.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.deleteBtttonForTitle(D.seedReleases[1].title).click();

    expect(await dashboardPage.locator('#breaking-filter').inputValue()).toBe(D.filters.breakingOnlyValue);
    await expect.poll(async () => await page.isEmptyStateVisible()).toBe(true);
  });
});
