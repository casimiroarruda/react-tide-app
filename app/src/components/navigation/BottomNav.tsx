// src/components/navigation/BottomNav.tsx
// 2 tabs: Maré e Locais. Ajustes removido (sem uso na v1).

import { NavLink } from 'react-router-dom'

function WavesIcon({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
    )
}

function PinIcon({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Maré', Icon: WavesIcon },
    { to: '/locais', label: 'Locais', Icon: PinIcon },
]

export function BottomNav() {
    return (
        <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-50"
            aria-label="Navegação principal"
        >
            <div className="flex h-16 items-center justify-around px-8">
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            [
                                'flex flex-col items-center gap-1 transition-colors min-w-[56px]',
                                isActive
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-nav-inactive)]',
                            ].join(' ')
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={22} />
                                <span className={[
                                    'text-[10px] uppercase tracking-widest',
                                    isActive ? 'font-bold' : 'font-medium',
                                ].join(' ')}>
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}