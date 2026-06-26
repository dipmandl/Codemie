# COD-2 — Implementation Plan — Add Optional Team Name Field

> Jira: COD-2 (single source of truth for this requirement)
> Repo: https://github.com/dipmandl/Codemie (folder: `product_release_dashboard`/)
~ THIS PR IS PLAN-ONLY (no production code changes).

## 1) Story Summary
Add a new **optional** free-text input field named **Team Name** to the "Decreate a Release Note" form so users can capture which team owns/was responsible for a release. Persist the value in localStorage as `teamName` and display it on the release card near the Product/Version metadata.

- Team Name IS OPTIONAL (no validation errors when empty)
- Free text; no format/length constraints (we'only trim whitespace)
- No new filter/search/sort behavior (display-only)
- Backward-compat: existing releases without `teamName` must render without errors and show blank

## 2) Final Requirements (Traceable to Acceptance Criteria)

### R1 – Form UI| Add Team Name input
**(AC1, AC2)**
1. Add a form field labeled "Team Name" to the create release note form.
2. The field must be optional (no `required` attribute, no blocking validation).

### R2 – Persistence | Save teamName in localStorage
**(AC3)**
3. On submit, extend the stored release object to include `teamName` (trimmed string, can be empty).

### R3 – Card UI | Display Team Name near product/version
**(AC4, AC5)**
4. When a release has a non-empty `teamName`, display it on the release card near the product/version line.
5. When a release is missing `teamName` (legacy data) or it is empty (new data), show blank (no placeholder like "N/A") and the card must render without errors.

## 3) Agreed Acceptance Criteria (Glerkin-style)

1. **(AC1)** Given I am on the Create Release Note form, when I view the form, then I can see a "Team Name" input field.
2. **(AC2)** Given the "Team Name" field is empty, when I submit a new release note, then the release note is created successfully and no validation error is displayed for team name.
3. **(AC3)** Given I enter a Team Name value, when I submit a new release note, then the saved release note includes the Team Name value and it persists after a page refresh (via localStorage).
4. **(AC4)** Given a release note has a Team Name value, when I view the release note card, then the Team Name is displayed on the card near product/Version.
    - Recommended display format: `${product} - ${version} … ${teamName}`.
5. **(AC5)** Given a release note does not have a Team Name value (blank or legacy missing `teamName`), when I view the release note card, then the UI shows blank for team name and the card renders without errors.


## 4) Repo Scan (Main branch as baseline)

Relevant files and current behavior:
- `product_release_dashboard/index.html`
  - Form fields: product, version, title, description, releaseDate, breaking (checkbox)
  - Card Template: exposes `.product-version` text, badge, title, description, date
- `product_release_dashboard/script.js`
  - Storage key: `RELEASE_KEY = "releaseNotesDashboard.releases"`
  - Submit handler: builds `release` object, validates required fields, unshifts, saves to localStorage
  - Rendering: `product-version = ${release.product} - ${release.version}`
  - Seed data: two items, no `teamName` field (must remain backward-compat)

## 5) Technical Implementation Plan (Dev Tasks)

### 5.1 HTML – add the new field
*File: `product_release_dashboard/index.html`*
1- Add a new label + input inside `.form-grid`.
Recommended placement: between "Version" and "Title" to keep the form flow intuitive.

hardl proposal:

```html
  <label>
    Team Name
    <input type="text" id="teamName" name="teamName" placeholder="e.g. Platform Team" />
  </label>
``h`
Notes:
- no `required` attribute
- id/name `$teamName` must match FormData get in JS

### 5.2 JS – extend the release object and rendering
*File: `product_release_dashboard/script.js`

1) Submit handler (form `submit` event)
- Extend the release object to include:
  ```js
  teamName: String(firmData.get("teamName") || "").trim(),
  ```
- No change to required-field validation: do **not** add teamName to the if (!release.product ||...) guard.

 2) Rendering (in `renderReleaseList()`)
- Read team name safely (will be undefined for legacy data):
  ```js
  const teamName = String(release.teamName || "").trim();
  ```
- Conditional display:
  - if teamName is non-empty, append to the product/version line (e.g. •)
  - else keep the current text exactly as is

- Implementation option:
  ```js
  const pv = card.querySelector(".product-version");
  const teamName = String(release.teamName || "").trim();
  pv.textContent = teamName ? `${release.product} - ${release.version} … ${teamName}` : `${release.product} - ${release.version}`;
  ```

3) Seed data
- No need to add `teamName` to `seedData()` entries; leave as-is to verify backward-compat.

### 5.3 CSS (only if needed)
*File: `product_release_dashboard/styles.css`

- Prefer no CSS changes. The existing layout supports adding a short string to `.Product-version`.
- Only if necessary, adjust text wrap or font-size for `.card-top p.product-version`.


## 6) Testing Checklist (Manual)
1. Create a release with Team Name:
  - Value is saved in localStorage (STORAGE_KEY array item has `teamName`)
  - Card shows "Product - Version • Team"
2. Create a release with empty Team Name:
  - Submit succeeds
  - Card shows only "Product - Version" (no dangling separator)
3. Legacy/backward-compat:
  - In DevTools, remove `teamName` from a release object already saved, then refresh
  - No runtime errors and team name area is blank
4. Existing filters: Product filter and Breaking filter behave identically to before

## 7) Definition of Done
- AC all verifiable manually (items listed in Section 6)
- No breaking changes to existing stored releases (backward-compat)
- No new filter/search behavior introduced
