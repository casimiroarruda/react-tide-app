// src/contexts/LocationContextCore.ts
import { createContext } from 'react'
import type { Location } from '@/types/api'

export type LocationContextValue = {
    /** Localidade atualmente selecionada. null enquanto inicializa. */
    selectedLocation: Location | null
    /** Define manualmente a localidade (ex: usuário escolhe na LocalesPage) */
    setSelectedLocation: (location: Location) => void
    /** true enquanto aguarda geo + primeira busca de locations */
    isInitializing: boolean
}

export const LocationContext = createContext<LocationContextValue | null>(null)
