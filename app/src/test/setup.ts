// src/test/setup.ts
import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './mocks/server'

// Inicia o servidor MSW antes de todos os testes
beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
    // Mock scrollIntoView (não existe no JSDOM)
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

// Reseta handlers após cada teste (evita vazamento entre testes)
afterEach(() => server.resetHandlers())

// Encerra o servidor ao fim de todos os testes
afterAll(() => server.close())