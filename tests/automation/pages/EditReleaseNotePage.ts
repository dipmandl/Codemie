import type { Page } from '@playwright/test';
import { EditReleaseNoteSelectors as S } from '../selectors/edit-release-note.selectors';

export class EditReleaseNotePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/product_release_dashboard/index.html');
  }

  async setSeedReleases(storageKey: string, releases: unknown) {
    await this.page.evaluate(
      ([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      [storageKey, releases] as const
    );
    await this.page.reload();
  }

  async setProductFilter(value: string) {
    await this.page.locator(S.productFilterInput).fill(value);
  }

  async setBreakingFilter(value: string) {
    await this.page.locator(S.breakingFilterSelect).selectOption(value);
  }

  async waitForEditButtonByReleaseId(id: string) {
    await this.page.locator(`${S.editButton}[data-release-id='${id}']`).waitFor({ state: 'visible' });
  }

  async clickEditForReleaseId(id: string) {
    await this.waitForEditButtonByReleaseId(id);
    await this.page.locator(`${S.editButton}[data-release-id='${id}']`).click();
    // ensure startEdit() had time to toggle UI
    await this.page.locator(S.cancelButton).waitFor({ state: 'visible' });
  }

  async isInEditMode(): Promise<boolean> {
    const submitText = await this.page.locator(S.submitButton).textContent();
    const cancelHidden = await this.page.locator(S.cancelButton).evaluate((el) => el.classList.contains('hidden'));
    return submitText?.trim() === 'Save Changes' && cancelHidden === false;
  }

  async getFormValues() {
    return {
      product: await this.page.locator(S.productInput).inputValue(),
      version: await this.page.locator(S.versionInput).inputValue(),
      title: await this.page.locator(S.titleInput).inputValue(),
      description: await this.page.locator(S.descriptionTextarea).inputValue(),
      releaseDate: await this.page.locator(S.releaseDateInput).inputValue(),
      isBreaking: await this.page.locator(S.breakingCheckbox).isChecked(),
    };
  }

  async updateTitle(value: string) {
    await this.page.locator(S.titleInput).fill(value);
  }

  async updateDescription(value: string) {
    await this.page.locator(S.descriptionTextarea).fill(value);
  }

  async updateProduct(value: string) {
    await this.page.locator(S.productInput).fill(value);
  }

  async saveChanges() {
    await this.page.locator(S.submitButton).click();
  }

  async cancelEdit() {
    await this.page.locator(S.cancelButton).click();
  }

  async getProductFilterValue() {
    return await this.page.locator(S.productFilterInput).inputValue();
  }

  async getBreakingFilterValue() {
    return await this.page.locator(S.breakingFilterSelect).inputValue();
  }

  async getCardTitles(): Promise<string[]> {
    return await this.page.locator(S.cardTitle).allTextContents();
  }

  async getCardDescriptions(): Promise<string[]> {
    return await this.page.locator(S.cardDescription).allTextContents();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.page.locator(S.emptyState).isVisible();
  }
}
