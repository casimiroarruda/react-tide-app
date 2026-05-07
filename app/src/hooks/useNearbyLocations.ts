// src/hooks/useNearbyLocations.ts
import { useQuery } from '@tanstack/react-query'
import { getLocationsByGeo } from '@/api/locations'

export const locationKeys = {
    all: ['locations'] as const,
    nearby: (lat: number, lon: number) => [...locationKeys.all, 'nearby', { lat, lon }] as const,
    search: (name: string) => [...locationKeys.all, 'search', { name }] as const,
}

/**
 * Hook para buscar localidades próximas às coordenadas fornecidas.
 * Stale time: 30 minutos (localidades raramente mudam).
 */
export function useNearbyLocations(lat?: number, lon?: number) {
    return useQuery({
        queryKey: locationKeys.nearby(lat ?? 0, lon ?? 0),
        queryFn: () => getLocationsByGeo({ lat: lat!, lon: lon! }),
        enabled: lat !== undefined && lon !== undefined,
        staleTime: 1000 * 60 * 30, // 30 minutos
    })
}
