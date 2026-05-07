// src/hooks/useTides.ts
import { useQuery } from '@tanstack/react-query'
import { getTidesByDay } from '@/api/tides'
import { todayInTimezone } from '@/utils/date'

export const tideKeys = {
    all: ['tides'] as const,
    location: (locationId: string) => [...tideKeys.all, locationId] as const,
    day: (locationId: string, day: string) => [...tideKeys.location(locationId), day] as const,
}

/**
 * Hook para buscar dados de maré de uma localidade em um dia específico.
 * Stale time: Infinity para dias passados, 5 minutos para o dia atual.
 */
export function useTides(
    locationId?: string,
    day?: string,
    timezone?: string
) {
    const isToday =
        day && timezone ? day === todayInTimezone(timezone) : false

    return useQuery({
        queryKey: tideKeys.day(locationId ?? '', day ?? ''),
        queryFn: () => getTidesByDay({ locationId: locationId!, day: day! }),
        enabled: !!locationId && !!day,
        // Se for hoje, o cache expira em 5 minutos. Se for outro dia, é eterno.
        staleTime: isToday ? 1000 * 60 * 5 : Infinity,
    })
}
