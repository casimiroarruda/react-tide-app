// src/api/locations.ts
// Funções de acesso ao endpoint de locations do BFF.

import { apiFetch } from './client'
import type { Location } from '@/types/api'

type GeoParams = { lat: number; lon: number }
type NameParams = { name: string }

/**
 * Busca locations próximas a uma coordenada geográfica.
 * O BFF faz proxy de GET /api/location?lat=&lon= na Tide API.
 * Retorna lista ordenada por proximidade.
 */
export async function getLocationsByGeo(
    params: GeoParams
): Promise<Location[]> {
    return apiFetch<Location[]>('/locations', {
        params: { lat: params.lat, lon: params.lon },
    })
}

/**
 * Busca locations pelo nome (busca parcial, case-insensitive na API).
 * O BFF faz proxy de GET /api/location?name= na Tide API.
 */
export async function getLocationsByName(
    params: NameParams
): Promise<Location[]> {
    return apiFetch<Location[]>('/locations', {
        params: { name: params.name },
    })
}