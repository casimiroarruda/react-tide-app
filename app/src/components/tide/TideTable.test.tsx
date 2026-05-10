// src/components/tide/TideTable.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TideTable } from './TideTable'
import type { Tide } from '@/types/api'

describe('TideTable', () => {
    const mockTides: Tide[] = [
        { time: '2026-05-07T04:00:00-03:00', height: 0.2, type: 'LOW' },
        { time: '2026-05-07T10:00:00-03:00', height: 1.5, type: 'HIGH' },
    ]

    it('deve exibir o estado de carregamento', () => {
        render(<TideTable loading={true} timezone="America/Sao_Paulo" />)
        // O loading renderiza 4 skeletons (divs com bg-gray-100 animate-pulse)
        const skeletons = screen.getAllByRole('generic').filter(el => el.className.includes('bg-gray-100'))
        expect(skeletons.length).toBeGreaterThanOrEqual(4)
    })

    it('deve exibir mensagem de erro', () => {
        const error = new Error('Falha na rede')
        render(<TideTable error={error} timezone="America/Sao_Paulo" />)
        
        expect(screen.getByText('Erro ao carregar marés')).toBeInTheDocument()
        expect(screen.getByText('Falha na rede')).toBeInTheDocument()
    })

    it('deve exibir estado vazio quando não há marés', () => {
        render(<TideTable tides={[]} timezone="America/Sao_Paulo" />)
        
        expect(screen.getByText('Sem dados para este dia')).toBeInTheDocument()
    })

    it('deve renderizar a lista de marés com sucesso', () => {
        render(<TideTable tides={mockTides} timezone="America/Sao_Paulo" />)
        
        expect(screen.getByText('Eventos do Dia')).toBeInTheDocument()
        // O texto "0.20 m" está dividido em dois nodes
        expect(screen.getByText((content, element) => {
            return element?.tagName.toLowerCase() === 'div' && content.includes('0.20') && element.textContent?.includes('m')
        })).toBeInTheDocument()
        expect(screen.getByText((content, element) => {
            return element?.tagName.toLowerCase() === 'div' && content.includes('1.50') && element.textContent?.includes('m')
        })).toBeInTheDocument()
        
        // Verifica se os rótulos Preia/Baixa estão corretos (match case-insensitive)
        expect(screen.getByText(/baixa/i)).toBeInTheDocument()
        expect(screen.getByText(/preia/i)).toBeInTheDocument()
    })
})
