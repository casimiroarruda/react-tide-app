# Feature 01 — Tide Display: Design

## Decisões de implementação — Task 1.1

### geo.ts
- `parseGeoPoint`: regex sobre WKT. **Atenção:** formato é POINT(lon lat), não POINT(lat lon).
- `haversineDistance`: fórmula padrão, retorna km.

### date.ts
- Todas as funções usam `Intl` com `timeZone` explícito — nunca `toLocaleDateString()` sem timezone.
- `toApiDate`: formata para "yyyy-MM-dd" usando `en-CA` locale (retorna nesse formato nativamente).
- `todayInTimezone`: retorna a data atual no fuso da Location — evita bug de virada de meia-noite.
- `addDays`: constrói Date com `T12:00:00` para evitar problemas de DST nas bordas do dia.
- `formatTideTime`: recebe ISO 8601 com offset, converte para HH:mm no fuso da Location.

### tide.ts
- **Interpolação cossenoidal** entre dois eventos adjacentes.
  - Natural para curvas de maré (sinusoidal); mais suave que linear.
  - `t ∈ [0,1]`: posição normalizada no tempo entre os dois eventos.
  - `height = h1 + (h2 - h1) * (1 - cos(t * π)) / 2`
- `getTideStatus`: olha o **próximo** evento após `now`.
  - Próximo é HIGH → maré subindo ("rising") → "Enchente"
  - Próximo é LOW → maré descendo ("falling") → "Vazante"
- `buildTideCurve`: gera N pontos uniformes entre o primeiro e último evento do dia.
  - Cada ponto chama `interpolateTideHeight` internamente.
  - Usado pelo componente TideChart para renderizar a curva SVG.
- Edge cases:
  - `now` antes de todos os eventos: extrapola a partir do primeiro par.
  - `now` após todos os eventos: extrapola a partir do último par.
  - Array vazio: retorna height 0 / status "rising" (estado neutro).