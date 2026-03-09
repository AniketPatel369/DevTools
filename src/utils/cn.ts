// ============================================================
// DEVTOOLS — cn() utility
// Merges class names, filtering falsy values.
// Usage: cn('base', isActive && 'active', undefined)
// ============================================================
export const cn = (...classes: (string | boolean | undefined | null)[]): string =>
    classes.filter(Boolean).join(' ')
