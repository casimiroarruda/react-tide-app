// src/pages/LocalesPage.tsx
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLocationContext } from '@/contexts/LocationContext'
import { useLocationSearch } from '@/hooks/useLocationSearch'
import { useNearbyLocations } from '@/hooks/useNearbyLocations'
import { useGeolocation } from '@/hooks/useGeolocation'
import { LocationSearchInput } from '@/components/location/LocationSearchInput'
import { LocationListItem } from '@/components/location/LocationListItem'
import type { Location } from '@/types/api'

export function LocalesPage() {
    const navigate = useNavigate()
    const { selectedLocation, setSelectedLocation } = useLocationContext()
    const [query, setQuery] = useState('')

    // Geolocalização (para botão GPS)
    const geo = useGeolocation()
    const { data: nearbyLocations, isLoading: loadingNearby } = useNearbyLocations(
        geo.coords?.lat,
        geo.coords?.lon,
    )

    // Busca por nome
    const { data: searchResults, isLoading: loadingSearch } = useLocationSearch(
        query.trim().length >= 2 ? query.trim() : undefined,
    )

    // Lista exibida: se há query → resultados da busca; senão → locations próximas
    const locations: Location[] = query.trim().length >= 2
        ? (searchResults ?? [])
        : (nearbyLocations ?? [])

    const isLoading = query.trim().length >= 2 ? loadingSearch : loadingNearby
    const isEmpty = !isLoading && locations.length === 0

    const handleSelect = useCallback(
        (location: Location) => {
            setSelectedLocation(location)
            navigate('/dashboard')
        },
        [setSelectedLocation, navigate],
    )

    const handleGeoPress = useCallback(() => {
        if (nearbyLocations && nearbyLocations.length > 0) {
            handleSelect(nearbyLocations[0])
        }
    }, [nearbyLocations, handleSelect])

    return (
        <main className="max-w-md lg:max-w-none lg:pb-6 mx-auto min-h-screen pb-20 flex flex-col bg-[var(--color-bg-page)]">
            {/* Header */}
            <div className="px-4 pt-12 lg:pt-6 pb-4">
                <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                    Localidades
                </h1>

                {/* Busca + botão GPS */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <LocationSearchInput
                            value={query}
                            onChange={setQuery}
                        />
                    </div>

                    {/* Botão GPS */}
                    <button
                        type="button"
                        onClick={handleGeoPress}
                        disabled={loadingNearby || !geo.coords}
                        aria-label="Usar minha localização"
                        className={[
                            'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                            geo.coords
                                ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] active:scale-95'
                                : 'bg-gray-100 text-[var(--color-text-muted)] cursor-not-allowed',
                        ].join(' ')}
                    >
                        {loadingNearby ? (
                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Hint de digitação mínima */}
                {query.trim().length === 1 && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-2 px-1">
                        Digite mais um caractere para buscar...
                    </p>
                )}
            </div>

            {/* Seção de label */}
            <div className="px-4 pb-2">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-widest">
                    {query.trim().length >= 2 ? 'Resultados' : 'Próximas a você'}
                </p>
            </div>

            {/* Lista */}
            <div className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {/* Loading skeleton */}
                {isLoading && (
                    <>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-14 rounded-xl bg-white border border-gray-100 animate-pulse"
                            />
                        ))}
                    </>
                )}

                {/* Empty state */}
                {isEmpty && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <span className="text-4xl mb-3">🔍</span>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {query.trim().length >= 2
                                ? 'Nenhuma localidade encontrada'
                                : 'Localização não disponível'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {query.trim().length >= 2
                                ? 'Tente outro nome ou verifique a grafia'
                                : 'Permita o acesso à localização ou busque pelo nome'}
                        </p>
                    </div>
                )}

                {/* Resultados */}
                {!isLoading &&
                    locations.map((location) => (
                        <LocationListItem
                            key={location.id}
                            location={location}
                            isSelected={selectedLocation?.id === location.id}
                            onClick={handleSelect}
                        />
                    ))}
            </div>
        </main>
    )
}