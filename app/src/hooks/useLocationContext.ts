// src/hooks/useLocationContext.ts
import { useContext } from 'react'
import { LocationContext, type LocationContextValue } from '@/contexts/LocationContextCore'

export function useLocationContext(): LocationContextValue {
    const ctx = useContext(LocationContext)
    if (!ctx) {
        throw new Error('useLocationContext deve ser usado dentro de <LocationProvider>')
    }
    return ctx
}
