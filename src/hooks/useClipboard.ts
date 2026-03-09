// ============================================================
// DEVTOOLS — useClipboard hook
// copy(text) → sets copied=true for 1500ms, then resets.
// ============================================================
import { useState, useCallback } from 'react'

interface UseClipboardReturn {
    copied: boolean
    copy: (text: string) => Promise<void>
}

export function useClipboard(resetMs = 1500): UseClipboardReturn {
    const [copied, setCopied] = useState(false)

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), resetMs)
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea')
            el.value = text
            el.style.position = 'fixed'
            el.style.opacity = '0'
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            setCopied(true)
            setTimeout(() => setCopied(false), resetMs)
        }
    }, [resetMs])

    return { copied, copy }
}
