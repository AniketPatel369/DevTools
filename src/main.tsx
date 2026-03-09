import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRouter } from './router'
import './styles/globals.css'
import './styles/utilities.css'
import './styles/components.css'
import './styles/layout.css'
import { applyTheme } from './store/theme'
import type { Theme } from './store/theme'

// Apply persisted theme immediately to avoid flash
const stored = JSON.parse(localStorage.getItem('devtools:theme') ?? '{}')
applyTheme((stored?.state?.theme as Theme) ?? 'dark')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
)
