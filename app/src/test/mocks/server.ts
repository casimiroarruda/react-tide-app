// src/test/mocks/server.ts
// Servidor MSW para ambiente Node (Vitest).
// Intercepta fetch no nível de rede — sem mockar módulos.

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)