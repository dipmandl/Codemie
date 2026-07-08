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
      [storageKey, releases ] as const
    );
    await this.page.reload();
  }

  async setProductFilter(value: string) {
    await this.page.locator(S.productFilterInput).fill(value);
  }

  async setBreakingFilter(value: string) {
    await this.page.locator(S.breakingFilterSelect).selectOption(value);
  }

  releaseCards() {
    return this.page.locator(S.releaseCard);
  }

  cardByTitle(title: string) {
    return this.page.locator(S.releaseCard).filter({ has: this.page.locator(S.cardTitle, { hasText: title }) });
  }

  deleteButtonForTitle(title: string) {
    return this.cardByTitle(title).locator(S.deleteButton);
  }

  async getCardTitles(): Promise<string[]> {
    return await this.page.locator(S.cardTitle).allTextContents();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.page.locator(S.emptyState).isVisible();
  }
}
