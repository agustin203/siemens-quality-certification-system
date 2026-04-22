# Handoff: Vista base + historial de certificaciones

**Module**: Operator
**Screen**: Home
**Order**: 5 of N
**Commit**: ff5fbb3 — Vista base + historial de certificaciones lista para revisar
**Notion**: https://www.notion.so/34a6757f31308137adc0fed46aafc222

## Files created

- `src/pages/Operator/types.ts`
- `src/pages/Operator/constants.ts`
- `src/pages/Operator/Home/index.tsx`
- `src/pages/Operator/Home/hooks/useCertificationList.ts`

## Files modified (already existed)

- `src/App.tsx` — added route `/operator` → `OperatorHome`
- `src/layouts/DashboardLayout/index.tsx` — added nav item "Mis certificaciones" with `IconCertificate`

## Shared artifacts

- **Types**: `src/pages/Operator/types.ts` — `CertificationStatus` union and `CertificationRequest` type — reusable by the drawer (feature 6) and detail screen (feature 8)
- **Constants**: `src/pages/Operator/constants.ts` — `MOCK_CERTIFICATIONS`, `CERTIFICATION_STATUS_CONFIG`, `CERTIFICATION_STATUS_FILTER_OPTIONS`, `PROCESS_FILTER_OPTIONS`, `PERIOD_FILTER_OPTIONS`

## Non-obvious decisions

- `StateCard` is used with top-level props (`Icon`, `title`, `description`) + `slotProps` for `variant` and `color` — matches the existing `Processes/List/index.tsx` pattern, which differs from the `PATTERNS.md` example (that puts everything inside `slotProps`)
- Pills `type: 'error'` is valid for rejected status — confirmed from `node_modules/material-hu/lib/components/design-system/Pills/types.d.ts`
- The 3-dot row menu only renders for `in_progress` rows — other statuses have no available actions in feature 5; "Ver detalle" will be added in feature 8
- `operatorRoutes` was NOT created as a separate `routes.ts` file — following the existing project pattern where all routes live in `src/App.tsx` directly

## Project status

- Features completed: 5 (Lista de procesos, Detalle proceso vista base, Drawer operaciones, Drawer proceso, Vista base certificaciones operador)
- Next feature: **Drawer — Nueva certificación** (Operator / Home)
- Blockers or pending items: none
