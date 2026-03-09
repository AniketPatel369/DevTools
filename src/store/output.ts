// ============================================================
// DEVTOOLS — Output Store
// Session-only (in-memory). Keyed by toolId. 
// Output survives route changes; cleared on new run or Clear.
// ============================================================
import { create } from 'zustand'
import type { ToolOutput } from '@/data/types'

interface OutputState {
    outputs: Record<string, ToolOutput>
    set: (toolId: string, data: Omit<ToolOutput, 'timestamp'>) => void
    get: (toolId: string) => ToolOutput | undefined
    clear: (toolId: string) => void
    clearAll: () => void
}

export const useOutputStore = create<OutputState>()((set, get) => ({
    outputs: {},

    set: (toolId, data) =>
        set(s => ({
            outputs: {
                ...s.outputs,
                [toolId]: { ...data, timestamp: Date.now() },
            },
        })),

    get: (toolId) => get().outputs[toolId],
    clear: (toolId) => set(s => { const o = { ...s.outputs }; delete o[toolId]; return { outputs: o } }),
    clearAll: () => set({ outputs: {} }),
}))
