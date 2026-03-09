// ============================================================
// DEVTOOLS — Format Utils
// Shared formatters for display values.
// ============================================================

/** Format byte count as human-readable string (e.g. "1.2 KB") */
export function formatBytes(n: number): string {
    if (n === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(n) / Math.log(1024))
    return `${(n / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/** Format a Unix timestamp as a locale date string */
export function formatDate(ts: number, locale = 'en-IN'): string {
    return new Date(ts).toLocaleString(locale)
}

/** Truncate a string to `n` chars, adding ellipsis if truncated */
export function truncate(str: string, n: number): string {
    return str.length > n ? str.slice(0, n) + '…' : str
}

/** Format a number with thousand separators */
export function formatNumber(n: number): string {
    return n.toLocaleString()
}

/** Pluralize a word based on count */
export function plural(count: number, word: string, suffix = 's'): string {
    return `${count.toLocaleString()} ${word}${count === 1 ? '' : suffix}`
}
