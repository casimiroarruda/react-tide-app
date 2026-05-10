# Feature 04 — Desktop Layout: Design

## Estratégia: CSS-only, zero JS de detecção de viewport

Usar exclusivamente classes Tailwind responsivas (`lg:hidden`, `hidden lg:flex`).
Sem `useMediaQuery`, sem `window.innerWidth`, sem state de viewport.
Resultado: zero flash de layout, zero re-render por resize.

## Estrutura

```
AppLayout (atualizado)
  ├── Mobile  (lg:hidden)
  │     ├── <Outlet />       ← rota ativa (Dashboard ou Locais)
  │     └── <BottomNav />
  │
  └── Desktop (hidden lg:flex)
        ├── Painel esquerdo — w-[420px] shrink-0 overflow-y-auto
        │     └── <DashboardPage /> (renderizado diretamente, não via Outlet)
        └── Painel direito — flex-1 overflow-y-auto
              └── <LocalesPage />  (renderizado diretamente, não via Outlet)
```

## Por que funciona com o LocationContext

`DashboardPage` lê `selectedLocation` do context.
`LocalesPage` escreve `selectedLocation` no context via `setSelectedLocation`.
Quando o usuário clica numa localidade no painel direito → context atualiza →
painel esquerdo re-renderiza com os novos dados. Zero prop drilling.

## Queries TanStack Query em desktop

`LocationContext` e `LocalesPage` chamam `useNearbyLocations` com a mesma
query key. TanStack Query deduplica: uma única chamada de rede, dois consumidores.

## Ajustes nos componentes existentes

- `DashboardPage` e `LocalesPage`: `pb-20` → `pb-20 lg:pb-6`
  (remove padding do BottomNav em desktop)
- `LocalesPage`: `max-w-md` → `max-w-md lg:max-w-none`
  (usa largura total do painel direito em desktop)
- `LocalesPage`: `navigate('/dashboard')` ao selecionar localidade é no-op
  em desktop (layout não muda) — sem alteração necessária
