// src/components/tide/TideStatusCard.tsx
// Indicador do estado atual da maré.
// Usa régua vertical (conceito de "tide gauge" de porto) em vez de barra horizontal —
// altura é um conceito vertical, mais intuitivo para o usuário.

import { useMemo, useEffect, useState } from 'react'
import { getTideState, getTideProgress, getCurrentTideBounds } from '@/utils/tide'
import type { Tide } from '@/types/api'

type Props = {
    tides: Tide[]
}

export function TideStatusCard({ tides }: Props) {
    // Atualiza o "agora" a cada 60 segundos
    const [now, setNow] = useState(() => new Date())
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(id)
    }, [])

    const state = useMemo(() => getTideState(tides, now), [tides, now])
    const progress = useMemo(() => getTideProgress(tides, now), [tides, now])
    const bounds = useMemo(() => getCurrentTideBounds(tides, now), [tides, now])

    const isRising = state.status === 'rising'

    // Altura do fill em % (0 = fundo, 100 = topo)
    const fillPercent = Math.round(progress * 100)

    return (
        <div className="mx-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                        Estado Atual
                    </p>
                    <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-0.5 leading-none">
                        {state.height.toFixed(2)}
                        <span className="text-base font-medium text-[var(--color-text-secondary)] ml-1">m</span>
                    </p>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
                        {state.label}
                    </p>
                </div>

                {/* Badge subindo/descendo */}
                <div className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                    isRising
                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
                        : 'bg-gray-100 text-[var(--color-text-secondary)]',
                ].join(' ')}>
                    {isRising ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                    )}
                    <span>MARÉ {isRising ? 'SUBINDO' : 'DESCENDO'}</span>
                </div>
            </div>

            {/* Gauge + labels */}
            <div className="flex items-stretch gap-4 px-4 pb-4">

                {/* Régua vertical — tide gauge */}
                <div className="flex flex-col items-center gap- shrink-0 min-w-[20vw]">
                    {/* Label topo */}
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                        Preia
                    </span>

                    {/* Coluna da régua */}
                    <div className="relative flex-4 w-6 min-h-[80px] min-w-[15vw]">
                        {/* Trilho de fundo — linhas horizontais estilo régua de porto */}
                        <div className="absolute inset-0 rounded-lg bg-gray-100 overflow-hidden">
                            {/* Linhas de graduação */}
                            {[0, 25, 50, 75, 100].map((pct) => (
                                <div
                                    key={pct}
                                    className="absolute left-0 right-0 h-px bg-gray-200"
                                    style={{ bottom: `${pct}%` }}
                                />
                            ))}
                        </div>

                        {/* Fill da água */}
                        <div
                            className="absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-1000"
                            style={{
                                height: `${fillPercent}%`,
                                background: 'linear-gradient(to top, var(--color-primary-dark), var(--color-primary))',
                                opacity: 0.85,
                            }}
                        />

                        {/* Marcador da posição atual */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000"
                            style={{ bottom: `calc(${fillPercent}% - 6px)` }}
                        >
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-[var(--color-primary)] shadow-md" />
                        </div>

                        {/* Valor percentual discreto */}
                        <div
                            className="absolute -right-6 transition-all duration-1000 pointer-events-none"
                            style={{ bottom: `calc(${fillPercent}% - 7px)` }}
                        >
                            <span className="text-[9px] font-bold text-[var(--color-primary)]">
                                {fillPercent}%
                            </span>
                        </div>
                    </div>

                    {/* Label base */}
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                        Baixa
                    </span>
                </div>

                {/* Separador */}
                <div className="w-px bg-gray-100 self-stretch mx-1" />

                {/* Info da direita */}
                <div className="flex-1 flex flex-col justify-between py-1 gap-3">
                    {/* Preia (topo da régua) */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                                Preia
                            </p>
                            <p className="text-lg font-bold text-[var(--color-high-tide)]">
                                {bounds?.high.height.toFixed(2) ?? '—'}
                                <span className="text-xs font-medium ml-0.5">m</span>
                            </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                    </div>

                    {/* Nível médio do mar */}
                    <div className="h-px bg-gray-100" />

                    {/* Baixa (base da régua) */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                                Baixa
                            </p>
                            <p className="text-lg font-bold text-[var(--color-text-secondary)]">
                                {bounds?.low.height.toFixed(2) ?? '—'}
                                <span className="text-xs font-medium ml-0.5">m</span>
                            </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    )
}