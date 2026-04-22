# Handoff: Drawer — Nueva certificación

**Module**: Operator
**Screen**: Home
**Order**: 6 of N
**Commit**: 0949c94 — Vista base + historial de certificaciones lista para revisar
**Notion**: https://www.notion.so/34a6757f31308103b15dc33aa4ee4012

## Files created

- `src/pages/Operator/Home/components/NewCertificationForm/index.tsx`

## Files modified (already existed)

- `src/pages/Operator/constants.ts` — added `OPERATOR_OPERATIONS_BY_PROCESS` (operations keyed by processId)
- `src/pages/Operator/Home/hooks/useCertificationList.ts` — added `NewCertificationInput` type and `handleCreate` function
- `src/pages/Operator/Home/index.tsx` — added `useDrawerLayer`, `NewCertificationForm` import, `openNewCertificationDrawer` function, wired button `onClick`

## Shared artifacts

- **`OPERATOR_OPERATIONS_BY_PROCESS`** in `src/pages/Operator/constants.ts` — operations list keyed by processId (`'1'`, `'2'`, `'6'`, `'9'`). Reusable by any future feature that needs operation options filtered by process.
- **`NewCertificationFormValues`** type exported from `NewCertificationForm/index.tsx` — used in `Home/index.tsx`.

## Non-obvious decisions

- **Cross-module import forbidden**: could not import operations from `src/pages/Processes/constants.ts` — module architecture forbids cross-module imports. Duplicated the operation data in `src/pages/Operator/constants.ts` as `OPERATOR_OPERATIONS_BY_PROCESS`.
- **Simple Drawer API (not Composition)**: `openDrawer({ title, size, children, primaryButtonProps, secondaryButtonProps })` — uses the older Simple API, not the newer `Drawer.Header/Body/Actions` Composition pattern. Matches all existing usages in this project (`ProcessList/index.tsx`).
- **Explicit type instead of `z.infer`**: `NewCertificationFormValues` is defined explicitly (not via `z.infer<typeof schema>`) because in some TypeScript contexts `z.infer` produces optional fields, causing TS2345 incompatibility with `NewCertificationInput` in the hook.
- **Form submit via `form` attribute**: the drawer's primary button has `form="nueva-certificacion-form"` and `type="submit"` — it's outside the `<form>` element (rendered in a portal) but linked via the `id` attribute.
- **`useEffect` for operation reset**: resets `operationId` to `''` whenever `processId` changes. The condition `if (processId !== undefined)` makes biome's `useExhaustiveDependencies` happy by referencing `processId` in the callback body.

## Project status

- Features completed: 6 (Lista de procesos, Detalle proceso vista base, Drawer operaciones, Drawer proceso, Vista base certificaciones operador, Drawer nueva certificación)
- Next feature: **Detalle de certificación** (Operator / CertificationDetail — Notion order 8)
- Blockers or pending items: none
