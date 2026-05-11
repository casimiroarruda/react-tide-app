// src/pages/DashboardPage.tsx
import { useState, useEffect, useCallback, useMemo } from 'react'
import SunCalc from 'suncalc'

import { useLocationContext } from '@/contexts/LocationContext'
import { useTides } from '@/hooks/useTides'
import { toApiDate, addDays, todayInTimezone } from '@/utils/date'
import { parseGeoPoint } from '@/utils/geo'

import { LocationHeader } from '@/components/location/LocationHeader'
import { DateNavigator } from '@/components/navigation/DateNavigator'
import { TideStatusCard } from '@/components/tide/TideStatusCard'
import { TideTable } from '@/components/tide/TideTable'

import type { TimelineEvent } from '@/types/api'

export function DashboardPage() {
    const { selectedLocation, isInitializing } = useLocationContext()
    const [selectedDate, setSelectedDate] = useState(() => toApiDate(new Date()))

    const { data: tides, isLoading: loadingTides, error: tidesError } = useTides(
        selectedLocation?.id,
        selectedDate,
        selectedLocation?.timezone,
    )

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

    // Horários solares — calculados client-side, sem chamada de rede
    const sunTimes = useMemo(() => {
        if (!coords) return null
        return SunCalc.getTimes(
            new Date(`${selectedDate}T12:00:00`),
            coords.lat,
            coords.lon,
        )
    }, [selectedDate, coords?.lat, coords?.lon])

    // Timeline unificada: marés + aurora/ocaso ordenados por horário
    const timeline = useMemo<TimelineEvent[]>(() => {
        if (!tides || tides.length === 0) return []

        const nowMs = Date.now()

        // Qual evento "passou" mais recentemente → AGORA
        let nowIndex = -1
        for (let i = 0; i < tides.length; i++) {
            if (new Date(tides[i].time).getTime() <= nowMs) nowIndex = i
        }

        // Próxima preia no futuro
        const nextHigh = tides.find(
            (t) => t.type === 'HIGH' && new Date(t.time).getTime() > nowMs,
        )

        const tideEvents: TimelineEvent[] = tides.map((tide, index) => ({
            kind: 'tide' as const,
            tide,
            isNow: index === nowIndex,
            isNextHigh: tide.time === nextHigh?.time,
            sortTime: new Date(tide.time).getTime(),
        }))

        const sunEvents: TimelineEvent[] = sunTimes
            ? [
                {
                    kind: 'sun' as const,
                    eventType: 'SUNRISE' as const,
                    time: sunTimes.sunrise,
                    sortTime: sunTimes.sunrise.getTime(),
                },
                {
                    kind: 'sun' as const,
                    eventType: 'SUNSET' as const,
                    time: sunTimes.sunset,
                    sortTime: sunTimes.sunset.getTime(),
                },
            ]
            : []

        return [...tideEvents, ...sunEvents].sort((a, b) => a.sortTime - b.sortTime)
    }, [tides, sunTimes])

    return (
        <main className="max-w-md mx-auto min-h-screen pb-20 lg:pb-6 flex flex-col bg-[var(--color-bg-page)]">
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
                {isToday && tides && tides.length > 0 && (
                    <TideStatusCard tides={tides} />
                )}

                <TideTable
                    events={timeline}
                    loading={loadingTides}
                    error={tidesError}
                    timezone={timezone}
                />

                <div className="h-4" />
            </div>
        </main>
    )
}