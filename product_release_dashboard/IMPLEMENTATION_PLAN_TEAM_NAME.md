# Implementation Plan: Add Optional Team Name Input Field to Release Notes Dashboard

Repo: https://github.com/dipmandl/Codemie (folder: `product_release_dashboard`/)
Branch: `plan/team-name-optional`

JIRA: https://mandlikdipak52.atlassian.net/jira/software/projects/COD/boards/67


User Story Summary
- Add an input field to capture Team Name when creating a Release Note.

# 1) Final Requirement (this story)

Confirmed decisions (from PO+business clarification):
- Team Name is **optional** on form submission (no validation error when missing).
- Team Name is free-text (no constraints, no dropdown).
- Team Name is **display-only** for this story (no filter/search/sort changes).
 - Note: question on exact placement was answered "yes" to display it as a distinct line/metadata row on the release card.
 - Detailed UI placement is defined below as a new metadata row.
- Persistence: use existing mechanism (currently localStorage in this app).
 - Existing release notes in localStorage without `teamName` should be handled as blank (no default text like "N/A").

# 2) Scope / Out of Scope

## In Scope
- Add a **Team Name** text input to the "Create a Release Note" form.
 - Capture, store, and load `teamName` with the existing release note object (localStorage).
 - Render Team Name on each release card in the release list.
- Backwards compatibility: older data without this field must not break rendering or loading.

## Out of Scope
- Add filter/search/sort by Team Name.
- Any backend storage or database migrations.