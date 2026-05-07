// src/components/tide/TideStatusCard.tsx
import { useMemo } from 'react'
import type { Tide } from '@/types/api'
import { useTideState } from '@/hooks/useTideState'
import { getCurrentTideBounds } from '@/utils/tide'

interface TideStatusCardProps {
    tides: Tide[]
}

/**
 * Card de Estado Atual da Maré.
 * Exibe altura interpolada, status (subindo/descendo) e progresso.
 */
export function TideStatusCard({ tides }: TideStatusCardProps) {
    const { height, status, label, progress } = useTideState(tides)

    // Busca os limites (baixa e preia) para os rótulos da barra
    const bounds = useMemo(() => {
        return getCurrentTideBounds(tides, new Date())
    }, [tides])

    const isRising = status === 'rising'

    return (
        <div className="mx-6 p-6 bg-white rounded-3xl shadow-sm border border-border/40">
            {/* Header com Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
                        Estado Atual
                    </span>
                    <span className="text-[28px] font-bold text-[var(--color-text-primary)]">
                        {height.toFixed(2)}m
                    </span>
                </div>
                <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isRising
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-text-secondary)] text-white'
                    }`}
                >
                    {isRising ? 'Maré Subindo' : 'Maré Descendo'}
                </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-3">
                <div className="relative w-full h-2 bg-[var(--color-bg-page)] rounded-full overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full bg-[var(--color-primary)] transition-all duration-1000"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>

                {/* Rótulos da Barra */}
                <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wider">
                    <div className="flex flex-col items-start">
                        <span className="text-[var(--color-text-muted)] mb-0.5">Baixa</span>
                        <span className="text-[var(--color-text-primary)]">
                            {bounds?.low.height.toFixed(2)}m
                        </span>
                    </div>
                    <div className="text-[var(--color-primary)] font-bold">
                        {label}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[var(--color-text-muted)] mb-0.5">Preia</span>
                        <span className="text-[var(--color-text-primary)]">
                            {bounds?.high.height.toFixed(2)}m
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
