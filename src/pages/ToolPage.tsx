import { lazy, Suspense, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { findTool } from '@/data/registry'

// Map toolId → category folder for dynamic import
const CATEGORY_FOLDER: Record<string, string> = {
    Encoding: 'encoding',
    Hashing: 'hashing',
    Formats: 'formats',
    'Web Dev': 'webdev',
}

// Cache of lazy-loaded components so we don't re-import on every render
const componentCache: Record<string, React.ComponentType<any>> = {}

function getToolComponent(toolId: string, category: string) {
    if (!componentCache[toolId]) {
        const folder = CATEGORY_FOLDER[category] ?? 'encoding'
        // PascalCase the toolId: "json-formatter" → "JsonFormatter"
        const pascal = toolId
            .split('-')
            .map(p => p[0].toUpperCase() + p.slice(1))
            .join('')
        componentCache[toolId] = lazy(
            () => import(`../tools/${folder}/${pascal}.tsx`)
        )
    }
    return componentCache[toolId]
}

function LoadingPlaceholder() {
    return (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading tool…
        </div>
    )
}

function NotFound({ toolId }: { toolId: string }) {
    return (
        <div style={{ padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            Tool <code style={{ fontFamily: 'var(--font-mono)' }}>{toolId}</code> not found.
        </div>
    )
}

export function ToolPage() {
    const { toolId = '' } = useParams<{ toolId: string }>()
    const tool = findTool(toolId)

    // Update page title
    useEffect(() => {
        document.title = tool ? `${tool.name} — DevTools` : 'DevTools'
        return () => { document.title = 'DevTools' }
    }, [tool])

    if (!tool) return <NotFound toolId={toolId} />

    const ToolComponent = getToolComponent(toolId, tool.category)

    return (
        <Suspense fallback={<LoadingPlaceholder />}>
            <ToolComponent />
        </Suspense>
    )
}
