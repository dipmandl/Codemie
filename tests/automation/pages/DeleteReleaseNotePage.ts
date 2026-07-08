import type { Page } from '@playwright/test';
import { DeleteReleaseNoteSelectors as S } from '../selectors/delete-release-note.selectors';

export class DeleteReleaseNotePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/product_release_dashboard/index.html');
  }

  async setSeedReleases(storageKey: string, releases: unknown) {
    await this.page.evaluate(
      ([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      [storageKey, releases as const]
    );
    await this.page.reload();
  }

  async getCardTitles(): Promise<string[]> {
    return await this.page.locator(S.cardTitle).allTextContents();
  }

  async clickDeleteForReleaseId(id: string) {
    await this.page.locator(`${S.deleteButton}[data-release-id='${id}']`).click();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.page.locator(S.emptyState).isVisible();
  }

  async isInEditMode(): Promise<boolean> {
    const submitText = await this.page.locator(S.submitButton).textContent();
    const cancelHidden = await this.page.locator(S.cancelButton).evaluate((el) => el.classList.contains('hidden'));
    return submitText?.trim() === 'Save Changes' && cancelHidden === false;
  }
}
