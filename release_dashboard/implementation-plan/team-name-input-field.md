# Implementation Plan — Optional Team Name Field (Jira: COD-1)

> Repo: https://github.com/dipmandl/Codemie (branch: main)
- Dashboard module: product_release_dashboard/

## 1) Story summary
Add an **optional** Team Name free-text input to the “Create a Release Note” form. Persist it in localStorage as `teamName` and display it on each release card near the Product/Version metadata.

- Team Name is OPTIONAL (no validation error message when empty)
- Team Name is free text (no constraints beyond trimming)
- No filter/search/sort changes for team name in this story
- Existing releases without `teamName` must render with blank display

## 2) Requirements &amp; Acceptance Criteria

### R1 – Add Team Name input to the form (optional)
- AC1. The create release form displays a “Team Name” text input.
- AC2. Input is optional (does not block submit when empty).

### R2 – Persist teamName in localStorage
- AC3. On submit, release object saved to localStorage includes `teamName` trimmed string (can be empty).

### R3 - Display Team Name on the release card
- AC4. Each release card displays team name near Product/Version when present.
- AC5. For old releases missing `teamName`, the UI shows blank and does not break.


## 3) Repo Context (Main branch)

Entry points:
- Form definition: product_release_dashboard/index.html (form#broad/inputs)
- Submit + storage: product_release_dashboard/script.js (Storage_KEY = releaseNotesDashboard.releases)
- Render template: `<template id="release-card-template">` in index.html
- Rendering logic: renderReleaseList() in script.js


## 4) Changes plan (Implementation steps)

### 4.1 UI : index.html
1. Add a new `label>` block in the `.form-grid` forn. Recommended placement: after “Version” and before “Title”.
2. Markup proposal:

  ```html
  <label>
    Team Name
    <input type="text" id="teamName" name="teamName" placeholder="e.g. Platform Team" />
  </label>
  ```

Notes:
 - No `required` attribute
 - Keep id/name consistent with FormData access

### 4.2 Submit / Storage : script.js
1. Extend the release object in the submit handler:
  - `teamName: String(formData.get("teamName") || "").trim() `
2. Do’t include `teamName  in the required-field check (because optional).
3. Backward compat: nothing to migrate; render must tolerate `none/undefined`.

### 4.3 Rendering: renderReleaseList()
Conditionally append team name to the existing product/version line to keep it „near” that area without re-doing the card layout.

Peudocode:

```js
const teamName = String(release.teamName || "").trim();
if (teamName) {
  productVersionEl.textContent = `${release.product} - ${release.version} • ${teamName}`;
} else {
  productVersionEl.textContent = `${release.product} - ${release.version}`;
}
```

Design note: Existing requirement says blank when absent. Do not render “N/A” or other placeholders.

## 5) Styling (styles.css)
- Prefer no CSS change if using ‟append in same line”.
- If the bullet separator • looks too close, consider small letter-spacing or text color adjustment only.

## 6) Manual Test checklist
1. Add release with Team Name filled:
  - Confirm `localStorage[STORAGE_KEY]] includes `teamName`
  - Confirm card displays team name near product/version
2. Add release with Team Name empty:
  - Release saves and renders without an extra separator
3. Backward compat:
  - Edit one stored object in DevTools and delete `teamName`, refresh
  - Confirm no runtime errors and blank display behavior
4. Existing filters: Product filter and Breaking filter still work

## 7) Definition of Done
- Field added to form (optional)
- Save object includes teamName
- Card shows team name near product/version when present
- Old data renders with blank (backward compat)
