// src/components/location/LocationHeader.tsx
import { MapPin } from 'lucide-react'
import type { Location } from '@/types/api'

interface LocationHeaderProps {
    location?: Location
    loading?: boolean
}

/**
 * Header que exibe o nome da localidade selecionada.
 * Design: 20px / 600 / text-primary
 */
export function LocationHeader({ location, loading }: LocationHeaderProps) {
    if (loading) {
        return (
            <div className="flex items-center gap-2 animate-pulse py-4 px-6">
                <div className="w-5 h-5 bg-muted rounded-full" />
                <div className="h-6 w-48 bg-muted rounded" />
            </div>
        )
    }

    return (
        <header className="flex items-center gap-2 py-4 px-6 bg-transparent">
            <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
            <h1 className="text-[20px] font-semibold text-[var(--color-text-primary)] truncate">
                {location?.name || 'Selecione uma localidade'}
            </h1>
        </header>
    )
}
