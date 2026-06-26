import { test, expect } from '../fixtures';
import { TeamNamePage } from '../pages/TeamNamePage';
import { teamNameData } from '../data/team-name.data';

test.describe('Team Name field - release card header formatting', () => {
  test('AC1: Team Name field is present and optional', async ({ page }) => {
    const teamNamePage = new TeamNamePage(page);
    await teamNamePage.goto(teamNameData.route);
    await teamNamePage.expectTeamNameOptional();
  });

  test('AC2: When Team Name is provided, header uses separator " ... "', async ({ page }) => {
    const teamNamePage = new TeamNamePage(page);
    await teamNamePage.goto(teamNameData.route);

    await teamNamePage.fillReleaseForm({
      ...teamNameData.release,
      teamName: teamNameData.teamNames.normal,
    });
    await teamNamePage.submit();

    await teamNamePage.expectHeaderEquals(
      `${teamNameData.release.product} - ${teamNameData.release.version}${teamNameData.expected.separator}${teamNameData.teamNames.normal}`
    );
  });

  test('AC3: When Team Name is empty, header does not show separator', async ({ page }) => {
    const teamNamePage = new TeamNamePage(page);
    await teamNamePage.goto(teamNameData.route);

    await teamNamePage.fillReleaseForm({ ...teamNameData.release, teamName: '' });
    await teamNamePage.submit();

    await teamNamePage.expectHeaderEquals(`${teamNameData.release.product} - ${teamNameData.release.version}`);
    await teamNamePage.expectHeaderNotContains(teamNameData.expected.separator);
  });

  test('AC4: Team Name is trimmed before display', async ({ page }) => {
    const teamNamePage = new TeamNamePage(page);
    await teamNamePage.goto(teamNameData.route);

    await teamNamePage.fillReleaseForm({
      ...teamNameData.release,
      teamName: teamNameData.teamNames.padded,
    });
    await teamNamePage.submit();

    await teamNamePage.expectHeaderEquals(
      `${teamNameData.release.product} - ${teamNameData.release.version}${teamNameData.expected.separator}${teamNameData.teamNames.normal}`
    );
  });

  test('AC5: Team Name supports free-text including special characters', async ({ page }) => {
    const teamNamePage = new TeamNamePage(page);
    await teamNamePage.goto(teamNameData.route);

    await teamNamePage.fillReleaseForm({
      ...teamNameData.release,
      teamName: teamNameData.teamNames.withSpecialChars,
    });
    await teamNamePage.submit();

    await teamNamePage.expectHeaderEquals(
      `${teamNameData.release.product} - ${teamNameData.release.version}${teamNameData.expected.separator}${teamNameData.teamNames.withSpecialChars}`
    );
  });

  test('Edge: Whitespace-only Team Name is treated as empty - no separator shown', async ({ page }) => {
    const teamNamePage = new TeamNamePage(page);
    await teamNamePage.goto(teamNameData.route);

    await teamNamePage.fillReleaseForm({
      ...teamNameData.release,
      teamName: teamNameData.teamNames.whitespaceOnly,
    });
    await teamNamePage.submit();

    await teamNamePage.expectHeaderEquals(`${teamNameData.release.product} - ${teamNameData.release.version}`);
    await teamNamePage.expectHeaderNotContains(teamNameData.expected.separator);
  });
});
