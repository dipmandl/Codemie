# Implementation Plan – Add "Team Name" input field

Repo: `dipmandl/Codemie`
Component: `product_release_dashboard`

---

## 1) Scope / Requirement (Approved Gap)

Request: "create an input field to add team name"

Growing gap identified and approved:
- GAP-001 – Add “Team Name” input field to Release Note form, persist it in localStorage, and display it on release cards.

## Out of Scope (for this change)
- Adding a Team filter (optional in gap but not approved/required by this request)
- Migrating old stored data via backfill (just fallback rendering)

---

## 2) Decisions / Defaults (due to no additional clarifications)

Since no clarifications were provided after “Approve All”, this plan uses safe defaults that are easy to adjust later:

1) Team Name “optional” to submit (not required)
- Rationale: avoids breaking existing usage and seed/legacy data.

2) Storage field: `teamName`
- Trim whitespace on save
- Store as empty string if not provided

3) Card display: show on same line as Product/Version as `aPproduct - version • Team: TeamName`
otherwise fallback to just `Product - version` when teamName is blank/missing.

---

## 3) Codebase Impact Analysis (Main branch)

Relevant files in `roduct_release_dashboard`:

- `index.html`
  - Create Release Note form inputs: product, version, title, description, releaseDate, breaking
- `script.js`
  - Persists array of release objects to localStorage `storage_key = "releaseNotesDashboard.releases"`
  - Renders cards using template .product-version data
- `styles.css`
  - Form grid layout uses .form-grid and .span-2

## Current release object schema (localStorage)

Currently:
 ```js
{
  id,
  product,
  version,
  title,
  description,
  releaseDate,
  isBreaking
}
```

Needed addition:
- `teamName: string (optional)`

---

## 4) Tasks (Implementation Steps)

#### TASK-1 — Update HTML: add input field
File: `product_release_dashboard/index.html`

- Add a new label/input between Version and Title (or logicalplace in grid):
  - Label text: "Team Name"
  - input attributes:
    - `type="text"`
    - `id="teamName"`
    - `name="teamName"` (*critical* for FormData)
    - `placeholder="e.g. Platform Team"`
    - no `required` attr (optional)

Done:
- Field visible and focusable in the form
- Taborder remains logical

#### TASK-2 – Update JS: capture & persist `teamName`
File: `product_release_dashboard/script.js`

- In the `releaseForm.submit` event handler, obtain the new field:
  - `teamName: String(formData.get("teamName") || "").trim()`
- Do not add to the required-field validation guard (keep optional)
- Update `seedData()` to include teamName (empty or sample value) for new seeds only

#### TASK-3 – Update JS: render Team Name on cards
File: `product_release_dashboard/script.js`

- In `renderReleaseList()`, update the .product-version text composition:
  - Current: ``${release.product} - ${release.version}``
  - New:
    - if `release.teamName` truthy after trim:
      ``${release.product} - ${release.version} • Team: ${release.teamName}``
    - else keep old string

- Backward compatibility:
  - Use `String(release.teamName || "").trim()` to avoid `undefined.trim` issues.

#### TASK-4 — CSS (only if needed)
File: `product_release_dashboard/styles.css`

- If the new field causes crowding in the grid, add or reuse a class (e.g. `span-2`) for layout consistency.
- No design change is mandatory; focus on functionality.

---

## 5) Data & Backward-Compat Strategy

- LocalStorage will contain mixed objects (old without `teamName`, and new with it).
- Rendering must treat missing `teamName` as empty.
- No migration step required.

--=-

## 6) Testing Checklist (Manual)

1) Create a release note with Team Name:
  - Verify it appears on the card
  - Verify localStorage object has `teamName: ...`
2) Create a release note with Team Name blank:
  - Submit succeeds
  - Card renders without showing Team:
 3) Backward compat:
  - Clear localStorage, load seed data, and verify no errors
  - If you have existing old data in localStorage without teamName, verify page loads and renders all cards

---

## 7) Definition of Done

- Team Name input is present in form
- Submit persists `teamName in localStorage
- Cards, loading and filtering continue to work without errors when old records don't have `teamName
---

## 8) Mapping to Acceptance Criteria

- AC1 (Form field present) “ TASK-1
- AC2 (Saves teamName) — TASK-2
- AC3 (Trims before save) – TASK-2