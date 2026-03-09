import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Toggle } from '@/components/ui/Toggle'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

type Mode = 'Pretty' | 'Minify' | 'Compact'

function formatJson(text: string, mode: Mode, indent: number, sort: boolean): string {
    let obj = JSON.parse(text)
    if (sort) obj = sortKeys(obj)
    if (mode === 'Pretty') return JSON.stringify(obj, null, indent)
    if (mode === 'Minify') return JSON.stringify(obj)
    if (mode === 'Compact') return JSON.stringify(obj, null, 0)
    return JSON.stringify(obj)
}

function sortKeys(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map(sortKeys)
    if (obj && typeof obj === 'object') {
        return Object.fromEntries(Object.entries(obj as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sortKeys(v)]))
    }
    return obj
}

export default function JsonFormatter() {
    const { output, setOutput, clearOutput } = useTool('json-formatter')
    const [input, setInput] = useState(output?.input ?? '')
    const [mode, setMode] = useState<Mode>('Pretty')
    const [indent, setIndent] = useState(2)
    const [sort, setSort] = useState(false)
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const result = formatJson(input.trim(), mode, indent, sort)
            setOutput({ input, output: result })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="json-formatter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste JSON here…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Mode</label>
                    <Toggle options={['Pretty', 'Minify', 'Compact']} value={mode} onChange={v => setMode(v as Mode)} />
                </div>
                <Spinner label="Indent Spaces" value={indent} onChange={setIndent} min={1} max={8} />
                <label className="dt-checkbox">
                    <input type="checkbox" checked={sort} onChange={e => setSort(e.target.checked)} />
                    Sort Keys
                </label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Format</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
