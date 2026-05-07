// src/components/navigation/DateNavigator.tsx
import { useEffect, useRef } from 'react'
import { formatStripDate, toApiDate, addDays } from '@/utils/date'
import { cn } from '@/lib/utils'

interface DateNavigatorProps {
    selectedDate: string // yyyy-MM-dd
    onDateChange: (date: string) => void
    timezone?: string
}

/**
 * Seletor de data em formato de tira horizontal (DateStrip).
 * Exibe 7 dias a partir de hoje.
 * Design: Ativo bg #0B3950 + texto branco + rounded-full.
 */
export function DateNavigator({
    selectedDate,
    onDateChange,
    timezone = 'UTC',
}: DateNavigatorProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const today = toApiDate(new Date())

    // Gera 7 dias para navegação
    const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i))

    // Centraliza o item selecionado ao carregar/mudar
    useEffect(() => {
        const activeItem = scrollRef.current?.querySelector('[data-active="true"]')
        if (activeItem) {
            activeItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            })
        }
    }, [selectedDate])

    return (
        <div className="w-full bg-[var(--color-bg-page)] border-b border-border/50">
            <div
                ref={scrollRef}
                className="flex gap-2 p-4 overflow-x-auto no-scrollbar scroll-smooth"
            >
                {dates.map((date) => {
                    const isActive = date === selectedDate
                    const label = formatStripDate(date, timezone)

                    return (
                        <button
                            key={date}
                            data-active={isActive}
                            onClick={() => onDateChange(date)}
                            className={cn(
                                'flex-shrink-0 px-4 py-2 text-sm font-medium transition-all rounded-full',
                                isActive
                                    ? 'bg-[#0B3950] text-white shadow-md'
                                    : 'bg-white text-[var(--color-text-secondary)] border border-border/40 hover:border-[var(--color-primary)]'
                            )}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
