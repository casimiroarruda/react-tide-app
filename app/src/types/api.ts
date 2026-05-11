// src/types/api.ts
// Fonte única de verdade para tipos de resposta da API TIDE.
// Derivado de TIDE_API_openapi.json — manter sincronizado com a API.
// Não adicione tipos de UI ou estado aqui — apenas contratos de API.

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export type AuthRequest = {
    client_id: string
    client_secret: string
}

export type AuthResponse = {
    access_token: string
    token_type: string
}

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------

export type Location = {
    id: string
    marineId: string
    name: string
    /**
     * Ponto geográfico em formato WKT.
     * Formato: "POINT(longitude latitude)"
     * Ex: "POINT(-46.633 -23.550)"
     * Use parseGeoPoint() de @/utils/geo — NÃO faça parse inline.
     */
    point: string
    meanSeaLevel: number
    timezone: string
}

/** Coordenadas extraídas do campo WKT `point` */
export type GeoPoint = {
    lat: number
    lon: number
}

// ---------------------------------------------------------------------------
// Tide
// ---------------------------------------------------------------------------

export type TideType = 'HIGH' | 'LOW'

export type Tide = {
    time: string    // ISO 8601 ex: "2026-04-22T14:30:00-03:00"
    height: number  // metros — pode ser negativo
    type: TideType
}

// ---------------------------------------------------------------------------
// Estado derivado de interpolação (não vem da API)
// ---------------------------------------------------------------------------

export type TideStatus = 'rising' | 'falling'

export type TideState = {
    height: number
    status: TideStatus
    label: 'Enchente' | 'Vazante'
}

/** Ponto da curva gerado por buildTideCurve() */
export type TideCurvePoint = {
    time: Date
    height: number
}

// ---------------------------------------------------------------------------
// Estados de requisição
// ---------------------------------------------------------------------------

export type ApiState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error }

export type SunEventType = 'SUNRISE' | 'SUNSET'

export type TideTimelineEvent = {
    kind: 'tide'
    tide: Tide
    isNow: boolean
    isNextHigh: boolean
    sortTime: number
}

export type SunTimelineEvent = {
    kind: 'sun'
    eventType: SunEventType
    time: Date
    sortTime: number
}

export type TimelineEvent = TideTimelineEvent | SunTimelineEvent
