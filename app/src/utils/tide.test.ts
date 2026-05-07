// src/utils/tide.test.ts
import { describe, it, expect } from 'vitest'
import {
    interpolateTideHeight,
    getTideStatus,
    getTideState,
    buildTideCurve,
    getTideProgress,
} from './tide'
import type { Tide } from '@/types/api'

// ---------------------------------------------------------------------------
// Fixtures — dia típico com 4 eventos (Recife, 12/10/2026 — exemplo ilustrativo)
// ---------------------------------------------------------------------------

const TIDES: Tide[] = [
    { time: '2026-10-12T04:12:00-03:00', height: 0.24, type: 'LOW' },
    { time: '2026-10-12T10:35:00-03:00', height: 2.14, type: 'HIGH' },
    { time: '2026-10-12T16:52:00-03:00', height: 0.18, type: 'LOW' },
    { time: '2026-10-12T23:10:00-03:00', height: 2.08, type: 'HIGH' },
]

// Horário "agora" no meio do dia, entre os dois primeiros eventos
const NOW_RISING = new Date('2026-10-12T07:20:00-03:00') // entre LOW 04:12 e HIGH 10:35
const NOW_FALLING = new Date('2026-10-12T13:40:00-03:00') // entre HIGH 10:35 e LOW 16:52

describe('interpolateTideHeight', () => {
    it('retorna 0 para array vazio', () => {
        expect(interpolateTideHeight([], new Date())).toBe(0)
    })

    it('retorna a altura do único evento se só houver um', () => {
        const single: Tide[] = [{ time: '2026-10-12T10:00:00-03:00', height: 2.14, type: 'HIGH' }]
        expect(interpolateTideHeight(single, new Date())).toBe(2.14)
    })

    it('retorna h1 quando now é exatamente no primeiro evento', () => {
        const t0 = new Date('2026-10-12T04:12:00-03:00')
        const result = interpolateTideHeight(TIDES, t0)
        expect(result).toBeCloseTo(0.24, 1)
    })

    it('retorna h2 quando now é exatamente no segundo evento', () => {
        const t1 = new Date('2026-10-12T10:35:00-03:00')
        const result = interpolateTideHeight(TIDES, t1)
        expect(result).toBeCloseTo(2.14, 1)
    })

    it('retorna valor intermediário no meio do intervalo', () => {
        // No meio entre LOW(0.24) e HIGH(2.14), cosine interpolation retorna ≈ metade
        const midTime = new Date('2026-10-12T07:23:30-03:00') // ~meio do intervalo 04:12–10:35
        const result = interpolateTideHeight(TIDES, midTime)
        expect(result).toBeGreaterThan(0.24)
        expect(result).toBeLessThan(2.14)
        // No ponto médio da cosine interpolation o valor é (h1+h2)/2
        expect(result).toBeCloseTo((0.24 + 2.14) / 2, 0)
    })

    it('retorna a altura do último evento quando now está após todos', () => {
        const afterAll = new Date('2026-10-13T06:00:00-03:00')
        const result = interpolateTideHeight(TIDES, afterAll)
        expect(result).toBeCloseTo(2.08, 1)
    })

    it('funciona com tides fora de ordem (não ordena os dados originais)', () => {
        const shuffled = [...TIDES].reverse()
        const result = interpolateTideHeight(shuffled, NOW_RISING)
        const expected = interpolateTideHeight(TIDES, NOW_RISING)
        expect(result).toBeCloseTo(expected, 5)
    })
})

describe('getTideStatus', () => {
    it('retorna "rising" quando maré está subindo (próximo evento é HIGH)', () => {
        expect(getTideStatus(TIDES, NOW_RISING)).toBe('rising')
    })

    it('retorna "falling" quando maré está descendo (próximo evento é LOW)', () => {
        expect(getTideStatus(TIDES, NOW_FALLING)).toBe('falling')
    })

    it('retorna "rising" para array vazio (estado neutro)', () => {
        expect(getTideStatus([], new Date())).toBe('rising')
    })

    it('retorna "falling" após todos os eventos quando o último é HIGH', () => {
        // Último evento é HIGH(23:10) → após isso, maré está descendo
        const afterAll = new Date('2026-10-13T02:00:00-03:00')
        expect(getTideStatus(TIDES, afterAll)).toBe('falling')
    })
})

describe('getTideState', () => {
    it('retorna label "Enchente" quando rising', () => {
        const state = getTideState(TIDES, NOW_RISING)
        expect(state.label).toBe('Enchente')
        expect(state.status).toBe('rising')
    })

    it('retorna label "Vazante" quando falling', () => {
        const state = getTideState(TIDES, NOW_FALLING)
        expect(state.label).toBe('Vazante')
        expect(state.status).toBe('falling')
    })

    it('height está dentro do range do dia', () => {
        const state = getTideState(TIDES, NOW_RISING)
        expect(state.height).toBeGreaterThan(0)
        expect(state.height).toBeLessThan(2.5)
    })
})

describe('buildTideCurve', () => {
    it('retorna exatamente N pontos', () => {
        const curve = buildTideCurve(TIDES, 200)
        expect(curve).toHaveLength(200)
    })

    it('retorna N padrão de 200 quando não especificado', () => {
        const curve = buildTideCurve(TIDES)
        expect(curve).toHaveLength(200)
    })

    it('retorna array vazio se menos de 2 eventos', () => {
        expect(buildTideCurve([])).toHaveLength(0)
        expect(buildTideCurve([TIDES[0]])).toHaveLength(0)
    })

    it('primeiro ponto é no horário do primeiro evento', () => {
        const curve = buildTideCurve(TIDES, 100)
        const firstEventTime = new Date(TIDES[0].time).getTime()
        expect(curve[0].time.getTime()).toBeCloseTo(firstEventTime, -2) // margem de ~100ms
    })

    it('último ponto é no horário do último evento', () => {
        const sorted = [...TIDES].sort((a, b) =>
            new Date(a.time).getTime() - new Date(b.time).getTime()
        )
        const curve = buildTideCurve(TIDES, 100)
        const lastEventTime = new Date(sorted[sorted.length - 1].time).getTime()
        expect(curve[curve.length - 1].time.getTime()).toBeCloseTo(lastEventTime, -2)
    })

    it('todos os pontos têm height dentro do range do dia', () => {
        const curve = buildTideCurve(TIDES, 50)
        const minH = Math.min(...TIDES.map((t) => t.height))
        const maxH = Math.max(...TIDES.map((t) => t.height))
        curve.forEach((p) => {
            expect(p.height).toBeGreaterThanOrEqual(minH - 0.01)
            expect(p.height).toBeLessThanOrEqual(maxH + 0.01)
        })
    })
})

describe('getTideProgress', () => {
    it('retorna valor entre 0 e 1', () => {
        const progress = getTideProgress(TIDES, NOW_RISING)
        expect(progress).toBeGreaterThanOrEqual(0)
        expect(progress).toBeLessThanOrEqual(1)
    })

    it('retorna 0 para array vazio', () => {
        expect(getTideProgress([], new Date())).toBe(0)
    })

    it('progresso aumenta ao longo de um período de enchente', () => {
        const early = new Date('2026-10-12T05:00:00-03:00')
        const late = new Date('2026-10-12T09:00:00-03:00')
        const p1 = getTideProgress(TIDES, early)
        const p2 = getTideProgress(TIDES, late)
        expect(p2).toBeGreaterThan(p1)
    })
})