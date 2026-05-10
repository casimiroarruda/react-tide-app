// src/pages/DashboardPage.tsx
// Refatorado na Feature 02: selectedLocation vem do LocationContext.
// Removido: useState(location), useEffect de init, useGeolocation, useNearbyLocations.

import { useState, useEffect, useCallback } from 'react'
import { useLocationContext } from '@/hooks/useLocationContext'
import { useTides } from '@/hooks/useTides'
import { toApiDate, addDays, todayInTimezone } from '@/utils/date'
import { parseGeoPoint } from '@/utils/geo'

import { LocationHeader } from '@/components/location/LocationHeader'
import { DateNavigator } from '@/components/navigation/DateNavigator'
import { TideStatusCard } from '@/components/tide/TideStatusCard'
import { TideTable } from '@/components/tide/TideTable'
import { SunInfoCards } from '@/components/tide/SunInfoCards'

export function DashboardPage() {
    // Localidade vem do contexto global — inicializada via geo pelo LocationProvider
    const { selectedLocation, isInitializing } = useLocationContext()

    // Estado local: data selecionada
    const [selectedDate, setSelectedDate] = useState(() => toApiDate(new Date()))

    // Dados de maré
    const {
        data: tides,
        isLoading: loadingTides,
        error: tidesError,
    } = useTides(
        selectedLocation?.id,
        selectedDate,
        selectedLocation?.timezone,
    )

    // Navegação por teclado ← →
    const handlePrevDay = useCallback(() => setSelectedDate((d) => addDays(d, -1)), [])
    const handleNextDay = useCallback(() => setSelectedDate((d) => addDays(d, 1)), [])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrevDay()
            if (e.key === 'ArrowRight') handleNextDay()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handlePrevDay, handleNextDay])

    const timezone = selectedLocation?.timezone ?? 'UTC'
    const isToday = selectedDate === todayInTimezone(timezone)
    const coords = selectedLocation ? parseGeoPoint(selectedLocation.point) : null

    return (
        <main className="max-w-md mx-auto min-h-screen pb-20 lg:pb-6 flex flex-col bg-[var(--color-bg-page)] shadow-2xl">
            <LocationHeader
                location={selectedLocation ?? undefined}
                loading={isInitializing}
            />

            <DateNavigator
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                timezone={timezone}
            />

            <div className="flex-1 overflow-y-auto pt-4 space-y-2">
                {/* Estado Atual — apenas para o dia de hoje com dados */}
                {isToday && tides && tides.length > 0 && (
                    <TideStatusCard tides={tides} />
                )}

                {/* Tábua de marés */}
                <TideTable
                    tides={tides}
                    loading={loadingTides}
                    error={tidesError}
                    timezone={timezone}
                />

                {/* Nascer/pôr do sol */}
                {coords && (
                    <SunInfoCards
                        date={new Date(`${selectedDate}T12:00:00`)}
                        lat={coords.lat}
                        lon={coords.lon}
                    />
                )}

                <div className="h-4" />
            </div>
        </main>
    )
}