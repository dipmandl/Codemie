import { Page, expect } from '@playwright/test';
import { teamNameSelectors as s } from '../selectors/team-name.selectors';

export class TeamNamePage {
  constructor(private readonly page: Page) {}

  async goto(route: string) {
    await this.page.goto(route);
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await expect(this.page.locator(s.createReleaseTitle)).toBeVisible();
  }

  async fillReleaseForm(args: {
    product: string;
    version: string;
    teamName?: string;
    title: string;
    description: string;
    releaseDate: string;
  }) {
    await this.page.locator(s.productInput).fill(args.product);
    await this.page.locator(s.versionInput).fill(args.version);
    await this.page.locator(s.teamNameInput).fill(args.teamName ?? '');
    await this.page.locator(s.titleInput).fill(args.title);
    await this.page.locator(s.descriptionInput).fill(args.description);
    await this.page.locator(s.releaseDateInput).fill(args.releaseDate);
  }

  async submit() {
    await this.page.locator(s.submitButton).click();
  }

  async expectTeamNameOptional() {
    await expect(this.page.locator(s.teamNameInput)).toBeVisible();
    await expect(this.page.locator(s.teamNameInput)).not.toHaveAttribute('required', /.+/);
  }

  async expectHeaderEquals(expected: string) {
    const header = this.page.locator(s.productVersionText).first();
    await expect(header).toHaveText(expected);
  }

  async expectHeaderNotContains(unexpected: string) {
    const header = this.page.locator(s.productVersionText).first();
    await expect(header).not.toContainText(unexpected);
  }
}
