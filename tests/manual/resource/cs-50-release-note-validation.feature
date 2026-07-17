Feature: CS-50 - Validation feedback for Create/Edit Release Note form
  As a dashboard user
  I want clear validation feedback when creating or editing a release note
  So that I understand what is required and can successfully save accurate release notes.

  Background:
    Given the Release Notes Dashboard is opened

  # Submit with missing required fields

  Scenario: Create - Submit with all required fields empty shows errors and does not create
    Given the release note form is shown in create mode
    When the user clicks Submit
    Then the release note is not created
    And I see a field-level validation error for each missing required field:
      | field         |
      | Product       |
      | Version       |
      | Title         |
      | Description    |
      | Release Date    |

  Scenario: Create - Submit with one required field missing shows error for that field only
    Given the release note form is shown in create mode
    And the user enters valid values for Product, Version, Title, and Release Date
    But leaves Description empty
    When the user clicks Submit
    Then the release note is not created
    And I see a field-level validation error for "Description"
    And I do not see validation errors for the other required fields

  Scenario Outline: Create - Each required field marked invalid has aria-invalid=true on submit
    Given the release note form is shown in create mode
    And the user leaves "<Field>" empty
    When the user clicks Submit
    Then the input for "<Field>" is marked invalid for accessibility (aria-invalid is True)

    Examples:
      | Field         |
      | Product      |
      | Version       |
      | Title         |
      | Description    |
      | Release Date    |

  Scenario: Create - Each invalid field has an error text associated to the input (aria-describedby)
    Given the release note form is shown in create mode
    When the user clicks Submit without filling any required field
    Then for each invalid required field I can identify an error message element associated with that field (for example, via aria-describedby)

  # Clearing errors when corrected

  Scenario: Create - Correcting an invalid field clears the related error message
    Given the release note form is displaying validation errors
    And the Description field is empty and marked invalid
    When the user enters a valid Description
    Then the validation error for Description is cleared
    And the Description input is bo longer marked invalid (aria-invalid is removed or updated)

  Scenario: Create - Correcting multiple invalid fields clears only those field errors that were fixed
    Given the release note form is displaying validation errors
    And Title and Release Date are empty and marked invalid
    When the user enters a valid Title
    Then the validation error for Title is cleared
    And the Release Date validation error is still shown

  # Successful save clears errors

  Scenario: Create - Submit with all required fields valid creates a release note and clears validation errors
    Given the release note form is shown in create mode
    And the user enters valid values for all required fields
    When the user clicks Submit
    Then a new release note is created and appears in the release list
    And no validation error messages are visible on the form

  # Edit mode validation

  Scenario: Edit - Save Changes with a required field empty shows errors and does not update
    Given the user is editing an existing release note
    And the user clears the Title field
    When the user clicks "Save Changes"
    Then the release note is not updated
    And I see a field-level validation error for "Title"

  Scenario: Edit - Correcting an invalid field clears the error and updates aria-invalid
    Given the user is editing an existing release note
    And validation errors are visible on the form
    When the user enters a valid value into each invalid field
    Then each related validation error message clears
    And the corresponding inputs are no longer marked invalid for accessibility

  Scenario: Edit - Successful Save Changes updates the release note and clears all validation errors
    Given the user is editing an existing release note
    And the user enters valid values for all required fields
    When the user clicks "Save Changes"
    Then the release note is updated
    And no validation error messages remain visible on the form
