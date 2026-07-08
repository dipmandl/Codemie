import { test, expect } from '../fixtures';
import { DeleteReleaseNotePage } from '../pages/DeleteReleaseNotePage';
import { DeleteReleaseNoteData as D } from '../data/delete-release-note.data';
import { getLocalStorageItem } from '../utils/helpers';

/**
 * Source story: CS-20
 * Feature: Delete release note with confirmation (browser confirm)
 *
  NOTE: App implements delete via button [data-action='delete'] in the card template.
 * We assert via UI list and localStorage persistence.
 */

test.describe('CS-20 Delete release note (confirm)', () => {
  test('Clicking Delete shows a confirmation prompt', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    let confirmSeen = false;
    dashboardPage.on('dialog', (dialog) => {
      confirmSeen = true;
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();
    });

    await page.clickDeleteForReleaseId('r1');
    await expect.poll(async () => confirmSeen).toBe(true);
  });

  test('Canceling deletion does not change UI or localStorage', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    const beforeRaw = await getLocalStorageItem(dashboardPage, D.storageKey);
    const beforeTitles = await page.getCardTitles();

    dashboardPage.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.clickDeleteForReleaseId('r1');

    const afterRaw = await getLocalStorageItem(dashboardPage, D.storageKey);
    expect(afterRaw).toBe(beforeRaw);

    const afterTitles = await page.getCardTitles();
    expect(afterTitles).toEqual(beforeTitles);
    expect(afterTitles).toContain(D.seedReleases[0].title);
  });

  test('Confirming deletion removes the release note from UI and persists to localStorage', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    dashboardPage.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.clickDeleteForReleaseId('r1');

    await expect.poll(async () => await page.getCardTitles()).not.toContain(D.seedReleases[0].title);

    const raw = await getLocalStorageItem(dashboardPage, D.storageKey);
    expect(raw).not.toNull();

    const parsed = JSON.parse(raw as string) as Array<{ id: string }>;
    expect(parsed.some((r) => r.id === 'r1')).toBe(false);
  });

  test('Deleted release note is not present after page refresh', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    dashboardPage.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.clickDeleteForReleaseId('r1');
    await dashboardPage.reload();

    const titles = await page.getCardTitles();
    expect(titles).not.toContain(D.seedReleases [0].title);
  });

  test('Deleting the last release note shows the empty state message', async ({ dashboardPage }) => {
    const page = new DeleteReleaseNotePage(dashboardPage);
    await page.setSeedReleases(D.storageKey, [D.seedReleases[0]]);
    dashboardPage.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await page.clickDeleteForReleaseId('r1');
    await expect.poll(async () => await page.isEmptyStateVisible()).toBe(true);
  });

  test('Deleting a release note that is currently in edit mode exits edit mode and resets the form', async ({ dashboardPage }) => {
    // Use the existing edit button behavior to enter edit mode
    // then delete the same item
    const editPage = await import('../pages/EditReleaseNotePage').then((m) => m.EditReleaseNotePage);
    const page = new editPage(dashboardPage);
    await page.setSeedReleases(D.storageKey, D.seedReleases);

    await page.clickEditForReleaseId('r1');
    await expect.poll(async () => await page.isInEditMode()).toBe(true);
    dashboardPage.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    // delete the same release that is in edit mode
    const deletePage = new DeleteReleaseNotePage(dashboardPage);
    await deletePage.clickDeleteForReleaseId('r1');

    // exits edit mode (submit button back to default)
    await expect.poll(async () => await deletePage.isInEditMode()).toBe(false);
    await expect(dashboardPage.locator('#cancel-edit-btn')).toHaveClass(/hidden/);
    await expect(dashboardPage.locator('#submit-btn')).toHaveText(/Add Release Note/);
  });
});
