import { test, expect } from '../fixtures';
import { EditReleaseNotePage } from '../pages/EditReleaseNotePage';
import { EditReleaseNoteData as D } from '../data/edit-release-note.data';
import { getLocalStorageItem } from '../utils/helpers';

test.describe('COD-7 Edit release note', () => {
  test('Edit opens form in edit mode with pre-filled values', async ({ dashboardPage }) => {
    const page = new EditReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    await page.clickEditForReleaseId('r1');

    await expect.poll(async () => await page.isInEditMode()).toBe(true);

    const values = await page.getFormValues();
    expect(values.product).toBe(D.seedReleases[0].product);
    expect(values.version).toBe(D.seedReleases[0].version);
    expect(values.title).toBe(D.seedReleases[0].title);
    expect(values.description).toBe(D.seedReleases[0].description);
    expect(values.releaseDate).toBe(D.seedReleases[0].releaseDate);
    expect(values.isBreaking).toBe(D.seedReleases[0].isBreaking);
  });

  test('Save updates the correct release (by id) and persists to localStorage', async ({ dashboardPage }) => {
    const page = new EditReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    await page.clickEditForReleaseId('r1');
    await page.updateTitle(D.updates.title);
    await page.updateDescription(D.updates.description);
    await page.saveChanges();

    const titles = await page.getCardTitles();
    expect(titles).toContain(D.updates.title);

    const raw = await getLocalStorageItem(dashboardPage, D.storageKey);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string) as Array<{ id: string; title: string; description: string }>;
    const updated = parsed.find((r) => r.id === 'r1');
    expect(updated?.title).toBe(D.updates.title);
    expect(updated?.description).toBe(D.updates.description);

    await expect.poll(async () => await page.isInEditMode()).toBe(false);
  });

  test('Cancel exits edit mode without saving changes', async ({ dashboardPage }) => {
    const page = new EditReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    const before = await getLocalStorageItem(dashboardPage, D.storageKey);

    await page.clickEditForReleaseId('r1');
    await page.updateTitle(D.updates.title);
    await page.cancelEdit();

    const after = await getLocalStorageItem(dashboardPage, D.storageKey);
    expect(after).toBe(before);

    const titles = await page.getCardTitles();
    expect(titles).toContain(D.seedReleases[0].title);
    expect(titles).not.toContain(D.updates.title);
  });

  test('Filters remain applied after save', async ({ dashboardPage }) => {
    const page = new EditReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    await page.setProductFilter(D.filters.productBilling);
    await page.clickEditForReleaseId('r1');
    await page.updateTitle(D.updates.title);
    await page.saveChanges();

    expect(await page.getProductFilterValue()).toBe(D.filters.productBilling);
    const titles = await page.getCardTitles();
    expect(titles.length).toBe(1);
    expect(titles[0]).toBe(D.updates.title);
  });

  test('Filters remain applied after cancel', async ({ dashboardPage }) => {
    const page = new EditReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    await page.setBreakingFilter(D.filters.breakingOnly);
    await page.clickEditForReleaseId('r2');
    await page.cancelEdit();

    expect(await page.getBreakingFilterValue()).toBe(D.filters.breakingOnly);
    const titles = await page.getCardTitles();
    expect(titles.length).toBe(1);
    expect(titles[0]).toBe(D.seedReleases[1].title);
  });

  test('Edited item disappears from filtered view if it no longer matches product filter', async ({ dashboardPage }) => {
    const page = new EditReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    await page.setProductFilter(D.filters.productBilling);
    await page.clickEditForReleaseId('r1');
    await page.updateProduct('Auth Service');
    await page.saveChanges();

    expect(await page.getProductFilterValue()).toBe(D.filters.productBilling);
    await expect.poll(async () => await page.isEmptyStateVisible()).toBe(true);
  });
});
