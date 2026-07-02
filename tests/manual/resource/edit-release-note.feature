Feature: Edit an existing release note (COD-7)
  As a Release Notes Editor
  I want to edit an existing release note
  So that I can correct mistakes and keep release notes accurate.

  Background:
    Given the Release Notes Dashboard is opened
    And at least one release note exists in the list

  # Positive
  Scenario: Edit action opens the existing release note in editable state with pre-filled values
    When the user clicks Edit on a release note card
    Then the release note form is shown in edit mode
    And the submit button label changes to "Save Changes"
    And a Cancel button is visible
    And the form fields are pre-filled with the selected release note values:
      | field        |
      | product      |
      | version      |
      | title        |
      | description  |
      | releaseDate  |
      | breakingFlag |

  Scenario: Saving updates the correct release note by unique id and persists to localStorage
    Given the user is editing an existing release note
    When the user changes the Title and Description
    And the user clicks "Save Changes"
    Then the edited release note is updated in the list (same card id)
    And the updated releases are persisted to localStorage
    And the edit mode is exited

  Scenario: Cancel exits edit mode without saving changes
    Given the user is editing an existing release note
    When the user changes one or more fields
    And the user clicks Cancel
    Then the edit mode is exited
    And the release list remains unchanged
    And no changes are written to localStorage

  # Filters / Integration
  Scenario: Filters remain applied after saving an edit
    Given a product filter is set to "Billing"
    And the user clicks Edit on a filtered release note
    When the user changes the Title
    And the user clicks "Save Changes"
    Then the product filter value remains "Billing"
    And only release notes matching product filter "Billing" are shown

  Scenario: Filters remain applied after canceling an edit
    Given a breaking filter is set to "Breaking only"
    And the user clicks Edit on a filtered release note
    When the user clicks Cancel
    Then the breaking filter remains set to "Breaking only"
    And only breaking release notes are shown

  # Edge / Regression
  Scenario: Edited item disappears from filtered view when it no longer matches the active filter
    Given a product filter is set to "Billing"
    And the user clicks Edit on a release note that matches the filter
    When the user changes Product Name to "Auth Service"
    And the user clicks "Save Changes"
    Then the product filter value remains "Billing"
    And the edited release note is not shown in the list

  # Negative / Robustness
  Scenario: Clicking Edit on a release note that no longer exists does not crash
    Given the release list is rendered
    When the underlying release note is deleted from storage by another tab
    And the user clicks Edit on the now-stale card
    Then the application does not crash
    And the form does not enter edit mode
