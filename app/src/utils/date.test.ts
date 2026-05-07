// src/utils/date.test.ts
import { describe, it, expect } from 'vitest'
import {
    toApiDate,
    addDays,
    formatDisplayDate,
    formatTideTime,
    isToday,
    isPast,
} from './date'

const TZ = 'America/Sao_Paulo'

describe('toApiDate', () => {
    it('formata para yyyy-MM-dd', () => {
        const date = new Date('2026-04-22T12:00:00')
        expect(toApiDate(date)).toBe('2026-04-22')
    })

    it('formata o primeiro dia do ano', () => {
        const date = new Date('2026-01-01T12:00:00')
        expect(toApiDate(date)).toBe('2026-01-01')
    })
})

describe('addDays', () => {
    it('avança 1 dia', () => {
        expect(addDays('2026-04-22', 1)).toBe('2026-04-23')
    })

    it('recua 1 dia', () => {
        expect(addDays('2026-04-22', -1)).toBe('2026-04-21')
    })

    it('cruza mês corretamente (30 abr → 1 mai)', () => {
        expect(addDays('2026-04-30', 1)).toBe('2026-05-01')
    })

    it('cruza mês ao recuar (1 mai → 30 abr)', () => {
        expect(addDays('2026-05-01', -1)).toBe('2026-04-30')
    })

    it('cruza ano corretamente (31 dez → 1 jan)', () => {
        expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    })

    it('adiciona 0 dias retorna a mesma data', () => {
        expect(addDays('2026-04-22', 0)).toBe('2026-04-22')
    })
})

describe('formatDisplayDate', () => {
    it('formata com dia da semana, dia e mês em pt-BR', () => {
        // 22 de abril de 2026 é uma quarta-feira
        const result = formatDisplayDate('2026-04-22', TZ)
        expect(result.toLowerCase()).toContain('abr')
        expect(result).toContain('22')
    })

    it('retorna string não vazia', () => {
        expect(formatDisplayDate('2026-10-12', TZ).length).toBeGreaterThan(0)
    })
})

describe('formatTideTime', () => {
    it('extrai HH:mm de um ISO 8601 com offset', () => {
        // 14:30 no horário de Brasília
        const result = formatTideTime('2026-04-22T14:30:00-03:00', TZ)
        expect(result).toBe('14:30')
    })

    it('converte corretamente quando o offset é diferente da timezone da location', () => {
        // UTC 17:30 = 14:30 em America/Sao_Paulo (UTC-3)
        const result = formatTideTime('2026-04-22T17:30:00Z', TZ)
        expect(result).toBe('14:30')
    })

    it('formata meia-noite como 00:00', () => {
        const result = formatTideTime('2026-04-22T03:00:00Z', TZ) // 00:00 em UTC-3
        expect(result).toBe('00:00')
    })
})

describe('isToday e isPast', () => {
    it('isPast retorna true para data no passado', () => {
        expect(isPast('2000-01-01', TZ)).toBe(true)
    })

    it('isPast retorna false para data no futuro', () => {
        expect(isPast('2099-12-31', TZ)).toBe(false)
    })

    it('isToday retorna false para data no passado', () => {
        expect(isToday('2000-01-01', TZ)).toBe(false)
    })

    it('isToday retorna false para data no futuro', () => {
        expect(isToday('2099-12-31', TZ)).toBe(false)
    })
})