Feature: CS-50 - User-visible validation errors for Create/Edit Release Note form
  As sa dashboard user
  I want clear validation feedback when creating or editing a release note
  So that I understand what is required and can successfully save accurate release notes.

  # Note: Tests focus on the form-validation behavior and accessibility signals.
  # Required fields per story: Product, Version, Title, Description, Release Date.

  Background:
    Given the Release Notes Dashboard is opened

  @primary
  Scenario: Create - Submitting with all required fields empty shows separate field-level errors and does not save
    When the user opens the Create Release Note form
    And the user leaves the following fields empty:
      | Product |
      | Version |
      | Title |
      | Description |
      | Release Date |
    And the user submits the form
    Then the release note is not created
    And I see an error message associated to each missing required field
    And each invalid field is indicated as invalid (e.g., visual styling)
    And each invalid field has aria-invalid set to "true"

  Scenario: Create - Submitting with a single required field empty shows only that field's error and does not save
    Given the user is filling the Create Release Note form
    And the user enters valid values for the following fields:
      | field |
      | Product |
      | Version |
      | Title |
      | Description |
    And the user leaves "Release Date" empty
    When the user submits the form
    Then the release note is not created
    And I see an error message for "Release Date" only
    And the valid fields do not show error messages
    And the "Release Date" field has aria-invalid set to "true"
    And the other required fields do not have aria-invalid set to "true"

  Scenario: Create - Correcting a single invalid field clears its error and updates aria-state
    Given validation errors are shown on the Create Release Note form
    And the "Release Date" field is marked invalid
    When the user enters a valid release date
    Then the error message for "Release Date" is cleared
    And the "Release Date" field has aria-invalid removed or set to "false"

  Scenario: Create - Correcting one field does not clear errors for other still-invalid fields
    Given validation errors are shown on the Create Release Note form
    And more than one required field is invalid
    When the user corrects the Title field only
    Then the Title error message is cleared
    And the remaining invalid fields still show their own error messages
    And aria-invalid remains set to "true" for those remaining invalid fields

  Scenario: Create - Successful save creates a release note and clears all validation errors
    Given the user is filling the Create Release Note form
    And the user enters valid values for Product, Version, Title, Description, and Release Date
    When the user submits the form
    Then the release note is created
    And no validation error messages are visible on the form
    And no field has aria-invalid set to "true"

  # Edit flows
  Scenario: Edit - Submitting with a required field cleared does not update the release note
    Given at least one release note exists in the list
    And the user opens the Edit form for a release note
    And the user clears the "Title" field
    When the user submits the form
    Then the release note is not updated
    And the edit form remains open
    And I see a field-level error message for "Title"
    And the "Title" field has aria-invalid set to "true"

  Scenario: Edit - Successful save updates the release note and clears validation errors
    Given at least one release note exists in the list
    And the user opens the Edit form for a release note
    And validation errors are currently visible on the form
    When the user enters valid values for any invalid required fields
    And the user submits the form
    Then the release note is updated
    And no validation error messages are visible on the form
    And no field has aria-invalid set to "true"

  # Accessibility focus - ar-ai signals
  Scenario: Accessibility - Error text is associated to invalid inputs for screen readers
    Given validation errors are shown on the Create or Edit Release Note form
    When the user inspects an invalid input's accessibility properties
    Then the input has aria-describedby pointing to the visible error text
    And the error text can be read by a screen reader
    And the input has aria-invalid set to "true"

  Scenario: Accessibility - Keyboard only user can reach and understand all validation errors
    Given the user is using keyboard only
    And the Create Release Note form is validation-failing on submit
    When the user presses Tab and Shift+Tab to navigate through form fields
    Then the user can focus each invalid field
    And the user can perceive the associated error text for each invalid field
