// src/hooks/useLocationSearch.ts
import { useQuery } from '@tanstack/react-query'
import { getLocationsByName } from '@/api/locations'
import { locationKeys } from './useNearbyLocations'

/**
 * Hook para buscar localidades por nome.
 * Habilitado apenas quando o termo de busca tem pelo menos 2 caracteres.
 */
export function useLocationSearch(name?: string) {
    const searchTerm = name ?? ''
    return useQuery({
        queryKey: locationKeys.search(searchTerm),
        queryFn: () => getLocationsByName({ name: searchTerm }),
        enabled: searchTerm.trim().length >= 2,
        staleTime: 1000 * 60 * 30, // 30 minutos
    })
}
