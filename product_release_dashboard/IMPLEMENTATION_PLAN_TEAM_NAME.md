# Implementation Plan: Display Team Name on Release Cards

Repo: https://github.com/dipmandl/Codemie (folder: `product_release_dashboard`/)
Branch: `feature/release-archive-and-team-display`
Priority: High

Source Story: FF-GAP-004 - "Team Name captured but not visible or usable"

- Title: Display Team Name on release cards (avoid empty label) to improve ownership visibility
- Description: Team Name is captured in the form and persisted in localStorage, but it is holding no product value because it isn't rendered. Users need to see ownership on the card so they can quickly identify the release owner.

- Business goal: Make release ownership clear by showing the Team Name already captured, improving traceability and accountability.

- Priority: High

## Feature Overview

Add a Team Name line to each release card when a release has `teamName` populated. The UI must not show an empty label or placeholder when the value is missing/empty.

## Business Goal

Improve ownership visibility for releases so stakeholders know who to contact and can more easily scan the list.

## Scope

### In Scope
- Render Team Name on release cards when present
- Hide Team Name UI when empty or missing
- Backwards compatibility for existing localStorage records without `teamName`
- Ensure Team Name shows for new and edited releases

### Out of Scope
- Adding a Team filter (possible future story)
- Changing whether Team Name is required (currently it is optional in the form)

## Functional Requirements

- FR-1: When a release has a non-empty `teamName`, the release card must display it
- FR-2: When a release has an empty/missing `teamName`, the card must not show a Team Name label or blank value
- FR-3: Existing release notes in localStorage without `teamName` must still render without errors

## Non-functional Requirements

- NFR-1: Changes must not break existing layout
- NFR-2: No change required to localStorage key or storage format beyond adding an optional field

## Existing Implementation

- `product_release_dashboard/index.html`: Already includes a Team Name input field in the form (optional)
- `product_release_dashboard/script.js`: Already persists `teamName` on create/edit and populates it on edit
- Release card template does not include a dedicated Team Name node
- Seed data does not include `teamName`

## Proposed Changes

1) (UI) Update the release card template to include a new element for Team Name
   - Add accessible markup, e.g. `<p class="release-team"></p>` under `.product-version` to keep metadata together

2) (JS) Update render logic to populate and conditionally show it
   - If `release.teamName` is truthy after trim, set text content to `Team: <teamName>` (or just `<teamName>` depending on UI copy)
   - Else hide the element (add `.hidden`)

3) (Data) Update seed data to include Team Name values
   - Add `teamName` to records `r1`/`r2` so feature is visible on first load

4) (CSS) Add style for the Team line
   - Muted color (`var(--muted)`) and slightly smaller font-size to match other metadata

## File Changes

### Modify
- `product_release_dashboard/index.html`
  - Add new DOM node in `<template id="release-card-template">` for `.release-team`

- `product_release_dashboard/script.js`
  - In `renderReleaseList()`, set/hide `.release-team` based on `release.teamName`
  - In `seedData()`, add `teamName` properties

- `product_release_dashboard/styles.css`
  - Add `.release-team` styling

### New Files
- None

## Data Flow

1) User creates/edits release note (form)
2) `script.js` persists `teamName` to localStorage
3) On render, Team Name is read from the release object and conditionally rendered

## UI Changes

- Release card: add a new metadata line for Team Name when present

## Validation

- No additional form validation required for this story (display-only)
- Render must treat `teamName` as optional

## Error Handling

- If `teamName` missing/null, do not attempt to call `.trim()` on null; use safe default (`""`) or truthy checks

## Edge Cases

- Team Name is whitespace only: treat as empty and hide
- Existing data without teamName: no error; hide line

## Testing Plan

### Manual
- Create a new release with Team Name: verify card shows team
- Create a release without Team Name: verify no empty label is shown
- Edit a release and add/remove Team Name: verify re-render correct
- Reload page: verify content persists

## Risks

- Low: minimal markup/CSS changes; should not affect logic

## Dependencies

- None

## Acceptance Criteria Mapping

- AC-1 Display team name when present → template node + render logic
- AC-2 Hide when empty → conditional hide in render
- AC-3 Edit persists and renders after refresh → already persistence flow; verify via tests

## Definition of Done

- Code changes integrated without JS errors
- Team Name displays conditionally and does not show empty labels
- Manual test checklist passed
