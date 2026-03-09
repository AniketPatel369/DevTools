// ============================================================
// DEVTOOLS — useKeyboard hook
// Registers a global keyboard shortcut. Auto-cleans up on unmount.
// Usage: useKeyboard('ctrl+k', handler)
//        useKeyboard('ctrl+enter', handler)
// ============================================================
import { useEffect, useCallback } from 'react'

type Modifier = 'ctrl' | 'shift' | 'alt' | 'meta'

function parseShortcut(shortcut: string): { modifiers: Modifier[]; key: string } {
    const parts = shortcut.toLowerCase().split('+')
    const key = parts[parts.length - 1]
    const modifiers = parts.slice(0, -1) as Modifier[]
    return { modifiers, key }
}

export function useKeyboard(shortcut: string, handler: (e: KeyboardEvent) => void) {
    const { modifiers, key } = parseShortcut(shortcut)

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        const match =
            e.key.toLowerCase() === key &&
            modifiers.every(m => {
                if (m === 'ctrl') return e.ctrlKey || e.metaKey
                if (m === 'shift') return e.shiftKey
                if (m === 'alt') return e.altKey
                if (m === 'meta') return e.metaKey
                return false
            })
        if (match) {
            e.preventDefault()
            handler(e)
        }
    }, [key, modifiers, handler])

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onKeyDown])
}
