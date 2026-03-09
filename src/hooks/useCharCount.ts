// ============================================================
// DEVTOOLS — useCharCount hook
// Returns character and byte count for a given string.
// ============================================================
import { useMemo } from 'react'

interface CharCount {
    chars: number
    bytes: number
}

export function useCharCount(value: string): CharCount {
    return useMemo(() => ({
        chars: value.length,
        bytes: new TextEncoder().encode(value).length,
    }), [value])
}
