// src/components/location/LocationSearchInput.tsx
type Props = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
}

export function LocationSearchInput({
    value,
    onChange,
    placeholder = 'Buscar por cidade ou porto...',
    disabled = false,
}: Props) {
    return (
        <div className="relative">
            {/* Ícone de lupa */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </span>

            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                className={[
                    'w-full rounded-xl bg-white border border-gray-200',
                    'pl-9 pr-4 py-3 text-sm text-[var(--color-text-primary)]',
                    'placeholder:text-[var(--color-text-muted)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-shadow',
                ].join(' ')}
            />

            {/* Limpar */}
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    aria-label="Limpar busca"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    )
}