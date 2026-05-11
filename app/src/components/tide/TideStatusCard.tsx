// src/components/tide/TideStatusCard.tsx
// Gauge vertical com:
// - Background cor de areia (#EDD9A3)
// - Fill de água em ciano
// - Onda SVG animada na fronteira água/areia
// - Marcador de posição atual

import { useMemo, useEffect, useState } from 'react'
import { getTideState, getTideProgress, getCurrentTideBounds } from '@/utils/tide'
import type { Tide } from '@/types/api'

type Props = {
    tides: Tide[]
}

// Cor de areia — aparece acima da linha d'água
const SAND = '#EDD9A3'
// Cor dos ticks da régua
const TICK = 'rgba(160, 110, 40, 0.45)'
// Cor da água
const WATER = '#12C5D6'

export function TideStatusCard({ tides }: Props) {
    const [now, setNow] = useState(() => new Date())

    // Atualiza a cada 60 segundos
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(id)
    }, [])

    const state = useMemo(() => getTideState(tides, now), [tides, now])
    const progress = useMemo(() => getTideProgress(tides, now), [tides, now])
    const bounds = useMemo(() => getCurrentTideBounds(tides, now), [tides, now])

    const isRising = state.status === 'rising'
    const fillPercent = Math.round(progress * 100)

    // Velocidade da animação: maré subindo → mais agitada; descendo → mais calma
    const waveSpeed = isRising ? '2s' : '3.5s'

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

                {/* Badge subindo / descendo */}
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

            {/* Gauge + info */}
            <div className="flex items-stretch gap-4 px-4 pb-4">

                {/* ── Régua vertical ── */}
                <div className="flex flex-col items-center gap-1 shrink-0 min-w-[140px]">
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                        Preia
                    </span>

                    {/* Coluna principal */}
                    <div className="relative w-7 flex-1 min-h-[90px] min-w-[120px]">

                        {/* Fundo areia */}
                        <div
                            className="absolute inset-0 rounded-lg overflow-hidden"
                            style={{ background: SAND }}
                        >
                            {/* Marcas de graduação (régua de porto) */}
                            {[0.2, 0.4, 0.6, 0.8].map((pct) => (
                                <div
                                    key={pct}
                                    className="absolute right-0"
                                    style={{
                                        bottom: `${pct * 100}%`,
                                        width: pct % 0.4 === 0 ? '55%' : '35%',
                                        height: 1,
                                        background: TICK,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Fill de água (sem border-radius no topo — onda cuida disso) */}
                        <div
                            className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                            style={{
                                height: `${fillPercent}%`,
                                background: WATER,
                                borderRadius: '0 0 8px 8px',
                            }}
                        />

                        {/* ── Onda animada na fronteira água/areia ── */}
                        {fillPercent > 2 && fillPercent < 98 && (
                            <div
                                className="absolute left-0 right-0 overflow-hidden pointer-events-none"
                                style={{
                                    height: 10,
                                    bottom: `calc(${fillPercent}% - 5px)`,
                                    zIndex: 5,
                                }}
                            >
                                {/*
                  O div interno é 200% da largura do gauge (2× = 56px).
                  O SVG tem viewBox 0 0 56 10 com 2 ciclos completos de onda.
                  translateX(-50%) desloca exatamente 1 ciclo → loop contínuo.
                */}
                                <div
                                    style={{
                                        width: '200%',
                                        height: '100%',
                                        animation: `tide-wave-shift ${waveSpeed} linear infinite`,
                                    }}
                                >
                                    <svg
                                        viewBox="0 0 56 10"
                                        preserveAspectRatio="none"
                                        style={{ width: '100%', height: '100%', display: 'block' }}
                                    >
                                        {/* Onda: topo sinusoidal + preenchimento até base */}
                                        <path
                                            d="M0,5 Q7,1 14,5 Q21,9 28,5 Q35,1 42,5 Q49,9 56,5 L56,10 L0,10 Z"
                                            fill={WATER}
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Marcador da posição atual */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000"
                            style={{ bottom: `calc(${fillPercent}% - 6px)`, zIndex: 10 }}
                        >
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-[var(--color-primary)] shadow" />
                        </div>

                        {/* Percentagem */}
                        <div
                            className="absolute -right-5 transition-all duration-1000 pointer-events-none"
                            style={{ bottom: `calc(${fillPercent}% - 7px)`, zIndex: 10 }}
                        >
                            <span className="text-[9px] font-bold text-[var(--color-primary)]">
                                {fillPercent}%
                            </span>
                        </div>
                    </div>

                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                        Baixa
                    </span>
                </div>

                {/* Separador */}
                <div className="w-px bg-gray-100 self-stretch mx-1" />

                {/* ── Info direita ── */}
                <div className="flex-1 flex flex-col justify-between py-1 gap-3">
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

                    <div className="h-px bg-gray-100" />

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