// src/utils/geo.test.ts
import { describe, it, expect } from 'vitest'
import { parseGeoPoint, haversineDistance } from './geo'

describe('parseGeoPoint', () => {
    it('faz parse correto de POINT(lon lat)', () => {
        const result = parseGeoPoint('POINT(-46.633 -23.550)')
        expect(result).toEqual({ lon: -46.633, lat: -23.550 })
    })

    it('reconhece valores positivos (hemisfério norte/leste)', () => {
        const result = parseGeoPoint('POINT(34.05 -1.28)')
        expect(result.lon).toBeCloseTo(34.05)
        expect(result.lat).toBeCloseTo(-1.28)
    })

    it('aceita espaços extras dentro do POINT', () => {
        const result = parseGeoPoint('POINT(  -46.633  -23.550  )')
        expect(result).toEqual({ lon: -46.633, lat: -23.550 })
    })

    it('lança erro para formato completamente inválido', () => {
        expect(() => parseGeoPoint('invalid')).toThrow('parseGeoPoint')
    })

    it('lança erro para POINT sem coordenadas suficientes', () => {
        expect(() => parseGeoPoint('POINT(-46.633)')).toThrow('parseGeoPoint')
    })

    it('lança erro para string vazia', () => {
        expect(() => parseGeoPoint('')).toThrow('parseGeoPoint')
    })

    it('CRÍTICO: lon é o primeiro valor, lat é o segundo (padrão WKT)', () => {
        // POINT(lon lat) — não POINT(lat lon)
        // Recife: lon ≈ -34.88, lat ≈ -8.05
        const result = parseGeoPoint('POINT(-34.88 -8.05)')
        expect(result.lon).toBeCloseTo(-34.88)
        expect(result.lat).toBeCloseTo(-8.05)
        // lat NÃO deve ser -34.88
        expect(result.lat).not.toBeCloseTo(-34.88)
    })
})

describe('haversineDistance', () => {
    it('distância zero entre pontos iguais', () => {
        const p = { lat: -23.55, lon: -46.63 }
        expect(haversineDistance(p, p)).toBeCloseTo(0)
    })

    it('distância São Paulo → Rio de Janeiro ≈ 357 km', () => {
        const sp = { lat: -23.5505, lon: -46.6333 }
        const rj = { lat: -22.9068, lon: -43.1729 }
        const dist = haversineDistance(sp, rj)
        expect(dist).toBeGreaterThan(350)
        expect(dist).toBeLessThan(365)
    })

    it('distância é simétrica (A→B = B→A)', () => {
        const a = { lat: -8.05, lon: -34.88 }  // Recife
        const b = { lat: -12.97, lon: -38.50 } // Salvador
        expect(haversineDistance(a, b)).toBeCloseTo(haversineDistance(b, a), 5)
    })

    it('retorna km como unidade (não metros)', () => {
        // Dois pontos muito próximos: ~1km de distância
        const a = { lat: -23.550, lon: -46.633 }
        const b = { lat: -23.559, lon: -46.633 } // ~1km ao sul
        const dist = haversineDistance(a, b)
        expect(dist).toBeGreaterThan(0.5)
        expect(dist).toBeLessThan(5) // se fosse metros seria > 1000
    })
})