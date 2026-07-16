Feature: CS-50 - User-visible validation errors for Create/Edit Release Note form
  As a dashboard user
  I want clear validation feedback when creating or editing a release note
  So that I understand what is required and can successfully save accurate release notes.

  # Notes (manual):
  # - Required fields: Product Name, Version, Title, Description, Release Date.
  # - Tests assume validation is triggered on form submit and that errors are shown adjacent to the invalid field(s).
  # - Accessibility expectations: aria-invalid="true" on invalid inputs and error text associated to the input (e.g., via aria-describedby).

  Background:
    Given the Release Notes Dashboard is opened
    And the Create a Release Note form is visible

   @positive @create
  Scenario: Create - Submitting with all required fields empty shows field-level errors and does not create a release note
    Given the release list contains 0 release notes or the tester notes the current count
    When the user clicks "Add Release Note" without filling any fields
    Then the release note is not created
    And the form shows an error message for each missing required field:
      | field       |
      | Product Name |
      | Version      |
      | Title        |
      | Description   |
      | Release Date  |
    And each invalid required input has aria-invalid set to true

   @positive @create
  Scenario: Create - Submitting with only one required field empty shows only that field's error
    Given the user enters a valid Product Name
    And the user enters a valid Version
    And the user enters a valid Title
    And the user enters a valid Description
    And the user leaves Release Date empty
    When the user clicks "Add Release Note"
    Then the release note is not created
    And the form shows an error message for "Release Date" only
    And the "Release Date" input has aria-invalid set to true
    And the other required inputs do not have aria-invalid set to true

  @positive @create
  Scenario: Create - Correcting a field clears only that field's error and updates aria-invalid
    Given the user submits the form with empty required fields
    And validation errors are shown for all required fields
    When the user enters a valid Version
    Then the error message for "Version" clears
    And the "Version" input no longer has aria-invalid set to true
    And error messages for the other missing required fields remain visible

  @positive @create
  Scenario: Create - Successful save creates a release note and clears all validation errors
    Given the user enters valid values for all required fields
    And the user triggers validation errors and then corrects them
    When the user clicks "Add Release Note"
    Then the release note is created and appears in the release list
    And no validation error messages are visible on the form
    And none of the required inputs have aria-invalid set to true

   @positive @edit
  Scenario: Edit - Save is blocked when a required field is cleared and errors are shown
    Given at least one release note exists in the list
    And the user opens a release note in edit mode
    When the user clears the Title field so it is empty
    And the user clicks "Save Changes"
    Then the release note is not updated
    And the form shows an error message for "Title"
    And the "Title" input has aria-invalid set to true

  @positive @edit
  Scenario: Edit - Correcting invalid inputs clears errors and successful save clears all errors
    Given the user is viewing validation errors in edit mode
    When the user enters a non-empty Title
    Then the error message for "Title" clears
    And the "Title" input no longer has aria-invalid set to true
    When the user enters valid values for all other required fields
    And the user clicks "Save Changes"
    Then the release note is updated
    And all validation errors are cleared from the form
    And none of the required inpuuts have aria-invalid set to true

   @negative @accessibility
  Scenario: Accessibility - Error text is associated with the invalid input for screen readers
    Given the user submits the form with empty required fields
    When the tester inspects one invalid field (e.g., "Product Name")
    Then the input has aria-invalid set to true
    And the input has an aria-describedby (or equivalent) attribute that references the error text element
    And the error text element is present in the DOM
