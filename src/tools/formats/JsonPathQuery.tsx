import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

// Minimal JSONPath evaluator for basic expressions
function jsonPath(obj: unknown, path: string): unknown {
    const clean = path.startsWith('$.') ? path.slice(2) : path.startsWith('$') ? path.slice(1) : path
    if (!clean) return obj
    const parts = clean.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
    let current: unknown = obj
    for (const part of parts) {
        if (current == null) return undefined
        if (part === '*' && Array.isArray(current)) return current
        if (part === '*' && typeof current === 'object') return Object.values(current as Record<string, unknown>)
        current = (current as Record<string, unknown>)[part]
    }
    return current
}

export default function JsonPathQuery() {
    const { output, setOutput, clearOutput } = useTool('json-path-query')
    const [json, setJson] = useState(output?.input ?? '')
    const [path, setPath] = useState('$.store.book[0].title')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const obj = JSON.parse(json)
            const result = jsonPath(obj, path.trim())
            const fields: OutputField[] = [
                { label: 'Result', value: JSON.stringify(result, null, 2) },
                { label: 'Type', value: Array.isArray(result) ? `Array (${(result as unknown[]).length} items)` : typeof result },
            ]
            setOutput({ input: json, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setJson(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="json-path-query">
            <ToolInput value={json} onChange={setJson} onClear={clear} placeholder="Paste JSON here…" />
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '8px 14px' }}>
                <span style={{ color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>$</span>
                <input
                    style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--color-formats)', background: 'transparent' }}
                    value={path} onChange={e => setPath(e.target.value)} placeholder=".store.book[0].title"
                />
            </div>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Query</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
