// src/components/tide/SunInfoCards.tsx
import { Sunrise, Sunset } from 'lucide-react'
import SunCalc from 'suncalc'

interface SunInfoCardsProps {
    date: Date
    lat: number
    lon: number
}

/**
 * Exibe horários de Nascer e Pôr do Sol.
 * Calculado client-side via SunCalc.
 */
export function SunInfoCards({ date, lat, lon }: SunInfoCardsProps) {
    const times = SunCalc.getTimes(date, lat, lon)

    const formatTime = (d: Date) =>
        new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(d)

    return (
        <div className="grid grid-cols-2 gap-3 px-6 py-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-border/40">
                <div className="p-2 bg-amber-50 rounded-lg">
                    <Sunrise className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Nascer
                    </span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {formatTime(times.sunrise)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-border/40">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Sunset className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Pôr do Sol
                    </span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {formatTime(times.sunset)}
                    </span>
                </div>
            </div>
        </div>
    )
}
