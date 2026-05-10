import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LocalesPage } from './LocalesPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { LocationContext } from '@/contexts/LocationContextCore'

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 0,
        },
    },
})

describe('LocalesPage', () => {
    it('deve renderizar o título e o input de busca', () => {
        const queryClient = createTestQueryClient()
        render(
            <QueryClientProvider client={queryClient}>
                <LocationContext.Provider value={{ selectedLocation: null, setSelectedLocation: vi.fn(), isInitializing: false }}>
                    <BrowserRouter>
                        <LocalesPage />
                    </BrowserRouter>
                </LocationContext.Provider>
            </QueryClientProvider>
        )

        expect(screen.getByText('Localidades')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument()
    })

    it('deve exibir resultados da busca quando o usuário digita', async () => {
        const queryClient = createTestQueryClient()
        render(
            <QueryClientProvider client={queryClient}>
                <LocationContext.Provider value={{ selectedLocation: null, setSelectedLocation: vi.fn(), isInitializing: false }}>
                    <BrowserRouter>
                        <LocalesPage />
                    </BrowserRouter>
                </LocationContext.Provider>
            </QueryClientProvider>
        )

        const input = screen.getByPlaceholderText(/buscar/i)
        fireEvent.change(input, { target: { value: 'Recife' } })

        // No LocationListItem, o nome é splitado em Cidade e UF
        expect(await screen.findByText('Recife', {}, { timeout: 10000 })).toBeInTheDocument()
        expect(screen.getByText('PE')).toBeInTheDocument()
    }, 20000)
})
