# Feature 02 — Location Search: Tasks

## Task 2.1 — LocationContext
- [x] `src/contexts/LocationContext.tsx`
- [x] Gate: `pnpm typecheck`

## Task 2.2 — Roteamento e Layout
- [x] `src/App.tsx` com React Router + providers + AppLayout
- [x] `src/components/navigation/BottomNav.tsx`
- [x] `src/pages/AjustesPage.tsx` (placeholder)
- [x] Atualizar `src/main.tsx`
- [x] Gate: `pnpm typecheck && pnpm build`

## Task 2.3 — LocalesPage e componentes
- [x] `src/components/location/LocationSearchInput.tsx`
- [x] `src/components/location/LocationListItem.tsx`
- [x] `src/pages/LocalesPage.tsx`
- [x] Gate: `pnpm typecheck && pnpm lint`

## Task 2.4 — Refactor DashboardPage
- [x] Remover estado local de location e lógica de geo
- [x] Usar `useLocationContext()`
- [x] Gate: `pnpm typecheck && pnpm build`

## Task 2.5 — Testes
- [x] `LocalesPage` com busca mockada via MSW
- [x] Gate: `pnpm test`