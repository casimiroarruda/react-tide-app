// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react'

export type GeolocationState = {
    coords: { lat: number; lon: number } | null
    error: string | null
    loading: boolean
}

/**
 * Hook para obter a localização atual do usuário via Geolocation API.
 */
export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        coords: null,
        error: null,
        loading: true,
    })

    useEffect(() => {
        if (!navigator.geolocation) {
            Promise.resolve().then(() => {
                setState({
                    coords: null,
                    error: 'Geolocalização não suportada pelo navegador.',
                    loading: false,
                })
            })
            return
        }

        const onSuccess = (position: GeolocationPosition) => {
            setState({
                coords: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                loading: false,
            })
        }

        const onError = (error: GeolocationPositionError) => {
            let message = 'Erro ao obter localização.'
            if (error.code === error.PERMISSION_DENIED) {
                message = 'Acesso à localização negado.'
            }
            setState({
                coords: null,
                error: message,
                loading: false,
            })
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        })
    }, [])

    return state
}
