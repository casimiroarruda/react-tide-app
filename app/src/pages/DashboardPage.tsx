// src/pages/DashboardPage.tsx
import { useState, useEffect, useCallback } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useNearbyLocations } from '@/hooks/useNearbyLocations'
import { useTides } from '@/hooks/useTides'
import { toApiDate, addDays, todayInTimezone } from '@/utils/date'
import { parseGeoPoint } from '@/utils/geo'

import { LocationHeader } from '@/components/location/LocationHeader'
import { DateNavigator } from '@/components/navigation/DateNavigator'
import { TideStatusCard } from '@/components/tide/TideStatusCard'
import { TideTable } from '@/components/tide/TideTable'
import { SunInfoCards } from '@/components/tide/SunInfoCards'

import type { Location } from '@/types/api'

export function DashboardPage() {
    // 1. Estados principais
    const [selectedDate, setSelectedDate] = useState(() => toApiDate(new Date()))
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    // 2. Hooks de dados
    const geo = useGeolocation()
    const { 
        data: nearbyLocations, 
        isLoading: loadingLocations 
    } = useNearbyLocations(geo.coords?.lat, geo.coords?.lon)

    // Define localidade inicial se não houver uma selecionada
    useEffect(() => {
        if (!selectedLocation && nearbyLocations && nearbyLocations.length > 0) {
            setSelectedLocation(nearbyLocations[0])
        }
    }, [nearbyLocations, selectedLocation])

    const { 
        data: tides, 
        isLoading: loadingTides, 
        error: tidesError 
    } = useTides(
        selectedLocation?.id, 
        selectedDate, 
        selectedLocation?.timezone
    )

    // 3. Navegação por teclado
    const handleNextDay = useCallback(() => {
        setSelectedDate((prev) => addDays(prev, 1))
    }, [])

    const handlePrevDay = useCallback(() => {
        setSelectedDate((prev) => addDays(prev, -1))
    }, [])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrevDay()
            if (e.key === 'ArrowRight') handleNextDay()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleNextDay, handlePrevDay])

    // 4. Renderização
    const isToday = selectedDate === todayInTimezone(selectedLocation?.timezone || 'UTC')
    const coords = selectedLocation ? parseGeoPoint(selectedLocation.point) : null

    return (
        <main className="max-w-md mx-auto min-h-screen pb-20 flex flex-col bg-[var(--color-bg-page)] shadow-2xl">
            <LocationHeader 
                location={selectedLocation || undefined} 
                loading={loadingLocations && !selectedLocation} 
            />

            <DateNavigator 
                selectedDate={selectedDate} 
                onDateChange={setSelectedDate}
                timezone={selectedLocation?.timezone}
            />

            <div className="flex-1 overflow-y-auto pt-4 space-y-2">
                {/* Estado Atual apenas se for HOJE */}
                {isToday && tides && tides.length > 0 && (
                    <TideStatusCard tides={tides} />
                )}

                {/* Lista de Eventos */}
                <TideTable 
                    tides={tides} 
                    loading={loadingTides} 
                    error={tidesError}
                    timezone={selectedLocation?.timezone || 'UTC'}
                />

                {/* Sol (opcional, se tivermos coordenadas) */}
                {coords && (
                    <SunInfoCards 
                        date={new Date(`${selectedDate}T12:00:00`)} 
                        lat={coords.lat} 
                        lon={coords.lon} 
                    />
                )}
                
                {/* Rodapé informativo ou espaçador */}
                <div className="h-12" />
            </div>

            {/* Bottom Nav Placeholder (será Task posterior) */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 bg-white border-t border-border/60 flex items-center justify-around px-6 z-50">
                <div className="flex flex-col items-center gap-1 text-[var(--color-primary)]">
                    <div className="w-6 h-6 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ondas</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[var(--color-text-muted)]">
                    <div className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Locais</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[var(--color-text-muted)]">
                    <div className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ajustes</span>
                </div>
            </nav>
        </main>
    )
}
