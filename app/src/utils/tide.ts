// src/utils/tide.ts
// Computação client-side do estado da maré.
// A API retorna apenas eventos discretos (HIGH/LOW). Tudo aqui é derivado deles.
// Todas as funções são puras — sem side effects, fáceis de testar.

import type { Tide, TideState, TideCurvePoint } from '@/types/api'

// ---------------------------------------------------------------------------
// Interpolação de altura
// ---------------------------------------------------------------------------

/**
 * Interpola a altura da maré em um instante `now` usando interpolação cossenoidal.
 *
 * A interpolação cossenoidal (vs linear) é natural para ondas de maré porque:
 * - Suaviza a curva nas proximidades dos picos e vales
 * - Produz aceleração/desaceleração realista da maré
 *
 * Fórmula: height = h1 + (h2 - h1) * (1 - cos(t * π)) / 2
 * onde t ∈ [0, 1] é a posição normalizada entre os dois eventos adjacentes.
 *
 * Edge cases:
 * - Array vazio → retorna 0
 * - now antes de todos os eventos → extrapola com o primeiro par
 * - now após todos os eventos → retorna a altura do último evento
 */
export function interpolateTideHeight(tides: Tide[], now: Date): number {
    if (tides.length === 0) return 0
    if (tides.length === 1) return tides[0].height

    const sorted = sortByTime(tides)
    const nowMs = now.getTime()

    // now está após o último evento
    if (nowMs >= new Date(sorted[sorted.length - 1].time).getTime()) {
        return sorted[sorted.length - 1].height
    }

    // Encontra o par de eventos que envolve `now`
    // Se now for antes do primeiro evento, usa o primeiro par
    let prev = sorted[0]
    let next = sorted[1]

    for (let i = 0; i < sorted.length - 1; i++) {
        const tPrev = new Date(sorted[i].time).getTime()
        const tNext = new Date(sorted[i + 1].time).getTime()
        if (nowMs >= tPrev && nowMs < tNext) {
            prev = sorted[i]
            next = sorted[i + 1]
            break
        }
    }

    const tPrev = new Date(prev.time).getTime()
    const tNext = new Date(next.time).getTime()

    // t normalizado [0, 1] — onde estamos entre prev e next
    const t = Math.max(0, Math.min(1, (nowMs - tPrev) / (tNext - tPrev)))

    // Interpolação cossenoidal
    const factor = (1 - Math.cos(t * Math.PI)) / 2
    return prev.height + (next.height - prev.height) * factor
}

// ---------------------------------------------------------------------------
// Status da maré (subindo / descendo)
// ---------------------------------------------------------------------------

/**
 * Determina se a maré está subindo ou descendo no instante `now`.
 *
 * Lógica: olha o PRÓXIMO evento após `now`.
 * - Próximo é HIGH → maré está subindo → "rising" (Enchente)
 * - Próximo é LOW  → maré está descendo → "falling" (Vazante)
 *
 * Se `now` está após todos os eventos, usa o tipo do último evento invertido
 * (se o dia terminou com HIGH, agora está descendo).
 */
export function getTideStatus(
    tides: Tide[],
    now: Date
): TideState['status'] {
    if (tides.length === 0) return 'rising'

    const sorted = sortByTime(tides)
    const nowMs = now.getTime()

    const nextEvent = sorted.find(
        (t) => new Date(t.time).getTime() > nowMs
    )

    if (!nextEvent) {
        // Após todos os eventos: inverte o tipo do último
        const last = sorted[sorted.length - 1]
        return last.type === 'HIGH' ? 'falling' : 'rising'
    }

    return nextEvent.type === 'HIGH' ? 'rising' : 'falling'
}

/**
 * Retorna o estado completo da maré no instante `now`.
 * Combina interpolateTideHeight + getTideStatus + label em pt-BR.
 */
export function getTideState(tides: Tide[], now: Date): TideState {
    const status = getTideStatus(tides, now)
    return {
        height: interpolateTideHeight(tides, now),
        status,
        label: status === 'rising' ? 'Enchente' : 'Vazante',
    }
}

// ---------------------------------------------------------------------------
// Curva para o gráfico
// ---------------------------------------------------------------------------

/**
 * Gera N pontos uniformes ao longo do dia para renderizar a curva do gráfico.
 *
 * Intervalo: do horário do primeiro evento ao do último evento do dia.
 * Cada ponto chama interpolateTideHeight internamente.
 *
 * @param tides  Eventos do dia retornados pela API
 * @param points Número de pontos a gerar (padrão: 200 — suave para SVG)
 */
export function buildTideCurve(
    tides: Tide[],
    points: number = 200
): TideCurvePoint[] {
    if (tides.length < 2) return []

    const sorted = sortByTime(tides)
    const startMs = new Date(sorted[0].time).getTime()
    const endMs = new Date(sorted[sorted.length - 1].time).getTime()
    const stepMs = (endMs - startMs) / (points - 1)

    return Array.from({ length: points }, (_, i) => {
        const time = new Date(startMs + i * stepMs)
        return {
            time,
            height: interpolateTideHeight(sorted, time),
        }
    })
}

// ---------------------------------------------------------------------------
// Helpers de progresso (para a barra no TideStatusCard)
// ---------------------------------------------------------------------------

/**
 * Retorna o evento LOW e HIGH do par atual que envolve `now`.
 * Usado para calcular o progresso da barra ("Baixa: X.Xm ← barra → Preia: X.Xm").
 */
export function getCurrentTideBounds(
    tides: Tide[],
    now: Date
): { low: Tide; high: Tide } | null {
    if (tides.length < 2) return null

    const sorted = sortByTime(tides)
    const nowMs = now.getTime()

    let prevIndex = 0
    for (let i = 0; i < sorted.length - 1; i++) {
        if (nowMs >= new Date(sorted[i].time).getTime()) {
            prevIndex = i
        }
    }

    const prev = sorted[prevIndex]
    const next = sorted[Math.min(prevIndex + 1, sorted.length - 1)]

    if (prev.type === 'LOW' && next.type === 'HIGH') {
        return { low: prev, high: next }
    }
    if (prev.type === 'HIGH' && next.type === 'LOW') {
        return { low: next, high: prev }
    }

    return null
}

/**
 * Calcula o progresso [0, 1] da barra entre baixa e preia.
 * 0 = maré baixa, 1 = maré alta.
 */
export function getTideProgress(tides: Tide[], now: Date): number {
    const bounds = getCurrentTideBounds(tides, now)
    if (!bounds) return 0

    const current = interpolateTideHeight(tides, now)
    const range = bounds.high.height - bounds.low.height
    if (range === 0) return 0

    return Math.max(0, Math.min(1, (current - bounds.low.height) / range))
}

// ---------------------------------------------------------------------------
// Utilitário interno
// ---------------------------------------------------------------------------

function sortByTime(tides: Tide[]): Tide[] {
    return [...tides].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    )
}