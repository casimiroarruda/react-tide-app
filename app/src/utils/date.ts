// src/utils/date.ts
// Helpers de data/hora para a tábua de marés.
// Todas as funções usam Intl com timeZone explícito — nunca toLocaleDateString() puro.
// Isso é crítico: a timezone da Location pode diferir da timezone do browser do usuário.

/**
 * Formata uma Date para o formato aceito pela API: "yyyy-MM-dd".
 * Usa locale "en-CA" que retorna datas nesse formato nativamente.
 */
export function toApiDate(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date)
}

/**
 * Retorna a data de hoje no formato da API, ajustada para a timezone da Location.
 * Evita o bug clássico de virada de meia-noite quando o usuário está em fuso diferente.
 *
 * Ex: usuário em UTC-3 às 23:30, Location em UTC-5 → ainda é "ontem" para a Location.
 */
export function todayInTimezone(timezone: string): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date())
}

/**
 * Adiciona N dias (positivo = futuro, negativo = passado) a uma data no formato "yyyy-MM-dd".
 * Constrói com T12:00:00 para evitar problemas de DST nas bordas do dia.
 */
export function addDays(apiDate: string, days: number): string {
    const date = new Date(`${apiDate}T12:00:00`)
    date.setDate(date.getDate() + days)
    return toApiDate(date)
}

/**
 * Formata "yyyy-MM-dd" para exibição em pt-BR.
 * Ex: "2026-04-22" → "qua., 22 de abr."
 * Usa a timezone da Location para garantir que o dia exibido está correto.
 */
export function formatDisplayDate(apiDate: string, timezone: string): string {
    const date = new Date(`${apiDate}T12:00:00`)
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(date)
}

/**
 * Formata a data abreviada para o DateStrip.
 * Ex: "2026-10-12" → "12 Out"
 */
export function formatStripDate(apiDate: string, timezone: string): string {
    const date = new Date(`${apiDate}T12:00:00`)
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        day: 'numeric',
        month: 'short',
    })
        .format(date)
        .replace('.', '') // remove ponto do mês abreviado em pt-BR
        .replace(/^\d+\s/, (m) => m) // mantém formato "12 out"
        .replace(/\b\w/g, (c) => c.toUpperCase()) // capitaliza mês
}

/**
 * Formata o campo `time` de um Tide (ISO 8601 com offset) para exibição HH:mm.
 * Usa a timezone da Location — não a timezone do browser.
 *
 * Ex: "2026-04-22T14:30:00-03:00" → "14:30"
 */
export function formatTideTime(isoTime: string, timezone: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(isoTime))
}

/**
 * Verifica se uma data no formato "yyyy-MM-dd" é hoje na timezone da Location.
 */
export function isToday(apiDate: string, timezone: string): boolean {
    return apiDate === todayInTimezone(timezone)
}

/**
 * Verifica se uma data no formato "yyyy-MM-dd" é passado na timezone da Location.
 */
export function isPast(apiDate: string, timezone: string): boolean {
    return apiDate < todayInTimezone(timezone)
}

export function formatDatetime(date: Date, timezone: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date)
}
