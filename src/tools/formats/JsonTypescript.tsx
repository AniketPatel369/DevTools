import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

type Modifier = 'optional' | 'required'

function jsonToType(value: unknown, depth = 0): string {
    if (value === null) return 'null'
    if (Array.isArray(value)) {
        if (!value.length) return 'unknown[]'
        const types = new Set(value.map(v => jsonToType(v, depth + 1)))
        return types.size === 1 ? `${[...types][0]}[]` : `(${[...types].join(' | ')})[]`
    }
    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>)
        if (!entries.length) return 'Record<string, unknown>'
        const indent = '  '.repeat(depth + 1)
        const body = entries.map(([k, v]) => `${indent}${k}: ${jsonToType(v, depth + 1)};`).join('\n')
        return `{\n${body}\n${'  '.repeat(depth)}}`
    }
    return typeof value
}

export default function JsonTypescript() {
    const { output, setOutput, clearOutput } = useTool('json-typescript')
    const [input, setInput] = useState(output?.input ?? '')
    const [typeName, setTypeName] = useState('MyType')
    const [asInterface, setAsInterface] = useState(true)
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const obj = JSON.parse(input)
            const body = jsonToType(obj)
            const keyword = asInterface ? 'interface' : 'type'
            const result = asInterface
                ? `${keyword} ${typeName} ${body}`
                : `${keyword} ${typeName} = ${body}`
            setOutput({ input, output: result })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="json-typescript">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste JSON here…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Type Name</label>
                    <input
                        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '5px 10px', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', width: 150 }}
                        value={typeName} onChange={e => setTypeName(e.target.value)} placeholder="MyType"
                    />
                </div>
                <label className="dt-checkbox">
                    <input type="checkbox" checked={asInterface} onChange={e => setAsInterface(e.target.checked)} />
                    Generate as interface (vs type)
                </label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Generate TypeScript</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'TypeScript Type', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
