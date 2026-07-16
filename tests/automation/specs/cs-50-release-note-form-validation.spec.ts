import { test, expect } from '../fixtures';
import { ReleaseNoteFormPage } from '../pages/ReleaseNoteFormPage';

import { ReleaseNoteFormSelectors as S } from '../selectors/release-note-form.selectors';

// Source: CS-50 - Add user-visible validation errors for Create/Edit Release Note form

// NOTE: The app is a static page that persists to localStorage. We assert create/update behavior via both UI and localStorage counts.

const STORAGE_KEY = 'releaseNotesDashboard.releases';

test.describe('CS-50 Release note form validation', () => {
  test('Submitting empty form shows field-level errors and does not create', async (+ { dashboardPage }) => {
    const page = new ReleaseNoteFormPage(dashboardPage);

    const before = await page.getReleaseCount(STORAGE_KEY);

    // Step: submit without entering any values
    await page.clearRequiredFields();
    await page.submit();

    // Expected: no create occurs
    const after = await page.getReleaseCount(STORAGE_KEY);
    expect(after).toBe(before);

    // Expected: summary and field level errors are visible
    await expect(dashboardPage.locator(S.formErrorSummary)).toBeVisible();

    const requiredFields = ['product', 'version', 'title', 'description', 'releaseDate'] as const;
    for (const field of requiredFields) {
      const input = page.fieldInputLocator(field);
      const error = page.fieldErrorLocator(field);

      await expect(error).toBeVisible();
      await expect(error).toHaveText(/required/i);
      await expect(input).toHaveAttribute('aria-invalid', 'true');
    }
  });

  test('Valid create adds a new release and clears validation errors', async ({ dashboardPage }) => {
    const page = new ReleaseNoteFormPage(dashboardPage);

    const before = await page.getReleaseCount(STORAGE_KEY);

    // Step: enter valid values and submit
    await page.fillForm({
      product: 'Billing API',
      version: 'v1.5.0',
      title: 'Validation test release',
      description: 'Create should succeed without errors.',
      releaseDate: '2026-07-16',
      isBreaking: false,
    });
    await page.submit();

    const after = await page.getReleaseCount(STORAGE_KEY);
    expect(after).toBe(before + 1);

    // Expected: Error summary not visible and fields are not aria-invalid
    await expect(dashboardPage.locator(S.formErrorSummary)).toBeHidden();

    const requiredFields = ['product', 'version', 'title', 'description', 'releaseDate'] as const;
    for (const field of requiredFields) {
      const input = page.fieldInputLocator(field);
      await expect(input).not.toHaveAttribute('aria-invalid', 'true');
      await expect(page.fieldErrorLocator(field)).toBeHidden();
    }

    // Assert that the new card is rendered by title text
    await expect(dashboardPage.locator(S.cardTitle).last()).toHaveText('Validation test release');
  });

  test('Correcting one field clears only that field\s error and leaves others visible', async ({ dashboardPage }) => {
    const page = new ReleaseNoteFormPage(dashboardPage);

    await page.clearRequiredFields();
    await page.submit();

    // Step: fix one field (title)
    await page.fillForm({ title: 'Only title fixed' });


    // Expected: title error hidden, others still shown
    await expect(page.fieldErrorLocator('title')).toBeHidden();
    await expect(page.fieldInputLocator('title')).not.toHaveAttribute('aria-invalid', 'true');

    for (const field of ['product', 'version', 'description', 'releaseDate'] as const) {
      await expect(page.fieldErrorLocator(field)).toBeVisible();
      await expect(page.fieldInputLocator(field)).toHaveAttribute('aria-invalid', 'true');
    }
  });

  test('Edit mode: Saving with a missing required field does not update and shows errors', async ({ dashboardPage }) => {
    const page = new ReleaseNoteFormPage(dashboardPage);

    // Seed data so we can enter edit mode deterministically
    await page.setSeedReleases(STORAGE_KEY, [
      {
        id: 'r1',
        product: 'Billing API',
        version: 'v1.4.0',
        title: 'Original title',
        description: 'Original desc',
        releaseDate: '2026-06-08',
        isBreaking: false,
      },
    ]);

    await page.clickEditForReleaseId('r1');
    await expect.poll(async () => await page.isInEditMode()).toBe(true);

    // Step: clear a required field and try to save
    await page.fillForm({ title: '' });
    await page.submit();

    // Expected: stay in edit mode, error visible, no data update
    await expect.poll(async () => await page.isInEditMode()).toBe(true);

    await expect(page.fieldErrorLocator('title')).toBeVisible();
    await expect(page.fieldInputLocator('title')).toHaveAttribute('aria-invalid', 'true');

    // Assert storage still has Original title for r1
    const raw = await dashboardPage.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    const parsed = JSON.parse(raw as string) as Array<{ id: string; title: string }>;
    expect(parsed.find((r) => r.id === 'r1')?.title).toBe('Original title');
  });
});
