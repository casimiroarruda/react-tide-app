// src/api/locations.test.ts
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { MOCK_LOCATIONS } from '@/test/mocks/handlers'
import { getLocationsByGeo, getLocationsByName } from './locations'
import { ApiError } from './client'

const BFF_URL = 'http://localhost:3001'

describe('getLocationsByGeo', () => {
    it('retorna lista de locations para coordenadas válidas', async () => {
        const result = await getLocationsByGeo({ lat: -8.05, lon: -34.88 })
        expect(result).toHaveLength(MOCK_LOCATIONS.length)
        expect(result[0]).toMatchObject({ name: 'Recife, PE' })
    })

    it('envia lat e lon como query params', async () => {
        let capturedUrl = ''
        server.use(
            http.get(`${BFF_URL}/locations`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json(MOCK_LOCATIONS)
            })
        )

        await getLocationsByGeo({ lat: -8.05, lon: -34.88 })
        expect(capturedUrl).toContain('lat=-8.05')
        expect(capturedUrl).toContain('lon=-34.88')
    })

    it('lança ApiError em resposta 500', async () => {
        server.use(
            http.get(`${BFF_URL}/locations`, () =>
                HttpResponse.json({ error: 'server error' }, { status: 500 })
            )
        )

        await expect(getLocationsByGeo({ lat: -8.05, lon: -34.88 })).rejects.toBeInstanceOf(ApiError)
    })

    it('ApiError contém o status HTTP correto', async () => {
        server.use(
            http.get(`${BFF_URL}/locations`, () =>
                HttpResponse.json(null, { status: 404 })
            )
        )

        const error = await getLocationsByGeo({ lat: 0, lon: 0 }).catch((e) => e)
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).status).toBe(404)
    })
})

describe('getLocationsByName', () => {
    it('retorna locations filtradas pelo nome', async () => {
        const result = await getLocationsByName({ name: 'recife' })
        expect(result.length).toBeGreaterThan(0)
        expect(result[0].name.toLowerCase()).toContain('recife')
    })

    it('retorna array vazio para nome sem match', async () => {
        const result = await getLocationsByName({ name: 'xyzxyzxyz' })
        expect(result).toHaveLength(0)
    })

    it('envia name como query param', async () => {
        let capturedUrl = ''
        server.use(
            http.get(`${BFF_URL}/locations`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json([])
            })
        )

        await getLocationsByName({ name: 'santos' })
        expect(capturedUrl).toContain('name=santos')
    })
})