// src/test/mocks/handlers.ts
// Handlers MSW que interceptam as chamadas ao BFF nos testes.
// Espelham exatamente os endpoints que o BFF vai expor.

import { http, HttpResponse } from 'msw'
import type { Location, Tide } from '@/types/api'



// ---------------------------------------------------------------------------
// Fixtures reutilizáveis nos testes
// ---------------------------------------------------------------------------

export const MOCK_LOCATIONS: Location[] = [
    {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        marineId: '25',
        name: 'Recife, PE',
        point: 'POINT(-34.8811 -8.0539)',
        meanSeaLevel: 1.28,
        timezone: 'America/Recife',
    },
    {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        marineId: '09',
        name: 'Salvador, BA',
        point: 'POINT(-38.5016 -12.9714)',
        meanSeaLevel: 1.45,
        timezone: 'America/Bahia',
    },
]

export const MOCK_TIDES: Tide[] = [
    { time: '2026-10-12T04:12:00-03:00', height: 0.24, type: 'LOW' },
    { time: '2026-10-12T10:35:00-03:00', height: 2.14, type: 'HIGH' },
    { time: '2026-10-12T16:52:00-03:00', height: 0.18, type: 'LOW' },
    { time: '2026-10-12T23:10:00-03:00', height: 2.08, type: 'HIGH' },
]

// ---------------------------------------------------------------------------
// Handlers padrão (cenário happy path)
// ---------------------------------------------------------------------------

export const handlers = [
    // GET /locations?lat=&lon= ou ?name=
    http.get(`*/locations`, ({ request }) => {
        const url = new URL(request.url)
        const name = url.searchParams.get('name')

        if (name) {
            const filtered = MOCK_LOCATIONS.filter((l) =>
                l.name.toLowerCase().includes(name.toLowerCase())
            )
            return HttpResponse.json(filtered)
        }

        // Geo: retorna todas (em produção viria ordenada por distância)
        return HttpResponse.json(MOCK_LOCATIONS)
    }),

    // GET /tides/{locationId}/{day}
    http.get(`*/tides/:locationId/:day`, ({ params }) => {
        const { locationId } = params

        // Location desconhecida → array vazio (sem dados)
        const known = MOCK_LOCATIONS.find((l) => l.id === locationId)
        if (!known) {
            return HttpResponse.json([])
        }

        return HttpResponse.json(MOCK_TIDES)
    }),
]