// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import { DashboardPage } from '@/pages/DashboardPage'

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
                <DashboardPage />
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
