# Feature 01 — Tide Display: Tasks

## Task 1.1 — Tipos e utilitários (esta task)
- [x] `src/types/api.ts` — Location, Tide, TideType, GeoPoint, ApiState
- [x] `src/utils/geo.ts` — parseGeoPoint, haversineDistance
- [x] `src/utils/date.ts` — toApiDate, todayInTimezone, addDays, formatDisplayDate, formatTideTime
- [x] `src/utils/tide.ts` — interpolateTideHeight, getTideStatus, buildTideCurve
- [x] `src/utils/geo.test.ts`
- [x] `src/utils/date.test.ts`
- [x] `src/utils/tide.test.ts`
- [x] Gate: `pnpm typecheck && pnpm test`

## Task 1.2 — Camada de API (12-factor compliant)

### Design
- `client.ts` lê `import.meta.env.VITE_BFF_URL` — nunca URL hardcoded
- Sem lógica de auth no frontend — o BFF é opaco para o React
- Erros HTTP viram instâncias de `ApiError` tipadas — nunca `throw string`
- MSW intercepta fetch no nível de rede — testa o código real, não mocks de módulo

### Arquivos
- [x] `src/api/client.ts`
- [x] `src/api/locations.ts`
- [x] `src/api/tides.ts`
- [x] `src/test/mocks/handlers.ts`
- [x] `src/test/mocks/server.ts`
- [x] Atualizar `src/test/setup.ts`
- [x] `src/api/locations.test.ts`
- [x] `src/api/tides.test.ts`
- [x] Gate: `pnpm typecheck && pnpm test`

## Task 1.3 — Hooks TanStack Query
- [x] `src/hooks/useGeolocation.ts`
- [x] `src/hooks/useNearbyLocations.ts`
- [x] `src/hooks/useLocationSearch.ts`
- [x] `src/hooks/useTides.ts`
- [x] `src/hooks/useTideState.ts`
- [x] `src/hooks/useLocationContext.ts`
- [x] `src/lib/queryClient.ts`
- [x] Gate: `pnpm typecheck`

## Task 1.4 — Componentes UI
- [x] `TideEventCard`
- [x] `TideTable` (estados: loading, error, empty, success)
- [x] `DateNavigator`
- [x] `LocationHeader`
- [x] Gate: `pnpm typecheck && pnpm lint`

## Task 1.5 — Página e integração
- [x] `DashboardPage` integrando hooks e componentes
- [x] Navegação de dias por teclado (← →)
- [x] Gate: `pnpm build`

## Task 1.6 — Testes de integração
- [x] TideTable com dados mockados
- [x] DateNavigator com navegação
- [x] Gate: `pnpm test --coverage` ≥ 80%

## Task 4 — Layout mobile de eventos (backlog)
- [x] Em viewport mobile (< 640px), `TideEventCard` exibe lista vertical
- [x] Em desktop/tablet mantém o layout vertical (decisão de design simplificada)
- [x] Gate: `pnpm typecheck && pnpm test`