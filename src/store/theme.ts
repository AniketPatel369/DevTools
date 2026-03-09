import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeStore {
    theme: Theme
    setTheme: (t: Theme) => void
    resolvedTheme: () => 'dark' | 'light'
}

function getSystemTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    document.documentElement.setAttribute('data-theme', resolved)
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            setTheme: (t) => {
                set({ theme: t })
                applyTheme(t)
            },
            resolvedTheme: () => {
                const t = get().theme
                return t === 'system' ? getSystemTheme() : t
            },
        }),
        { name: 'devtools:theme' }
    )
)
