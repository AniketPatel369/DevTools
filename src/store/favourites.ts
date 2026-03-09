// ============================================================
// DEVTOOLS — Favourites Store
// Persists to localStorage. Provides toggle, add, remove, has.
// ============================================================
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavouritesState {
    ids: string[]
    add: (id: string) => void
    remove: (id: string) => void
    toggle: (id: string) => void
    has: (id: string) => boolean
}

export const useFavouritesStore = create<FavouritesState>()(
    persist(
        (set, get) => ({
            ids: [],
            add: (id) => set(s => ({ ids: [...s.ids.filter(i => i !== id), id] })),
            remove: (id) => set(s => ({ ids: s.ids.filter(i => i !== id) })),
            toggle: (id) => get().has(id) ? get().remove(id) : get().add(id),
            has: (id) => get().ids.includes(id),
        }),
        { name: 'devtools:favourites' }
    )
)
