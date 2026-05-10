// src/components/location/LocationHeader.tsx
import { useNavigate } from 'react-router-dom'
import { MapPin, ChevronDown } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import type { Location } from '@/types/api'

interface LocationHeaderProps {
    location?: Location
    loading?: boolean
}

export function LocationHeader({ location, loading }: LocationHeaderProps) {
    const navigate = useNavigate()

    return (
        <header className="flex items-center justify-between py-3 px-4 bg-transparent">
            {/* Logo à esquerda */}
            <Logo variant="full" size="sm" />

            {/* Localidade clicável à direita */}
            {loading ? (
                <div className="flex items-center gap-1.5 animate-pulse">
                    <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    <div className="h-5 w-36 bg-gray-200 rounded" />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => navigate('/locais')}
                    className="flex items-center gap-1.5 max-w-[55%] rounded-lg px-2 py-1
                     hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    aria-label="Trocar localidade"
                >
                    <MapPin className="w-4 h-4 shrink-0 text-[var(--color-primary)]" />
                    <span className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">
                        {location?.name ?? 'Selecione uma localidade'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-muted)]" />
                </button>
            )}
        </header>
    )
}