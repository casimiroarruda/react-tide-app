// src/utils/geo.ts
// Utilitários de parsing e cálculo geográfico.
// Todas as funções são puras — 100% de cobertura de testes obrigatória.

import type { GeoPoint } from '@/types/api'

/**
 * Faz o parse do campo WKT `point` retornado pela API.
 *
 * Formato: "POINT(longitude latitude)"
 * Ex:      "POINT(-46.633 -23.550)"
 *
 * ATENÇÃO: a ordem é (lon lat), não (lat lon) — padrão WKT/PostGIS.
 *
 * @throws {Error} se o formato for inválido
 */
export function parseGeoPoint(point: string): GeoPoint {
    const match = point.match(/^POINT\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)$/)
    if (!match) {
        throw new Error(
            `parseGeoPoint: formato WKT inválido: "${point}". Esperado: "POINT(lon lat)"`
        )
    }
    return {
        lon: parseFloat(match[1]),
        lat: parseFloat(match[2]),
    }
}

/**
 * Calcula a distância em km entre dois pontos geográficos.
 * Usa a fórmula de Haversine.
 */
export function haversineDistance(a: GeoPoint, b: GeoPoint): number {
    const R = 6371 // raio médio da Terra em km
    const dLat = toRad(b.lat - a.lat)
    const dLon = toRad(b.lon - a.lon)
    const sinDLat = Math.sin(dLat / 2)
    const sinDLon = Math.sin(dLon / 2)
    const chord =
        sinDLat * sinDLat +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLon * sinDLon
    return R * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord))
}

function toRad(deg: number): number {
    return (deg * Math.PI) / 180
}