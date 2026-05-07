# CLAUDE.md — Maré Viva

> Lido pelo Claude Code em toda sessão. Nunca remova seções — apenas expanda.
> Última atualização: 2026-05-06

---

## 1. Contexto do Projeto

**Nome:** React Tide App (Project TIPPE)
**Objetivo:** Web app de consulta de tábua de marés do litoral brasileiro — simples, rápido,
sem propaganda.
**Público-alvo:** Pescadores, surfistas, mergulhadores, velejadores.
**Stack de backend existente:**
- Extrator PHP → PostgreSQL (dados da Marinha do Brasil)
- API Go em `http://localhost:8080` (desenvolvimento)
- BFF Go (a criar) — proxy leve que mantém client_secret server-side

---

## 2. Arquitetura Geral

```
[Browser / React SPA]
        ↓  HTTPS (sem credenciais no bundle)
[BFF Go — proxy leve]
        ↓  JWT Bearer (client_secret no env do servidor)
[API Go — Tide API]
        ↓
[PostgreSQL — tide_tracker schema]
```

**Por que BFF:** A API usa client credentials (OAuth2 machine-to-machine).
Expor `client_secret` em SPA é inaceitável. O BFF mantém o secret como variável de
ambiente. O browser nunca vê o secret — apenas dados de maré. Os dados são públicos
(Marinha do Brasil), então o risco real é abuso de infraestrutura, mitigado com rate
limiting no BFF.

---

## 3. Stack Técnica

| Camada | Tecnologia | Versão mínima |
|---|---|---|
| Build | Vite | 6.x |
| UI | React | 19.x |
| Tipos | TypeScript | 5.x (strict: true) |
| Estilo | Tailwind CSS | 4.x |
| Componentes base | shadcn/ui | latest |
| Roteamento | React Router | 7.x |
| Data fetching | TanStack Query | 5.x |
| Astronomia | SunCalc | 1.9.x (puro JS, zero rede) |
| Testes unitários | Vitest + Testing Library | latest |
| Testes E2E | Playwright | latest |
| Lint | ESLint (flat config) | 9.x |
| Formatação | Prettier | 3.x |
| Package manager | pnpm | 9.x |

---

## 4. Estrutura de Diretórios

```
src/
├── api/
│   ├── client.ts         # fetch — aponta para o BFF, não para a API direta
│   ├── locations.ts      # getLocationsByGeo(), getLocationsByName()
│   └── tides.ts          # getTidesByDay()
├── components/
│   ├── ui/               # shadcn/ui — NUNCA editar manualmente
│   ├── tide/             # TideEventCard, TideChart, TideStatusCard
│   ├── location/         # LocationHeader, LocationSearch
│   └── navigation/       # DateStrip, BottomNav
├── hooks/
│   ├── useGeolocation.ts
│   ├── useNearbyLocations.ts
│   ├── useLocationSearch.ts
│   ├── useTides.ts
│   └── useTideState.ts   # interpolação do estado atual
├── pages/
│   ├── DashboardPage.tsx
│   ├── LocalesPage.tsx
│   └── AjustesPage.tsx
├── types/
│   └── api.ts            # Location, Tide, TideType — fonte única
├── utils/
│   ├── geo.ts            # parseGeoPoint(), haversineDistance()
│   ├── date.ts           # toApiDate(), todayInTimezone(), addDays(), formatDisplayDate()
│   ├── tide.ts           # interpolateTideHeight(), getTideStatus(), buildTideCurve()
│   └── sun.ts            # getSunTimes() via SunCalc
└── lib/
    └── queryClient.ts
```

---

## 5. Design System (Stitch)

### Paleta de Cores

```css
:root {
  --color-primary:          #12C5D6;
  --color-primary-dark:     #0A9EAD;
  --color-primary-light:    #E0F8FB;

  --color-bg-page:          #F0F5F9;
  --color-bg-card:          #FFFFFF;

  --color-text-primary:     #1A2B4A;
  --color-text-secondary:   #7A8899;
  --color-text-muted:       #A8B5C2;

  --color-high-tide:        #12C5D6;
  --color-low-tide:         #7A8899;
  --color-chart-line:       #12C5D6;
  --color-chart-fill:       rgba(18, 197, 214, 0.12);

  --color-tab-active-bg:    #0B3950;
  --color-tab-active-text:  #FFFFFF;
  --color-nav-active:       #12C5D6;
  --color-nav-inactive:     #9AAAB8;
}
```

### Tipografia

```
Location name:    20px / 600 / text-primary
Seção label:      11px / 500 / text-muted / uppercase / tracking-widest
Valor principal:  28px / 700 / text-primary
Horário evento:   13px / 500 / text-secondary
Altura evento:    18px / 700 / text-primary
Label evento:     11px / 600 / uppercase (PREIA / BAIXA)
Badge:            12px / 600
```

### Componentes do Design

```
DateStrip
  Scroll horizontal de chips — ativo: bg #0B3950 + texto branco + rounded-full
  Formato: "12 Out" (dia + mês abreviado pt-BR)

TideStatusCard ("Estado Atual")
  Badge "MARÉ SUBINDO" / "MARÉ DESCENDO" (pill primário)
  Tipo: "Enchente" / "Vazante"
  Altura interpolada: "X.XX m"
  Barra de progresso entre baixa e preia adjacentes
  Rótulos: "Baixa: Xm" ← barra → "Preia: Xm"

TideChart ("Linha do Tempo")
  Curva via spline cúbico entre os eventos
  Área preenchida em ciano claro (--color-chart-fill)
  Marcadores: círculo preenchido (HIGH), círculo vazio (LOW)
  Linha vertical "agora" + marcador de posição

TideEventCards (row com scroll horizontal)
  ↑ / ↓ conforme tipo
  Badge "AGORA" no evento imediatamente anterior ao momento atual
  Badge "PREIA" outline no próximo HIGH

SunInfoCards (grid 2 colunas)
  Calculados via SunCalc.js (lat/lon da Location) — zero chamada de rede

BottomNav (3 tabs)
  Dashboard (ondas) | Locais (pin) | Ajustes (engrenagem)
```

### Terminologia PT-BR obrigatória na UI

```
HIGH   → "Preia" / "Preia-mar"
LOW    → "Baixa" / "Baixa-mar"
rising → "Enchente" / "Maré Subindo"
falling→ "Vazante" / "Maré Descendo"
```

---

## 6. Endpoints

### BFF (chamados pelo React)

```
GET /locations?lat={f}&lon={f}
GET /locations?name={string}
GET /tides/{locationId}/{day}        day: yyyy-MM-dd
```

### Tide API (chamados apenas pelo BFF)

```
POST /api/auth/token                 NUNCA no bundle do frontend
GET  /api/location?lat=&lon=
GET  /api/location?name=             confirmado
GET  /api/location/{id}/tides/{day}
```

### Tipos canônicos (src/types/api.ts)

```typescript
type Location = {
  id: string; marineId: string; name: string
  point: string           // "POINT(lon lat)" — usar parseGeoPoint()
  meanSeaLevel: number; timezone: string
}
type TideType = 'HIGH' | 'LOW'
type Tide = { time: string; height: number; type: TideType }
```

---

## 7. Computação Client-Side

### Interpolação de maré (src/utils/tide.ts)

A API retorna eventos discretos. Para "Estado Atual" calculamos no cliente:

```
1. Identificar dois eventos adjacentes ao momento atual (anterior + próximo)
2. Normalizar o tempo entre eles: t ∈ [0, 1]
3. Cosine interpolation: height = h1 + (h2 - h1) * (1 - cos(t * π)) / 2
4. Status: próximo evento HIGH → enchente; próximo evento LOW → vazante
5. Curva do gráfico: N pontos interpolados cobrindo o dia inteiro
```

### SunCalc (src/utils/sun.ts)

```typescript
import SunCalc from 'suncalc'
// getSunTimes(date, lat, lon) → { sunrise: Date, sunset: Date }
// Determinístico, zero rede, pode ser memoizado com useMemo
```

---

## 8. TanStack Query

```typescript
const locationKeys = {
  nearby: (lat: number, lon: number) => ['locations', 'nearby', { lat, lon }] as const,
  search: (name: string) => ['locations', 'search', { name }] as const,
}
const tideKeys = {
  day: (locationId: string, day: string) => ['tides', locationId, day] as const,
}
// Stale times: locations 30min | tides passados Infinity | tides hoje 5min
```

---

## 9. Ciclo SDD

Nunca escreva código de feature sem spec aprovada.

```
.claude/
├── adr/
│   ├── ADR-001-autenticacao-bff.md
│   └── ADR-002-busca-por-nome.md
└── specs/
    ├── 00-project-overview.md
    ├── 01-tide-display/       requirements.md + design.md + tasks.md
    ├── 02-location-search/    requirements.md + design.md + tasks.md
    └── 03-date-navigation/    requirements.md + design.md + tasks.md
```

Ao receber uma tarefa: ler requirements.md e design.md antes de gerar qualquer código.

---

## 10. Gates de Qualidade

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

- `src/utils/` e `src/api/`: cobertura ≥ 80%
- Sem `any` ou `@ts-ignore` sem comentário justificando
- Sem fetch direto em componente — sempre TanStack Query

---

## 11. Proibições

- Não instalar deps não listadas sem proposta explícita
- Não usar `useEffect` para data fetching
- Não criar lógica de negócio em componentes — extrair para hooks
- Não editar `src/components/ui/`
- Não commitar `.env` ou credenciais
- Não chamar a Tide API diretamente — sempre via BFF
