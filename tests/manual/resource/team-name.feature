Feature: Team Name field on Release Note creation and display

  Background:
    Given I am on the Product Release Dashboard page

  # AC1: Team Name field exists and is optional
  Scenario: Display Team Name input as an optional free-text field
    When I view the Create a Release Note form
    Then I should see a "Team Name" input field
    And the "Team Name" input should not be required

  # AC2: Team Name is saved and displayed with separator when provided
  Scenario: Create a release note with Team Name and verify it appears on the card header
    When I enter "Billing API" into the Product field
    And I enter "v1.4.0" into the Version field
    And I enter "Platform Team" into the Team Name field
    And I enter "Release title" into the Title field
    And I enter "Some summary" into the Description field
    And I submit the release note
    Then I should see a release card created
    And the release card header should display "Billing API - v1.4.0 ... Platform Team"

  # AC3: When Team Name is empty, do not show separator
  Scenario: Create a release note without Team Name and verify no separator is shown
    When I enter "Billing API" into the Product field
    And I enter "v1.4.0" into the Version field
    And I leave the Team Name field empty
    And I enter "Release title" into the Title field
    And I enter "Some summary" into the Description field
    And I submit the release note
    Then I should see a release card created
    And the release card header should display "Billing API - v1.4.0"
    And the release card header should not contain " ... "

  # AC4: Team Name trimming - whitespace should be trimmed before display
  Scenario: Team Name is trimmed before display
    When I enter "Billing API" into the Product field
    And I enter "v1.4.0" into the Version field
    And I enter "   Platform Team   " into the Team Name field
    And I enter "Release title" into the Title field
    And I enter "Some summary" into the Description field
    And I submit the release note
    Then I should see a release card created
    And the release card header should display "Billing API - v1.4.0 ... Platform Team"

  # AC5: Team Name is truly free-text (no validation) including symbols/unicode
  Scenario: Team Name accepts free-text including special characters and unicode
    When I enter "Billing API" into the Product field
    And I enter "v1.4.0" into the Version field
    And I enter "Core/Infra & SRE - TeamA" into the Team Name field
    And I enter "Release title" into the Title field
    And I enter "Some summary" into the Description field
    And I submit the release note
    Then I should see a release card created
    And the release card header should display "Billing API - v1.4.0 ... Core/Infra & SRE - TeamA"

  # Negative/edge: Team Name only whitespace -> treated as empty (after trim) so no separator
  Scenario: Team Name with only whitespace does not show separator
    When I enter "Billing API" into the Product field
    And I enter "v1.4.0" into the Version field
    And I enter "      " into the Team Name field
    And I enter "Release title" into the Title field
    And I enter "Some summary" into the Description field
    And I submit the release note
    Then I should see a release card created
    And the release card header should display "Billing API - v1.4.0"
    And the release card header should not contain " ... "

  # Backward compatibility: legacy releases without teamName render without errors
  Scenario: Legacy release without teamName field renders without errors
    Given a release note exists in localStorage without a teamName field
    When I view the Release List
    Then the release card renders without errors
    And the release card header shows only "Product - Version" with no separator
