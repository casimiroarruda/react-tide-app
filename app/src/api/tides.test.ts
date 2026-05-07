// src/api/tides.test.ts
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { MOCK_TIDES, MOCK_LOCATIONS } from '@/test/mocks/handlers'
import { getTidesByDay } from './tides'
import { ApiError } from './client'

const BFF_URL = 'http://localhost:3001'
const KNOWN_ID = MOCK_LOCATIONS[0].id
const DAY = '2026-10-12'

describe('getTidesByDay', () => {
    it('retorna eventos de maré para location e dia válidos', async () => {
        const result = await getTidesByDay({ locationId: KNOWN_ID, day: DAY })
        expect(result).toHaveLength(MOCK_TIDES.length)
        expect(result[0]).toMatchObject({ type: 'LOW' })
    })

    it('retorna array vazio para location sem dados', async () => {
        const result = await getTidesByDay({
            locationId: 'unknown-id-000',
            day: DAY,
        })
        expect(result).toHaveLength(0)
    })

    it('constrói a URL correta com locationId e day', async () => {
        let capturedUrl = ''
        server.use(
            http.get(`${BFF_URL}/tides/:locationId/:day`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json(MOCK_TIDES)
            })
        )

        await getTidesByDay({ locationId: KNOWN_ID, day: DAY })
        expect(capturedUrl).toContain(KNOWN_ID)
        expect(capturedUrl).toContain(DAY)
    })

    it('lança ApiError em resposta 503', async () => {
        server.use(
            http.get(`${BFF_URL}/tides/:locationId/:day`, () =>
                HttpResponse.json(null, { status: 503 })
            )
        )

        await expect(
            getTidesByDay({ locationId: KNOWN_ID, day: DAY })
        ).rejects.toBeInstanceOf(ApiError)
    })

    it('todos os eventos têm type HIGH ou LOW', async () => {
        const result = await getTidesByDay({ locationId: KNOWN_ID, day: DAY })
        result.forEach((tide) => {
            expect(['HIGH', 'LOW']).toContain(tide.type)
        })
    })
})