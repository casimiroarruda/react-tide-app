// src/components/tide/TideEventCard.tsx
import { ArrowUp, ArrowDown } from 'lucide-react'
import type { Tide } from '@/types/api'
import { formatTideTime } from '@/utils/date'
import { cn } from '@/lib/utils'

interface TideEventCardProps {
    tide: Tide
    timezone: string
    isNow?: boolean
    isNextHigh?: boolean
}

/**
 * Card individual de um evento de maré (Preia ou Baixa).
 * Design:
 * - Badge "AGORA" se isNow
 * - Badge "PREIA" outline se isNextHigh
 * - Ícone ↑ / ↓ conforme tipo
 */
export function TideEventCard({
    tide,
    timezone,
    isNow,
    isNextHigh,
}: TideEventCardProps) {
    const isHigh = tide.type === 'HIGH'
    const timeLabel = formatTideTime(tide.time, timezone)

    return (
        <div
            className={cn(
                'flex flex-col min-w-[110px] p-4 rounded-2xl border transition-all relative overflow-hidden',
                isNow
                    ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)]'
                    : 'bg-white border-border/60'
            )}
        >
            {/* Badges */}
            <div className="flex gap-1 mb-2 h-5">
                {isNow && (
                    <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Agora
                    </span>
                )}
                {isNextHigh && !isNow && (
                    <span className="border border-[var(--color-primary)] text-[var(--color-primary)] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Preia
                    </span>
                )}
            </div>

            {/* Ícone e Tipo */}
            <div className="flex items-center gap-1 mb-1">
                {isHigh ? (
                    <ArrowUp className="w-4 h-4 text-[var(--color-primary)]" />
                ) : (
                    <ArrowDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
                )}
                <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                    {isHigh ? 'Preia' : 'Baixa'}
                </span>
            </div>

            {/* Altura */}
            <div className="text-[18px] font-bold text-[var(--color-text-primary)] mb-1">
                {tide.height.toFixed(2)}m
            </div>

            {/* Horário */}
            <div className="text-[13px] font-medium text-[var(--color-text-secondary)]">
                {timeLabel}
            </div>
        </div>
    )
}

/**
 * Container para a lista horizontal de cards de maré.
 */
export function TideEventList({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar scroll-smooth">
            {children}
        </div>
    )
}
