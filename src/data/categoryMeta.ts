// ============================================================
// DEVTOOLS — Category Metadata
// Color, background, and display order per category.
// ============================================================
import type { CategoryName, CategoryMeta } from './types'

export const CATEGORY_META: Record<CategoryName, CategoryMeta> = {
    'Encoding': {
        color: 'var(--color-encoding)',
        bgColor: 'var(--color-encoding-bg)',
        borderColor: 'var(--color-encoding-border)',
        order: 0,
    },
    'Hashing': {
        color: 'var(--color-hashing)',
        bgColor: 'var(--color-hashing-bg)',
        borderColor: 'var(--color-hashing-border)',
        order: 1,
    },
    'Formats': {
        color: 'var(--color-formats)',
        bgColor: 'var(--color-formats-bg)',
        borderColor: 'var(--color-formats-border)',
        order: 2,
    },
    'Web Dev': {
        color: 'var(--color-webdev)',
        bgColor: 'var(--color-webdev-bg)',
        borderColor: 'var(--color-webdev-border)',
        order: 3,
    },
}
