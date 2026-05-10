// src/App.tsx
// Raiz da aplicação: providers, roteamento e layout.

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/lib/queryClient'
import { LocationProvider } from '@/contexts/LocationContext'
import { BottomNav } from '@/components/navigation/BottomNav'
import { DashboardPage } from '@/pages/DashboardPage'
import { LocalesPage } from '@/pages/LocalesPage'
import { AjustesPage } from '@/pages/AjustesPage'

// Layout comum a todas as rotas: renderiza a página + BottomNav fixo
function AppLayout() {
    return (
        <>
            <Outlet />
            <BottomNav />
        </>
    )
}

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/locais" element={<LocalesPage />} />
                            <Route path="/ajustes" element={<AjustesPage />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </LocationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}