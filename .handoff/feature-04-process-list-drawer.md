# Handoff: Drawer — Crear / Editar proceso

**Module**: Admin
**Screen**: Lista de procesos
**Order**: 4 of N
**Commit**: a83c2e8 — Drawer — Crear / Editar proceso lista para revisar
**Notion**: https://www.notion.so/34a6757f31308103b15dc33aa4ee4012

## Files created

- `src/pages/Processes/List/components/ProcessForm/index.tsx`

## Files modified (already existed)

- `src/pages/Processes/List/hooks/useProcessList.ts` — added `handleCreate` and `handleEdit`
- `src/pages/Processes/List/index.tsx` — wired "Nuevo proceso" button and "Editar" menu item to drawer

## Shared artifacts

- **Type**: `ProcessFormValues` exported from `ProcessForm/index.tsx` — `{ nombre, modelo, familia, linea, turno }` — reusable if another screen needs to create/edit a process

## Non-obvious decisions

- `ProcessFormValues` is explicitly defined (not `z.infer<typeof schema>`) — TS6 infers optional types from Zod which breaks `useForm` generic; explicit type is the workaround
- `openDrawer` uses `primaryButtonProps` / `secondaryButtonProps` directly (not inside `footerProps`) — this is the sandbox drawer API pattern, different from the Storybook docs
- Search `onChange` is wrapped as `value => setSearch(value)` — passing `setSearch` directly caused type mismatch with the Search component's `onChange` signature

## Project status

- Features completed: 4 (Lista de procesos, Detalle proceso vista base, Drawer operaciones, Drawer proceso)
- Next feature: Pantalla de Operador — seleccionar proceso y operación para iniciar certificación
- Blockers or pending items: none
