# Handoff: Operador — Mis procesos

**Module**: Operator
**Screen**: Processes / ProcessDetail
**Order**: 8 of N
**Commit**: 323e86a — Operador — Mis procesos lista para revisar
**Notion**: https://www.notion.so/34a6757f31308103b15dc33aa4ee4012

## Files created

- `src/pages/Operator/Processes/index.tsx` — list of all available processes with operation count and "Ver detalle" button
- `src/pages/Operator/ProcessDetail/index.tsx` — operations of a process with certification status per operation

## Files modified (already existed)

- `src/App.tsx` — routes already wired in WIP commit: `/operator/processes` → `OperatorProcesses`, `/operator/processes/:processId` → `OperatorProcessDetail`
- `src/layouts/DashboardLayout/index.tsx` — added "Mis procesos" nav item with `IconListCheck`, path `/operator/processes`

## Shared artifacts

None new — both screens reuse `PROCESS_FILTER_OPTIONS`, `OPERATOR_OPERATIONS_BY_PROCESS`, `MOCK_CERTIFICATIONS` from `src/pages/Operator/constants.ts`.

## Non-obvious decisions

- **Operation status derivation**: `getOperationStatus(operationId)` checks `MOCK_CERTIFICATIONS` — `approved` wins over `in_progress` wins over anything else → "Sin certificar". Uses array `.some()` so order in MOCK_CERTIFICATIONS doesn't matter.
- **Process name via location.state**: `ProcessDetail` receives the process label as `location.state` (a plain string) from `Processes/index.tsx`. Falls back to `PROCESS_FILTER_OPTIONS.find()` if state is missing (e.g. direct URL access).
- **`IconListCheck`** used for the "Mis procesos" nav item — distinguishes it visually from admin "Procesos" (`IconClipboardList`).

## Project status

- Features completed: 8 (+ Operator Processes list + Operator ProcessDetail)
- Next feature: **Operador — Historial** (attempts por operación)
- Remaining: Historial operador, ORO Bandeja, ORO Evaluación (cronómetro), ORO Firma, ORO Historial equipo, Admin Dashboard global, Supervisor Dashboard línea, Supervisor Drill empleado, Certificación Detalle
