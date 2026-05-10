// src/App.tsx
// Layout responsivo:
// - Mobile (< lg): roteamento por tabs com BottomNav
// - Desktop (≥ lg): dois painéis lado a lado, sem BottomNav
// Estratégia CSS-only: zero JS de detecção de viewport, zero flash de layout.

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/lib/queryClient'
import { LocationProvider } from '@/contexts/LocationContext'
import { BottomNav } from '@/components/navigation/BottomNav'
import { DashboardPage } from '@/pages/DashboardPage'
import { LocalesPage } from '@/pages/LocalesPage'
import { AjustesPage } from '@/pages/AjustesPage'

function AppLayout() {
    return (
        <>
            {/* ── Mobile (< 1024px): uma página por vez + BottomNav ── */}
            <div className="lg:hidden">
                <Outlet />
                <BottomNav />
            </div>

            {/* ── Desktop (≥ 1024px): dois painéis simultâneos ── */}
            <div className="hidden lg:flex h-screen overflow-hidden bg-[var(--color-bg-page)]">
                {/* Painel esquerdo — Dashboard */}
                <div
                    className="w-[420px] shrink-0 overflow-y-auto bg-[var(--color-bg-page)] border-r border-gray-200"
                    style={{ boxShadow: '2px 0 12px rgba(0,0,0,0.04)' }}
                >
                    <DashboardPage />
                </div>

                {/* Painel direito — Locais */}
                <div className="flex-1 overflow-y-auto">
                    <LocalesPage />
                </div>
            </div>
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