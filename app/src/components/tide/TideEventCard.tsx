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
 * Linha de um evento de maré na lista vertical.
 * Layout: [ícone + tipo] — [altura] — [horário + badge]
 */
export function TideEventCard({ tide, timezone, isNow, isNextHigh }: TideEventCardProps) {
    const isHigh = tide.type === 'HIGH'
    const timeLabel = formatTideTime(tide.time, timezone)

    return (
        <div className={cn(
            'flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors',
            isNow
                ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)]'
                : 'bg-white border-gray-100 hover:border-gray-200',
        )}>

            {/* Ícone + Tipo */}
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

            {/* Altura */}
            <div className="flex-1 text-[20px] font-bold text-[var(--color-text-primary)] tabular-nums">
                {tide.height.toFixed(2)}
                <span className="text-sm font-medium text-[var(--color-text-secondary)] ml-0.5">m</span>
            </div>

            {/* Horário + badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[14px] font-semibold text-[var(--color-text-primary)] tabular-nums">
                    {timeLabel}
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

/**
 * Container da lista vertical de eventos.
 */
export function TideEventList({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 px-4 pb-2">
            {children}
        </div>
    )
}