// src/api/tides.ts
// Funções de acesso ao endpoint de tides do BFF.

import { apiFetch } from './client'
import type { Tide } from '@/types/api'

type TidesParams = {
    locationId: string  // UUID
    day: string         // formato yyyy-MM-dd
}

/**
 * Busca os eventos de maré de um dia para uma location.
 * O BFF faz proxy de GET /api/location/{id}/tides/{day} na Tide API.
 *
 * Retorna array de Tide[] com os eventos HIGH/LOW do dia.
 * Array vazio significa que não há dados para esse dia/location.
 */
export async function getTidesByDay(params: TidesParams): Promise<Tide[]> {
    return apiFetch<Tide[]>(
        `/tides/${params.locationId}/${params.day}`
    )
}