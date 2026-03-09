// ============================================================
// DEVTOOLS — useTool hook
// Centralizes read/write for a tool's output store + recent tracking.
// Every tool calls this hook to interact with persistent state.
// ============================================================
import { useCallback } from 'react'
import { useOutputStore } from '@/store/output'
import { useRecentStore } from '@/store/recent'
import type { ToolOutput } from '@/data/types'

interface UseToolReturn {
    output: ToolOutput | undefined
    setOutput: (data: Omit<ToolOutput, 'timestamp'>) => void
    clearOutput: () => void
}

export function useTool(toolId: string): UseToolReturn {
    const outputStore = useOutputStore()
    const recentStore = useRecentStore()

    const setOutput = useCallback((data: Omit<ToolOutput, 'timestamp'>) => {
        outputStore.set(toolId, data)
        recentStore.push(toolId)
    }, [toolId, outputStore, recentStore])

    const clearOutput = useCallback(() => {
        outputStore.clear(toolId)
    }, [toolId, outputStore])

    return {
        output: outputStore.get(toolId),
        setOutput,
        clearOutput,
    }
}
