// ============================================================
// DEVTOOLS — Recent Tools Store
// Persists to localStorage. Keeps last 5 used tool IDs.
// ============================================================
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT = 5

interface RecentState {
    ids: string[]
    push: (id: string) => void
    getAll: () => string[]
}

export const useRecentStore = create<RecentState>()(
    persist(
        (set, get) => ({
            ids: [],
            push: (id) =>
                set(s => {
                    const filtered = s.ids.filter(i => i !== id)
                    return { ids: [id, ...filtered].slice(0, MAX_RECENT) }
                }),
            getAll: () => get().ids,
        }),
        { name: 'devtools:recent' }
    )
)
