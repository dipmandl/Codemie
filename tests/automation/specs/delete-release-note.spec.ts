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
    await page.setSeedReleases(D.storageKey, D.seedReleasesZJ); 
  });
});
