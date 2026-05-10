// src/components/tide/TideTable.tsx
import { AlertCircle, Waves } from 'lucide-react'
import { TideEventCard, TideEventList } from './TideEventCard'
import type { Tide } from '@/types/api'

interface TideTableProps {
    tides?: Tide[]
    loading?: boolean
    error?: Error | null
    timezone: string
}

export function TideTable({ tides, loading, error, timezone }: TideTableProps) {
    if (loading) {
        return (
            <section>
                <div className="px-4 pt-4 pb-2">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex flex-col gap-2 px-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[58px] bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                    Erro ao carregar marés
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {error.message || 'Tente novamente mais tarde.'}
                </p>
            </div>
        )
    }

    if (!tides || tides.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <Waves className="w-10 h-10 text-[var(--color-primary)]/30 mb-3" />
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                    Sem dados para este dia
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Não encontramos registros de maré para esta localidade na data selecionada.
                </p>
            </div>
        )
    }

    const nowMs = Date.now()

    // Último evento que já passou = "AGORA"
    let nowIndex = -1
    for (let i = 0; i < tides.length; i++) {
        if (new Date(tides[i].time).getTime() <= nowMs) nowIndex = i
    }

    // Próximo HIGH no futuro
    const nextHigh = tides.find(
        (t) => t.type === 'HIGH' && new Date(t.time).getTime() > nowMs
    )

    return (
        <section>
            <div className="px-4 pt-4 pb-2">
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