# Implementation Plan — Add “Team Name” input field (Product Release Dashboard)

- Repo: https://github.com/dipmandl/Codemie
- Area: `product_release_dashboard/`
- JIRA (ref): COD board 67
- Pillar: UI + localStorage model update

## 1) Scope / Requirements (Final)

Users should be able to enter a Team Name when creating a release note. Team Name is **optional**, free text (no constraints), display-only (no filtering/search changes now).

- Add “Team Name” input to the form (optional)
- Include `teamName` on release objects saved to `localStorage`
- Show Team Name on each release card in a dedicated metadata row (no filtering for now)
- Seed data should include `teamName` so it appears on first load
- Backwards-compatible: existing localStorage records may lack `teamName` — render as blank (no placeholder text)

## 2) Files / Components Affected
- `product_release_dashboard/index.html`
- `product_release_dashboard/script.js`
- `product_release_dashboard/styles.css` (only if required for layout)
- (Optional) `product_release_dashboard/README.md` to document new field

## 3) Data Model Change (localStorage)

Current release object fields:
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
``h
a

Proposed addition:
```js
  teamName: string // optional, free text, trimmed
```

Backward compatibility: when rendering, treat missing `teamName` as empty string.