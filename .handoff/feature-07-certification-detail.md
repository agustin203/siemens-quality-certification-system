# Handoff: Detalle de certificación

**Module**: Operator
**Screen**: CertificationDetail
**Order**: 7 of N
**Commit**: 8cb6437 — Detalle de certificación lista para revisar
**Notion**: https://www.notion.so/34a6757f31308103b15dc33aa4ee4012

## Files created

- `src/pages/Operator/CertificationDetail/index.tsx`

## Files modified (already existed)

- `src/App.tsx` — added lazy import and route `/operator/certifications/:id` → `CertificationDetail`
- `src/pages/Operator/Home/index.tsx` — added `useNavigate`, made `TableRow` clickable (onClick navigates to detail), added `e.stopPropagation()` on the 3-dot IconButton to prevent row click from firing when opening the row menu

## Shared artifacts

None — `CertificationDetail` reuses `CertificationRequest` type and `CERTIFICATION_STATUS_CONFIG` from `src/pages/Operator/` (already shared).

## Non-obvious decisions

- **Data passed via `location.state`**: the detail page receives the `CertificationRequest` object as React Router navigation state (`navigate(url, { state: cert })`), not via an API call. This avoids a second lookup for mock data. If `location.state` is null (direct URL access), the page shows an error StateCard.
- **`FieldRow` sub-component is local**: defined inline in `CertificationDetail/index.tsx` — it's a simple two-column row used only in this screen, not worth extracting.
- **`cursor: 'pointer'` removed from `TableRow` sx**: `TableRow` sets `cursor: pointer` automatically when `onClick` is present (confirmed from source code at `node_modules/material-hu/lib/components/design-system/Table/components/TableRow/index.js:23`).
- **Row click + 3-dot menu coexistence**: `e.stopPropagation()` on the `IconButton` prevents the row's `onClick` from firing when the user opens the context menu.

## Project status

- Features completed: 7 (Lista de procesos, Detalle proceso vista base, Drawer operaciones, Drawer proceso, Vista base certificaciones operador, Drawer nueva certificación, Detalle de certificación)
- Next feature: none known — all Operator features complete
- Blockers or pending items: none
