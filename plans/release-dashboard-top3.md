# Implementation Plan: Release Notes Dashboard – Top 3 Enhancements (Delete, Validation Messages, Sort)

## Feature Overview
This plan covers 3 user stories for the `product_release_dashboard` (static HTML/CSS/JS app):
1. **Delete release note with confirmation**
2. **Show validation messages for required fields**
3. **Add sort control for release list (by release date)**

## Business Goal
Improve usability and day-to-day operability of the Release Notes Dashboard by enabling cleanup (delete), reducing user confusion (validation feedback), and improving discoverability (sorting).

## Scope
### In Scope
- Add a **Delete** action on each release card with confirmation.
- Add **user-visible validation** on submit for required fields.
- Add a **Sort** control for release list ordering by `releaseDate` (asc/desc).

### Out of Scope
- Modal dialog components (MVP will use `window.confirm()` for delete).
- Server persistence, authentication, roles.
- Advanced sorting (by product/version) beyond release date.
- Additional filters (team, version, date range) and export/import.

## Functional Requirements
### Story 1 — Delete release note with confirmation (High)
- Each release card must show a **Delete** button.
- Clicking Delete prompts a confirmation.
- Confirming removes the item from `releases[]`, persists via `saveReleases()`, and re-renders the list.
- If the deleted item is in edit mode (`editingReleaseId` matches), exit edit mode and reset the form.
- Cancelling the confirmation makes no changes.

### Story 2 — Validation messages for required fields (High)
- On submit (create/edit), validate: `product`, `version`, `title`, `description`, `releaseDate`.
- If invalid:
  - prevent save
  - visually mark fields invalid
  - show field-level message(s) and a top-of-form summary region
  - set accessibility attributes (`aria-invalid`, `aria-describedby`)
  - move focus to first invalid field (MVP)
- On user correction (input/change), clear invalid state and message for that field.

### Story 3 — Sort control for release list (Medium)
- Add a sort dropdown near existing filters with:
  - `releaseDate-desc` (default) = newest first
  - `releaseDate-asc` = oldest first
- Changing sort re-renders immediately while keeping filters.
- Releases with missing/invalid `releaseDate` sort to the end for both directions.

## Non-functional Requirements
- **Accessibility:** error summary should be `role="alert"` or `aria-live` region; fields use `aria-invalid`.
- **Performance:** sorting/filtering should remain O(n log n) max; list is small in MVP.
- **Maintainability:** keep functions small (e.g., separate `getFilteredAndSortedReleases()` from rendering).

## Existing Implementation (Repo Scan)
### Relevant Files
- `product_release_dashboard/index.html`
  - Form with required attributes and ids.
  - Filters: product text + breaking dropdown.
  - Release card template contains only **Edit** button.
- `product_release_dashboard/script.js`
  - In-memory `releases` loaded from `localStorage`.
  - Create/update flow in form submit.
  - Filtering by product and breaking only.
  - Edit mode implemented with `editingReleaseId`, `startEdit()`, `exitEditMode()`.
  - No delete logic.
  - Validation currently silent early return.
- `product_release_dashboard/styles.css`
  - Styling for edit/cancel; no invalid-field styling.

### Constraints / Observations
- Uses `crypto.randomUUID()` (not addressed in this top3 set).
- Rendering uses `textContent` (good for XSS safety).

## Proposed Changes
### A) UI Changes (HTML)
Update `product_release_dashboard/index.html`:
1. Add a **sort control** to the `.filters` block:
   - `<select id="sort-control">` with options `releaseDate-desc`, `releaseDate-asc`.
2. Add a validation summary container above the form actions:
   - `<div id="form-errors" class="form-errors hidden" aria-live="polite"></div>`
3. Add per-field error placeholders (minimal, explicit ids for `aria-describedby`):
   - After each required input/textarea add `<p class="field-error" id="error-product"></p>` etc.
4. Add a **Delete** button to the card template next to Edit:
   - `<button type="button" class="btn-delete" data-action="delete">Delete</button>`

### B) Behavior Changes (JavaScript)
Update `product_release_dashboard/script.js`:

#### 1) Sorting
- Add DOM reference: `const sortControl = document.getElementById("sort-control");`
- Add event listener: `sortControl.addEventListener("change", renderReleaseList);`
- Refactor list derivation:
  - Create `getFilteredReleases()` (existing filter logic)
  - Create `sortReleases(items, sortKey)`
  - Update `renderReleaseList()` to:
    1. compute filtered
    2. compute sorted
    3. render sorted
- Sorting details:
  - Parse date using `new Date(release.releaseDate)`
  - If invalid date -> treat as `null` and sort after valid dates.

#### 2) Delete
- Extend click delegation on `releaseList` to handle both edit and delete:
  - Determine action via `closest('[data-action]')`.
  - For delete: read `dataset.releaseId`, call `confirm()`.
  - On confirm:
    - if `editingReleaseId === id` -> `exitEditMode()`
    - `releases = releases.filter(r => r.id !== id)`
    - `saveReleases(releases)`
    - `renderReleaseList()`

#### 3) Validation messages
- Add helpers:
  - `validateRelease(updated) -> { valid: boolean, errors: Record<field, message> }`
  - `showValidationErrors(errors)`
  - `clearValidationErrors()`
  - `setFieldError(fieldId, message)`
  - `clearFieldError(fieldId)`
- Update submit handler:
  - call `clearValidationErrors()`
  - call `validateRelease(updated)`
  - if invalid:
    - render summary + field errors
    - focus first invalid field
    - return
- Add input/change listeners for required fields to clear their error state as user types.

### C) Styling Changes (CSS)
Update `product_release_dashboard/styles.css`:
- Add styles for:
  - `.field-error` (small red text)
  - `.form-errors` (top-of-form callout)
  - `.is-invalid` class for invalid inputs/textareas (red border + background tint)
- Add `.btn-delete` styling (danger outline/filled on hover).

## File Changes
### Modified Files
- `product_release_dashboard/index.html`
  - Add sort dropdown
  - Add delete button in template
  - Add validation summary + per-field error elements
- `product_release_dashboard/script.js`
  - Add sort control support
  - Implement delete
  - Implement validation UI + a11y attributes
- `product_release_dashboard/styles.css`
  - Add invalid/error styles
  - Add delete button styles

### New Files
- `plans/release-dashboard-top3.md` (this plan)

## Data Flow
1. User actions (submit / filter / sort / edit / delete) trigger event handlers.
2. App reads/writes `releases` (in-memory array).
3. Persist changes via `localStorage` under `releaseNotesDashboard.releases`.
4. `renderReleaseList()` derives `filtered + sorted` view and re-renders DOM using template cloning.

## Validation
### Required Fields
- `product`, `version`, `title`, `description`, `releaseDate` are required.
- Validation rule: `trim().length > 0` (for date, ensure value is present; optional: ensure `new Date(value)` is valid).

### UX Rules
- On invalid submit:
  - show top summary with count + field names
  - show per-field error
  - focus first invalid field
- On successful submit:
  - clear validation state
  - proceed with create/update as today

## Error Handling
- Delete confirmation cancellation: no-op.
- Delete id not found: no-op (should not crash).
- Sorting invalid dates: place at end.
- Rendering with missing fields: keep current safe defaults (textContent + fallback strings).

## Edge Cases
- Deleting the release currently being edited exits edit mode and resets form.
- Deleting the last item shows empty-state message.
- Sorting with filters applied: sorting applies after filtering.
- User changes sort while in edit mode: should not affect edit state.

## Testing Plan
### Manual Tests (MVP)
1. **Delete**
   - Delete a card, confirm -> removed and persists on reload.
   - Delete a card, cancel -> remains.
   - Start editing a card, then delete that same card -> form exits edit mode.
2. **Validation**
   - Submit empty form -> errors visible, focus to first invalid.
   - Fill required fields -> errors clear and submission works.
   - Verify `aria-invalid` toggles.
3. **Sort**
   - Default sort is newest first.
   - Switch to oldest first -> order changes.
   - Add a release with valid date and confirm it’s placed correctly.

### Automated Tests
- None added in this plan (repo has a `tests/` folder but no harness wired). Consider future story/spike.

## Risks
- Adding per-field error elements increases HTML verbosity; must ensure ids align with JS mapping.
- Native `confirm()` is blocking and less stylable; acceptable for MVP.

## Dependencies
- UX decision already resolved for MVP:
  - Delete confirmation: `window.confirm()`
  - Validation: inline + summary (implemented via simple DOM elements)

## Acceptance Criteria Mapping
### Delete
- Delete action per card → template updated + click delegation
- Confirmation prompt → `confirm()`
- Remove from memory + localStorage → `releases.filter` + `saveReleases`
- Re-render respects filters → `renderReleaseList()` uses current filter inputs
- If in edit mode → compare to `editingReleaseId` and call `exitEditMode()`

### Validation
- Mark invalid + message → `.is-invalid` + `.field-error` + summary
- Clear on correction → input listeners calling `clearFieldError`
- Accessible → `aria-invalid`, `aria-describedby`, focus first invalid
- Valid submit persists and resets → existing flow, plus `clearValidationErrors()`

### Sort
- Sort control exists and defaults → HTML select + default option
- Re-render on change → change listener
- Correct ordering with invalid dates at end → `sortReleases` logic

## Definition of Done
- Plan reviewed and approved.
- All 3 stories implemented in HTML/CSS/JS.
- Manual verification completed for create/edit/delete/filter/sort and validation UX.
- No console errors in browser.
- Updated code adheres to existing style and uses safe rendering (`textContent`).
