// src/components/location/LocationListItem.tsx
import type { Location } from '@/types/api'

type Props = {
    location: Location
    isSelected: boolean
    onClick: (location: Location) => void
}

export function LocationListItem({ location, isSelected, onClick }: Props) {
    // Extrai estado (UF) a partir do nome — convenção: "Cidade, UF"
    const parts = location.name.split(',')
    const city = parts[0]?.trim() ?? location.name
    const state = parts[1]?.trim() ?? ''

    return (
        <button
            type="button"
            onClick={() => onClick(location)}
            className={[
                'w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors',
                isSelected
                    ? 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]'
                    : 'bg-white border border-transparent hover:bg-gray-50 active:bg-gray-100',
            ].join(' ')}
        >
            <div className="flex items-center gap-3">
                {/* Ícone pin */}
                <span className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </span>

                <div>
                    <p className={[
                        'text-sm font-medium leading-tight',
                        isSelected ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-text-primary)]',
                    ].join(' ')}>
                        {city}
                    </p>
                    {state && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{state}</p>
                    )}
                </div>
            </div>

            {/* Checkmark se selecionado */}
            {isSelected && (
                <span className="text-[var(--color-primary)] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                </span>
            )}
        </button>
    )
}