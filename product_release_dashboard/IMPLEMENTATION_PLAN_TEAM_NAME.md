# Implementation Plan: Add Team Name Input Field to Release Notes Dashboard

Repo: https://github.com/dipmandl/Codemie (folder: `product_release_dashboard`/)
Branch: `plan/add-team-name-input`

JIRA: Link provided by request: https://mandlikdipak52.atlassian.net/jira/software/projects/COD/boards/67

Requirement (from user)
- "Create an input field to add team name"

> Assumptions (due to no additional details provided)
> - Team Name is a free-text text field (not a dropdown).
> - It is required to create a release note.
> - Team Name can be used later for filtering, but this story only adds the field, persists it, and displays it.
> - Data is persisted in browser localStorage (current app behavior).

## 1) Scope / Out of Scope

### In Scope
- Add a "Team Name" input field to the "Create a Release Note" form.
- Save the team name along with release data into localStorage.
- Display Team Name on each release card (in Release List).
- Handle existing records without teamName gracefully (backwards compatible).
- Update seed data to include team names so the feature is verifiable out-of-the-box.

### Out of Scope
- Add a new filter by team name (can be a separate story).
- Persistence to backend /DATABASE (not available in this repo).
- User management / auth.

## 2) Acceptance Criteria

AC-1: Team Name field on form
- Given I am on "Create a Release Note"
- Then I see a new input field labeled "Team Name"
- And the field is required

AC-2: Team Name is persisted
- When I submit a new release note
- Then it is saved to localStorage with a non-empty `teamName` property

AC-3: Team Name is displayed
- Given the Release List is rendered
- Then each release card shows the team name for that release

AC-4: Backwards compatibility
- Given there are existing releases in localStorage without `teamName`
- When the dal loads and renders
- Then the page does not error and displays a safe fallback (e.g., hide team line or show "- ”)

## 3) Data Model Change (localStorage)

Current: `release` object has: `id, product, version, title, description, releaseDate, isBreaking.`
New: add `teamName: string`

## 4) Implementation Steps (By File)

#### 4.1 `product_release_dashboard/index.html`
1. Add a new input field inside the form grid:
   - Input name: `teamName`
   - ID: `teamName`
   - Placeholder: e.g. "Platform"
   - Add `required` attribute

### 4.2 `product_release_dashboard/script.js`
1. In submit handler, read Team Name from FormData and add to the release object:
   `teamName: String(formData.get("teamName") || "").trim()`
2. Update the required field guard check to include `teamName`.
3. Update card rendering to display team name:
   - Option A (quick): Append to `.product-version` text
   - Option B recommended: Add a new dom line in template for `team-name` and populate it
     - Fallback if empty/undefined (old data)
4. Update `seedData()` items to include `teamName`.

### 4.3 `product_release_dashboard/styles.css` (optional)
- If a new `.team-name` element is added, style it to match existing type hierarchy (muted color, smaller font).

## 5) Manual Test Checklist

- Can create a release with Team Name and all existing fields.
- Team Name persists after page reload.
- Release card shows Team Name.
- No JS errors when localStorage has old release objects without `teamName`.
