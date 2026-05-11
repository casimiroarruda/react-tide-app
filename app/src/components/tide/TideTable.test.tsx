import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TideTable } from './TideTable'
import type { TimelineEvent } from '@/types/api'

describe('TideTable', () => {
    const mockEvents: TimelineEvent[] = [
        {
            kind: 'tide',
            tide: { time: '2026-05-07T04:00:00-03:00', height: 0.2, type: 'LOW' },
            isNow: false,
            isNextHigh: false,
            sortTime: new Date('2026-05-07T04:00:00-03:00').getTime(),
        },
        {
            kind: 'tide',
            tide: { time: '2026-05-07T10:00:00-03:00', height: 1.5, type: 'HIGH' },
            isNow: false,
            isNextHigh: true,
            sortTime: new Date('2026-05-07T10:00:00-03:00').getTime(),
        },
    ]

    it('deve exibir o estado de carregamento', () => {
        render(<TideTable events={[]} loading={true} timezone="America/Sao_Paulo" />)
        // O loading renderiza 4 skeletons
        const skeletons = screen.getAllByRole('generic').filter(el => el.className.includes('bg-gray-100'))
        expect(skeletons.length).toBeGreaterThanOrEqual(4)
    })

    it('deve exibir mensagem de erro', () => {
        const error = new Error('Falha na rede')
        render(<TideTable events={[]} error={error} timezone="America/Sao_Paulo" />)
        
        expect(screen.getByText('Erro ao carregar marés')).toBeInTheDocument()
        expect(screen.getByText('Falha na rede')).toBeInTheDocument()
    })

    it('deve exibir estado vazio quando não há marés', () => {
        render(<TideTable events={[]} timezone="America/Sao_Paulo" />)
        
        expect(screen.getByText('Sem dados para este dia')).toBeInTheDocument()
    })

    it('deve renderizar a lista de marés com sucesso', () => {
        render(<TideTable events={mockEvents} timezone="America/Sao_Paulo" />)
        
        expect(screen.getByText('Linha do Tempo')).toBeInTheDocument()
        
        // Verifica se as alturas estão presentes
        expect(screen.getByText(/0\.20/)).toBeInTheDocument()
        expect(screen.getByText(/1\.50/)).toBeInTheDocument()
        
        // Verifica se os rótulos Preia/Baixa estão corretos (match case-insensitive)
        expect(screen.getByText(/baixa/i)).toBeInTheDocument()
        expect(screen.getByText(/preia/i)).toBeInTheDocument()
    })
})
