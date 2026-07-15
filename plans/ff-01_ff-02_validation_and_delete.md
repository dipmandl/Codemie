# Feature: Release form: Validation messages + Release note: Delete flow (FF-01, FF-02)

## Feature Overview
Add user-visible validation messages for required fields in the Create/Edit release note form, and add a Delete action on each release card with confirmation (optional Undo not in scope for this plan unless specified by PO).

## Business Goal
- FF-01: Reduce user confusion and prevent perceived data loss by explaining why a form submission failed and what to fix.
- FF-02: Enable lifecycle management of release notes by allowing users to remove incorrect/obsolete entries.


## Scope
### In scope
- Inline field-level validation messages for: Product Name, Version, Title, Description, Release Date.
- A form-level error summary area (aria-live) to announce that there are errors.
- Accessibility: aria-invalid, aria-describedby, don't rely on color alone.