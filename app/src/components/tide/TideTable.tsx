// src/components/tide/TideTable.tsx
import { TideEventCard, TideEventList } from './TideEventCard'
import type { Tide } from '@/types/api'
import { AlertCircle, Waves } from 'lucide-react'

interface TideTableProps {
    tides?: Tide[]
    loading?: boolean
    error?: Error | null
    timezone: string
}

/**
 * Componente que gerencia a exibição dos eventos de maré do dia.
 * Lida com estados de carregamento, erro, vazio e sucesso.
 */
export function TideTable({ tides, loading, error, timezone }: TideTableProps) {
    if (loading) {
        return (
            <div className="flex gap-3 px-6 py-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="min-w-[110px] h-[120px] bg-muted animate-pulse rounded-2xl"
                    />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="w-12 h-12 text-destructive/50 mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Erro ao carregar marés
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                    {error.message || 'Tente novamente mais tarde.'}
                </p>
            </div>
        )
    }

    if (!tides || tides.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <Waves className="w-12 h-12 text-[var(--color-primary)]/30 mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Sem dados para este dia
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                    Não encontramos registros de maré para esta localidade na data selecionada.
                </p>
            </div>
        )
    }

    // Lógica para identificar "AGORA" e "PRÓXIMA PREIA"
    const nowMs = new Date().getTime()
    
    // O evento "AGORA" é o último evento que já aconteceu
    let nowIndex = -1
    for (let i = 0; i < tides.length; i++) {
        if (new Date(tides[i].time).getTime() <= nowMs) {
            nowIndex = i
        }
    }

    // O próximo HIGH após agora
    const nextHigh = tides.find((t) => 
        t.type === 'HIGH' && new Date(t.time).getTime() > nowMs
    )

    return (
        <section>
            <div className="px-6 pt-6 pb-2">
                <h2 className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                    Eventos do Dia
                </h2>
            </div>
            <TideEventList>
                {tides.map((tide, index) => (
                    <TideEventCard
                        key={tide.time}
                        tide={tide}
                        timezone={timezone}
                        isNow={index === nowIndex}
                        isNextHigh={tide.time === nextHigh?.time}
                    />
                ))}
            </TideEventList>
        </section>
    )
}
