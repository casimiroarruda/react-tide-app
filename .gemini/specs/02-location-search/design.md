# Feature 02 — Location Search: Design

## Decisão Arquitetural — Estado Global

`selectedLocation` é promovido de estado local do `DashboardPage`
para um `LocationContext` compartilhado. Motivo: tanto `DashboardPage`
quanto `LocalesPage` precisam ler e escrever a localidade selecionada.

O `LocationContext` também absorve a lógica de inicialização via
geolocalização, que sai do `DashboardPage`.

## Estrutura de Roteamento

```
<App>                          ← QueryClientProvider + LocationProvider + Router
  <AppLayout>                  ← Outlet + BottomNav fixo
    /             → redirect /dashboard
    /dashboard    → DashboardPage
    /locais       → LocalesPage
    /ajustes      → AjustesPage (placeholder)
```

## Componentes novos

```
src/
├── contexts/
│   └── LocationContext.tsx    ← selectedLocation + setSelectedLocation + init geo
├── App.tsx                    ← router + providers + AppLayout
├── pages/
│   ├── LocalesPage.tsx        ← busca + lista de resultados
│   └── AjustesPage.tsx        ← placeholder
└── components/
    ├── navigation/
    │   └── BottomNav.tsx      ← 3 tabs com React Router
    └── location/
        ├── LocationSearchInput.tsx
        └── LocationListItem.tsx
```

## Fluxo de dados — LocalesPage

```
[usuário digita] → useLocationSearch(query) → GET /locations?name=
[usuário clica ícone GPS] → geo.coords → useNearbyLocations → seleciona [0]
[usuário toca item] → setSelectedLocation(location) → navigate('/dashboard')
```

## DashboardPage após refactor

Remove: useState(selectedLocation), useEffect de init, useGeolocation, useNearbyLocations
Adiciona: const { selectedLocation } = useLocationContext()
Mantém: selectedDate, navegação por teclado, useTides, render