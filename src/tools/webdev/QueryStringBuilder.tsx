import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Plus, Trash2 } from 'lucide-react'

interface Param { key: string; value: string }

export default function QueryStringBuilder() {
    const { output, setOutput, clearOutput } = useTool('query-string-builder')
    const [baseUrl, setBaseUrl] = useState(output?.input ?? 'https://example.com/api')
    const [params, setParams] = useState<Param[]>([{ key: '', value: '' }])

    const addParam = () => setParams(p => [...p, { key: '', value: '' }])
    const delParam = (i: number) => setParams(p => p.filter((_, j) => j !== i))
    const setKey = (i: number, k: string) => setParams(p => p.map((par, j) => j === i ? { ...par, key: k } : par))
    const setVal = (i: number, v: string) => setParams(p => p.map((par, j) => j === i ? { ...par, value: v } : par))

    const build = () => {
        const valid = params.filter(p => p.key.trim())
        const search = valid.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')
        const full = `${baseUrl.trim()}${search ? '?' + search : ''}`
        const fields: OutputField[] = [
            { label: 'Full URL', value: full },
            { label: 'Query String', value: search ? '?' + search : '(none)' },
        ]
        setOutput({ input: baseUrl, output: JSON.stringify(fields) })
    }

    const clear = () => { setBaseUrl('https://example.com/api'); setParams([{ key: '', value: '' }]); clearOutput() }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    const inputStyle = {
        background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
        padding: '5px 10px', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)',
    }

    return (
        <ToolLayout toolId="query-string-builder">
            <div className="dt-textarea-wrap">
                <div className="dt-textarea-head"><span className="dt-textarea-label">Base URL</span></div>
                <input style={{ ...inputStyle, width: '100%' }} value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://api.example.com/endpoint" />
            </div>

            <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-semibold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span style={{ flex: 1 }}>KEY</span><span style={{ flex: 1 }}>VALUE</span><span style={{ width: 28 }} />
                </div>
                {params.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', alignItems: 'center' }}>
                        <input style={{ ...inputStyle, flex: 1 }} value={p.key} onChange={e => setKey(i, e.target.value)} placeholder="key" />
                        <input style={{ ...inputStyle, flex: 1 }} value={p.value} onChange={e => setVal(i, e.target.value)} placeholder="value" />
                        <button onClick={() => delParam(i)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', background: 'transparent', cursor: 'pointer' }} aria-label="Remove parameter">
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                <button onClick={addParam} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', padding: 0, marginTop: 'var(--space-1)' }}>
                    <Plus size={13} /> Add Parameter
                </button>
            </div>

            <div className="tool-actions">
                <Button onClick={build} icon={<Play size={13} />}>Build URL</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
