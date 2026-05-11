// src/components/tide/TideTable.tsx
import { AlertCircle, Waves } from 'lucide-react'
import { TideEventCard, SunEventRow, TideEventList } from './TideEventCard'
import type { TimelineEvent } from '@/types/api'

interface TideTableProps {
    events: TimelineEvent[]
    loading?: boolean
    error?: Error | null
    timezone: string
}

export function TideTable({ events, loading, error, timezone }: TideTableProps) {
    if (loading) {
        return (
            <section>
                <div className="px-4 pt-4 pb-2">
                    <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
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

    const hasTideData = events.some((e) => e.kind === 'tide')

    if (!hasTideData) {
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

    return (
        <section>
            <div className="px-4 pt-4 pb-2">
                <h2 className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                    Linha do Tempo
                </h2>
            </div>
            <TideEventList>
                {events.map((event) =>
                    event.kind === 'tide' ? (
                        <TideEventCard
                            key={event.tide.time}
                            tide={event.tide}
                            timezone={timezone}
                            isNow={event.isNow}
                            isNextHigh={event.isNextHigh}
                        />
                    ) : (
                        <SunEventRow
                            key={`sun-${event.eventType}`}
                            event={event}
                            timezone={timezone}
                        />
                    ),
                )}
            </TideEventList>
        </section>
    )
}