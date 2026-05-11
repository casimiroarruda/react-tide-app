// src/contexts/LocationContext.tsx
// Estado global da localidade selecionada.
// Absorve a lógica de inicialização via geolocalização que estava no DashboardPage.

import {
    useState,
    useEffect,
    useContext,
    type ReactNode,
} from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useNearbyLocations } from '@/hooks/useNearbyLocations'
import { LocationContext } from './LocationContextCore'
import type { Location } from '@/types/api'

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function LocationProvider({ children }: { children: ReactNode }) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    const geo = useGeolocation()

    const { data: nearbyLocations, isLoading: loadingNearby } = useNearbyLocations(
        geo.coords?.lat,
        geo.coords?.lon,
    )

    // Inicialização automática: seleciona a primeira location próxima
    // apenas se o usuário ainda não escolheu uma manualmente.
    useEffect(() => {
        if (!selectedLocation && nearbyLocations && nearbyLocations.length > 0) {
            const first = nearbyLocations[0]
            queueMicrotask(() => setSelectedLocation(first))
        }
    }, [nearbyLocations, selectedLocation])

    const isInitializing =
        !selectedLocation && (geo.loading || (!!geo.coords && loadingNearby))

    return (
        <LocationContext.Provider
            value={{ selectedLocation, setSelectedLocation, isInitializing }}
        >
            {children}
        </LocationContext.Provider>
    )
}

export function useLocationContext() {
    const context = useContext(LocationContext)
    if (!context) {
        throw new Error('useLocationContext must be used within a LocationProvider')
    }
    return context
}