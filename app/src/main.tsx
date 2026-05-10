// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root não encontrado no DOM')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)