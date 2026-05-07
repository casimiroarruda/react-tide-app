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
- [ ] `src/api/client.ts`
- [ ] `src/api/locations.ts`
- [ ] `src/api/tides.ts`
- [ ] `src/test/mocks/handlers.ts`
- [ ] `src/test/mocks/server.ts`
- [ ] Atualizar `src/test/setup.ts`
- [ ] `src/api/locations.test.ts`
- [ ] `src/api/tides.test.ts`
- [ ] Gate: `pnpm typecheck && pnpm test`

## Task 1.3 — Hooks TanStack Query
- [ ] `src/hooks/useGeolocation.ts`
- [ ] `src/hooks/useNearbyLocations.ts`
- [ ] `src/hooks/useLocationSearch.ts`
- [ ] `src/hooks/useTides.ts`
- [ ] `src/hooks/useTideState.ts`
- [ ] `src/lib/queryClient.ts`
- [ ] Gate: `pnpm typecheck`

## Task 1.4 — Componentes UI
- [ ] `TideEventCard`
- [ ] `TideTable` (estados: loading, error, empty, success)
- [ ] `DateNavigator`
- [ ] `LocationHeader`
- [ ] Gate: `pnpm typecheck && pnpm lint`

## Task 1.5 — Página e integração
- [ ] `DashboardPage` integrando hooks e componentes
- [ ] Navegação de dias por teclado (← →)
- [ ] Gate: `pnpm build`

## Task 1.6 — Testes de integração
- [ ] TideTable com dados mockados
- [ ] DateNavigator com navegação
- [ ] Gate: `pnpm test --coverage` ≥ 80%