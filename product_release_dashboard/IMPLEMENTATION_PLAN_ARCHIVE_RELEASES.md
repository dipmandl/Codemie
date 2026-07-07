# Implementation Plan: Archive (Soft Delete) Release Notes

Repo: https://github.com/dipmandl/Codemie (folder: `product_release_dashboard`/)
Branch: `feature/release-archive-and-team-display`
Priority: High

Source Story: FF-GAP-001 - "No delete/archive action for release notes"

## Story Details

### Title
Add Delete/Archive action for release notes with confirmation and persistence

### Description
The dashboard supports create, edit, and filter, but there is no way to remove a release note once created. This leads to clutter and forces users to clear browser storage to remove unwanted/incorrect entries.

### Business Rules
- Prefer soft-delete (archive) over hard delete to reduce risk of accidental loss.
- Archived releases are hidden by default.
- Archiving must persist in localStorage.

### Priority
High

## Feature Overview

Add an Archive action to each release card. When a user archives a release, it is marked as archived and removed from the default list. Provide a confirmation prompt, persistence, and a lightweight user success message. Add a "Show archived" toggle to optionally reveal archived items.

## Business Goal

Keep the dashboard accurate and usable by allowing users to remove stale/incorrect release notes without clearing storage.

## Scope

### In Scope
- Add per-card Archive action with confirmation
- Soft archive data model (`archived: boolean`)
- Default list excludes archived releases
- Optional "Show archived" toggle to display archived releases
- Visual differentiation for archived releases
- Persist changes to localStorage
- Provide a visible success message after archive

### Out of Scope
- Hard delete (physical removal) unless later requested
- Restore/unarchive flow (can be added later; small extension)
- Bulk actions
- Server-side persistence

## Functional Requirements

- FR-1: Each release card includes an Archive button.
- FR-2: Clicking Archive shows a confirmation prompt.
- FR-3: Confirming sets `archived=true` for that release and updates localStorage.
- FR-4: Archived releases are excluded from default view.
- FR-5: "Show archived" toggle reveals archived releases.
- FR-6: When archived releases are shown, they must be visually marked as archived.
- FR-7: User sees a success message when an archive completes.

## Non-functional Requirements

- NFR-1: Backward compatible with existing records (no `archived` field).
- NFR-2: No JS errors if a release is missing new fields.
- NFR-3: UI remains keyboard accessible (button focusable; confirmation uses native `confirm()` for MVP).

## Existing Implementation

- `script.js`
  - Maintains `releases` array in memory
  - Persists to localStorage with key `releaseNotesDashboard.releases`
  - Renders cards using a `<template>` and event delegation for Edit
  - Filters by product and breaking/non-breaking

- `index.html`
  - Release card template contains only Edit action
  - No toolbar toggle for archived items

- `styles.css`
  - Styles release cards and Edit button
  - Has `.hidden` utility class

## Proposed Changes

### Data Model
Add optional field:
- `archived: boolean` (default false)

Migration strategy:
- When loading releases from localStorage, normalize each release to ensure it has `archived` defined (false if missing).
  - Alternatively normalize during filtering/render, but load-time normalization is cleaner.

### UI
1) Add an Archive button to each card (next to Edit).
2) Add a "Show archived" checkbox toggle near existing filters.
3) Add a toast/message container for success feedback (minimal inline component).

### Behavior
- Archive flow:
  - User clicks Archive → `confirm()` prompt.
  - If confirmed → update release in array → save → render.
  - Show success message (toast or inline banner) for a short duration.

- Filtering flow update:
  - Current filtering must also check archive state:
    - If showArchived is OFF: exclude archived
    - If ON: include archived, but still apply product/breaking filters

## File Changes

### Modify
- `product_release_dashboard/index.html`
  - Add "Show archived" checkbox in the filters area with id `archived-toggle` (or similar)
  - Add an element for notifications (e.g., `<div id="toast" class="toast hidden" aria-live="polite"></div>`)
  - Add Archive button inside card template with `data-action="archive"`

- `product_release_dashboard/script.js`
  - Add `const archivedToggle = document.getElementById("archived-toggle")`
  - Add `archivedToggle.addEventListener("change", renderReleaseList)`
  - Update event delegation to handle both edit + archive
    - e.g., read `data-action` and switch
  - Implement `archiveRelease(id)`
  - Update `loadReleases()` to normalize records to include `archived:false`
  - Update `seedData()` to include `archived:false`
  - Update `renderReleaseList()` to exclude archived by default
  - Implement `showToast(message, type)` for success feedback (type optional)

- `product_release_dashboard/styles.css`
  - Add styles for Archive button (similar to Edit, but danger color)
  - Add `.archived` card style (muted background, reduced opacity, or badge)
  - Add `.toast` component style

### New Files
- None

## Data Flow

1) User clicks Archive on a card
2) JS confirms action via `confirm()`
3) JS sets matching release `archived=true`
4) JS persists updated array to localStorage
5) JS re-renders list, excluding archived unless toggle enabled
6) JS shows success toast

## UI Changes (Detailed)

- Release card actions:
  - Buttons: Edit | Archive
- Filters:
  - Add "Show archived" checkbox (default unchecked)
- Archived card appearance (when shown):
  - Add an "Archived" badge OR reduce opacity + muted border

## Validation

- No new form fields required.
- Archive action must gracefully handle missing id or missing record.

## Error Handling

- If id not found: no-op and optionally show an error toast.
- If localStorage write fails (rare): show error toast and keep UI state consistent.

## Edge Cases

- Archiving while in edit mode:
  - If user archives the item currently being edited, exit edit mode to avoid saving into an archived record.
- Empty list after archiving:
  - Ensure empty state message appears correctly.
- Archived items + filters:
  - Confirm archived filtering is applied before/alongside other filters.

## Testing Plan

### Manual
- Archive a non-breaking release; confirm it disappears from list
- Refresh page; confirm it stays hidden
- Toggle "Show archived"; confirm archived item appears and is marked
- Cancel confirmation; confirm no changes
- Archive a breaking release; confirm breaking filter still works with archived toggle
- Archive the release currently in edit mode; confirm edit mode exits and list updates

### Automated (if test harness exists)
- Add unit-like tests in `tests/` if present for:
  - load normalization adds archived=false
  - archiveRelease sets archived flag and persists
  - render filtering excludes archived by default

## Risks

- Using `confirm()` is blocking and not stylable; acceptable for MVP, but can be replaced with custom modal later.
- localStorage schema changes (adding field) require careful backward compatibility.

## Dependencies

- Decision already made: soft archive vs hard delete → using soft archive.
- UX copy: button label "Archive" and confirmation text.

## Acceptance Criteria Mapping

- AC-1 Each card has Delete/Archive action → add Archive button to template
- AC-2 Confirmation prompt shown → `confirm()` before change
- AC-3 Archived removed from default view → render filter excludes archived unless toggle enabled
- AC-4 Persistence after refresh → update localStorage + load normalization
- AC-5 Visible success message → toast/banner component

## Definition of Done

- Archive action available and works on all cards
- Confirmation prompt appears and cancel path is safe
- Archived releases hidden by default and persist across reloads
- "Show archived" toggle works
- Success message shown on archive
- No JS errors with existing localStorage data
