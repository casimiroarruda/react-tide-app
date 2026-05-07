# Feature 01 — Tide Display: Requirements

**Status:** Aprovado  
**Escopo desta task (1.1):** Tipos, utilitários e testes — sem UI ainda.

---

## User Stories relevantes para Task 1.1

**US-02** — Ver todos os eventos de maré do dia com horário e altura  
**US-03** — Identificar visualmente alta e baixa maré  
**US-06** — Ver o nível médio do mar da localidade (meanSeaLevel)

## Critérios de Aceite — Task 1.1

| ID | Critério |
|----|----------|
| AC-T1 | `parseGeoPoint("POINT(-46.633 -23.550)")` retorna `{ lon: -46.633, lat: -23.550 }` |
| AC-T2 | `parseGeoPoint` lança erro para formato inválido |
| AC-T3 | `toApiDate` formata Date para "yyyy-MM-dd" corretamente |
| AC-T4 | `addDays("2026-04-30", 2)` retorna `"2026-05-02"` (cruzando mês) |
| AC-T5 | `interpolateTideHeight` retorna h1 no início e h2 no fim do intervalo |
| AC-T6 | `getTideStatus` retorna `"rising"` quando próximo evento é HIGH |
| AC-T7 | `buildTideCurve` retorna exatamente N pontos cobrindo o dia |
| AC-T8 | `pnpm typecheck` passa sem erros |
| AC-T9 | `pnpm test` passa com cobertura ≥ 80% em utils/ |