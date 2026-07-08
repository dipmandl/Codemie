Feature: Delete an existing release note with confirmation (CS-20)
  As a dashboard user
  I want to delete an existing release note with a confirmation step
  So that I can remove incorrect or obsolete entries and keep the release notes list clean.

  Background:
    Given the Release Notes Dashboard is opened
    And the app uses browser localStorage for persistent release notes
    And the release list is visible

  # Acceptance Criteria

---------------------------------------------------------------------------------------
  Scenario: Delete action prompts for confirmation
    Given a release note card is displayed
    When the user clicks Delete on that release note card
    Then the user is prompted to confirm deletion

  Scenario: Confirming deletion removes the release note from the UI without affecting others
    Given at least two release notes exist in the list
    When the user clicks Delete on one release note card
    And the user confirms deletion
    Then that release note is removed from the UI list
    And all remaining release notes remain displayed
    And the list is re-rendered to reflect the deletion
 
  Scenario: Deletion is persisted to localStorage and survives a page refresh
    Given a release note exists in the list
    And the tester has opened browser developer tools
    When the user clicks Delete on that release note card
    And the user confirms deletion
    And the user refreshes the page
    Then the deleted release note is not present in the UI list
    And the deleted release note is not present in browser localStorage key "releaseNotesDashboard.releases"

  Scenario: Canceling deletion makes no changes in UI and localStorage
    Given a release note exists in the list
    And the tester has opened browser developer tools
    And the tester notes the current value of browser localStorage key "releaseNotesDashboard.releases"
    When the user clicks Delete on that release note card
    And the user cancels the confirmation
    Then the release note remains visible in the UI list
    And the value of browser localStorage key "releaseNotesDashboard.releases" is unchanged

  Scenario: Deleting the last release note shows the existing empty-state message
    Given exactly one release note exists in the list
    When the user clicks Delete on that release note card
    And the user confirms deletion
    Then no release note cards are displayed
    And the existing empty-state message is shown

  Scenario: Deleting the release note that is currently being edited exits edit mode and resets the form
    Given at least one release note exists in the list
    And the user opens the release note in edit mode
    And the release note form is in edit mode
    When the user clicks Delete on that same release note card
    And the user confirms deletion
    Then the deleted release note is removed from the UI list
    And the form exits edit mode
    And the form fields are reset to their default values
    And the Cancel action is not visible
    And the submit action label is restored to create mode labeling

  # Edge Cases

---------------------------------------------------------------------------------------
  Scenario: Attempting to delete a release note id that no longer exists is a no-op and does not break the UI (eg. stale card)
    Given multiple release notes exist in the list
    And the tester has opened browser developer tools
    When the tester removes one release note entry from browser localStorage key "releaseNotesDashboard.releases"
    And the tester tries to delete that same release note from the UI list
    Then the application does not crash
    And the release list remains consistent
    And no additional release notes are removed

  Scenario: Deleting while filters are active removes the item globally and keeps the filtered view consistent
    Given multiple release notes exist across different filter values
    And a filter is active
    And the list shows only release notes matching the filter
    When the user clicks Delete on a release note visible in the filtered list
    And the user confirms deletion
    Then the deleted release note is not shown in the current filtered view
    And the filtered view refreshes to show only matching release notes
    And when the user clears all filters
    Then the deleted release note is not present in the full list
