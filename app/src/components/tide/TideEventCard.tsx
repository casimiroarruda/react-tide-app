// src/components/tide/TideEventCard.tsx
import { ArrowUp, ArrowDown, Sunrise, Sunset } from 'lucide-react'
import type { Tide, SunTimelineEvent } from '@/types/api'
import { formatTideTime, formatDatetime } from '@/utils/date'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// TideEventCard — linha de evento de maré
// ---------------------------------------------------------------------------

interface TideEventCardProps {
    tide: Tide
    timezone: string
    isNow?: boolean
    isNextHigh?: boolean
}

export function TideEventCard({ tide, timezone, isNow, isNextHigh }: TideEventCardProps) {
    const isHigh = tide.type === 'HIGH'

    return (
        <div className={cn(
            'flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors',
            isNow
                ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)]'
                : 'bg-white border-gray-100 hover:border-gray-200',
        )}>
            <div className="flex items-center gap-2 w-[72px] shrink-0">
                <span className={cn(
                    'flex items-center justify-center w-7 h-7 rounded-full shrink-0',
                    isHigh
                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                        : 'bg-gray-100 text-[var(--color-text-secondary)]',
                )}>
                    {isHigh
                        ? <ArrowUp className="w-3.5 h-3.5" />
                        : <ArrowDown className="w-3.5 h-3.5" />}
                </span>
                <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                    {isHigh ? 'Preia' : 'Baixa'}
                </span>
            </div>

            <div className="flex-1 text-[20px] font-bold text-[var(--color-text-primary)] tabular-nums">
                {tide.height.toFixed(2)}
                <span className="text-sm font-medium text-[var(--color-text-secondary)] ml-0.5">m</span>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[14px] font-semibold text-[var(--color-text-primary)] tabular-nums">
                    {formatTideTime(tide.time, timezone)}
                </span>
                {isNow && (
                    <span className="bg-[var(--color-primary)] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Agora
                    </span>
                )}
                {isNextHigh && !isNow && (
                    <span className="border border-[var(--color-primary)] text-[var(--color-primary)] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Próxima
                    </span>
                )}
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// SunEventRow — linha de evento solar na timeline
// ---------------------------------------------------------------------------

interface SunEventRowProps {
    event: SunTimelineEvent
    timezone: string
}

export function SunEventRow({ event, timezone }: SunEventRowProps) {
    const isSunrise = event.eventType === 'SUNRISE'

    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white/60">
            <span className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full shrink-0',
                isSunrise ? 'bg-amber-50 text-amber-400' : 'bg-orange-50 text-orange-400',
            )}>
                {isSunrise
                    ? <Sunrise className="w-3.5 h-3.5" />
                    : <Sunset className="w-3.5 h-3.5" />}
            </span>

            <span className={cn(
                'text-[11px] font-bold uppercase tracking-widest w-[72px] shrink-0',
                isSunrise ? 'text-amber-500' : 'text-orange-400',
            )}>
                {isSunrise ? 'Aurora' : 'Ocaso'}
            </span>

            <div className="flex-1" />

            <span className="text-[13px] font-medium text-[var(--color-text-secondary)] tabular-nums">
                {formatDatetime(event.time, timezone)}
            </span>
        </div>
    )
}

// ---------------------------------------------------------------------------
// TideEventList — container da lista vertical
// ---------------------------------------------------------------------------

export function TideEventList({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 px-4 pb-2">
            {children}
        </div>
    )
}