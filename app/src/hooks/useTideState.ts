// src/hooks/useTideState.ts
import { useState, useEffect, useMemo } from 'react'
import type { Tide, TideState } from '@/types/api'
import { getTideState, getTideProgress } from '@/utils/tide'

export type FullTideState = TideState & {
    progress: number
    updatedAt: Date
}

/**
 * Hook para calcular o estado da maré (altura, status, progresso) em tempo real.
 * Atualiza o estado a cada minuto para garantir precisão na interpolação.
 */
export function useTideState(tides: Tide[] = []): FullTideState {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        // Atualiza o relógio interno a cada minuto
        const timer = setInterval(() => {
            setNow(new Date())
        }, 1000 * 60)

        return () => clearInterval(timer)
    }, [])

    return useMemo(() => {
        const state = getTideState(tides, now)
        const progress = getTideProgress(tides, now)

        return {
            ...state,
            progress,
            updatedAt: now,
        }
    }, [tides, now])
}
