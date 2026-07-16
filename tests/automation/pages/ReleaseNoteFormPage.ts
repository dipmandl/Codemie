import type { Page } from '@playwright/test';
import { ReleaseNoteFormSelectors as S } from '../selectors/release-note-form.selectors';
import { getLocalStorageItem } from '../utils/helpers';

export type ReleaseNoteFormValues = {
  product: string;
  version: string;
  teamName: string;
  title: string;
  description: string;
  releaseDate: string;
  isBreaking: boolean;
};

export class ReleaseNoteFormPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/product_release_dashboard/index.html');
  }

  async setSeedReleases(storageKey: string,
    releases: unknown) {
    await this.page.evaluate(
      ([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      [storageKey, releases ] as const
    );
    await this.page.reoad();
  }

  async submit() {
    await this.page.locator(S.submitButton).click();
  }

  async cancelEdit() {
    await this.page.locator(S.cancelButton).click();
  }

  async clickEditForReleaseId(id: string) {
    await this.page.locator(`button.btn-edit[data-action='edit'][data-release-id='${id}']`).click();
    await this.page.locator(S.cancelButton).waitFor({ state: 'visible' });
  }

  async isInEditMode(): Promise<boolean> {
    const submitText = await this.page.locator(S.submitButton).textContent();
    const cancelVisible = await this.page.locator(S.cancelButton).evaluate((el) => !el.classList.contains('hidden'));
    return submitText?.trim() === 'Save Changes' && cancelVisible === true;
  }

  async getFormValues(): Promise<ReleaseNoteFormValues> {
    return {
      product: await this.page.locator(S.productInput).inputValue(),
      version: await this.page.locator(S.versionInput).inputValue(),
      teamName: await this.page.locator(S.teamNameInput).inputValue(),
      title: await this.page.locator(S.titleInput).inputValue(),
      description: await this.page.locator(S.descriptionTextarea).inputValue(),
      releaseDate: await this.page.locator(S.releaseDateInput).inputValue(),
      isBreaking: await this.page.locator(S.breakingCheckbox).isChecked(),
    };
  }

  async fillForm(values: Partial<ReleaseNoteFormValues>) {
    if (values.product !== undefined) await this.page.locator(S.productInput).fill(values.product);
    if (values.version !== undefined) await this.page.locator(S.versionInput).fill(values.version);
    if (values.teamName !== undefined) await this.page.locator(S.teamNameInput).fill(values.teamName);
    if (values.title !== undefined) await this.page.locator(S.titleInput).fill(values.title);
    if (values.description !== undefined) await this.page.locator(S.descriptionTextarea).fill(values.description);
    if (values.releaseDate !== undefined) await this.page.locator(S.releaseDateInput).fill(values.releaseDate);
    if (values.isBreaking !== undefined) {
      const loc = this.page.locator(S.breakingCheckbox);
      if (values.isBreaking) await loc.check();
      else await loc.uncheck();
    }
  }

  async clearRequiredFields() {
    await this.fillForm({
      product: '',
      version: '',
      title: '',
      description: '',
      releaseDate: '',
    });
  }

  fieldErrorLocator(field: 'product' | 'version' | 'title' | 'description' | 'releaseDate') {
    const map = {
      product: S.productError,
      version: S.versionError,
      title: S.titleError,
      description: S.descriptionError,
      releaseDate: S.releaseDateError,
    } as const;
    return this.page.locator(map[field]);
  }

  fieldInputLocator(field: 'product' | 'version' | 'title' | 'description' | 'releaseDate') {
    const map = {
      product: S.productInput,
      version: S.versionInput,
      title: S.titleInput,
      description: S.descriptionTextarea,
      releaseDate: S.releaseDateInput,
    } as const;
    return this.page.locator(map[field]);
  }

  async getReleaseCount(storageKey: string) {
    const raw = await getLocalStorageItem(this.page, storageKey);
    if (!raw) return 0;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.length;
      return 0;
    } catch {
      return 0;
    }
  }
}
