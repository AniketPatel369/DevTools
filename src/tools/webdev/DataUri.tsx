import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'

type Mode = 'Encode' | 'Decode'

export default function DataUri() {
    const { output, setOutput, clearOutput } = useTool('data-uri')
    const [input, setInput] = useState(output?.input ?? '')
    const [mimeType, setMimeType] = useState('text/plain')
    const [mode, setMode] = useState<Mode>('Encode')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            if (mode === 'Encode') {
                const b64 = btoa(unescape(encodeURIComponent(input)))
                const uri = `data:${mimeType};base64,${b64}`
                setOutput({ input, output: JSON.stringify([{ label: 'Data URI', value: uri }, { label: 'Length', value: `${uri.length.toLocaleString()} chars` }]) })
            } else {
                const match = input.trim().match(/^data:([^;]+);base64,(.+)$/)
                if (!match) throw new Error('Invalid data URI format')
                const decoded = decodeURIComponent(escape(atob(match[2])))
                setOutput({ input, output: JSON.stringify([{ label: 'MIME Type', value: match[1] }, { label: 'Content', value: decoded }]) })
            }
        } catch (e) { setError((e as Error).message) }
    }

    const swap = () => { if (typeof output?.output === 'string') { const f = JSON.parse(output.output); setInput(f[0]?.value ?? ''); clearOutput() } }
    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    const MIME_TYPES = ['text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json', 'image/svg+xml', 'image/png', 'image/jpeg']

    return (
        <ToolLayout toolId="data-uri">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder={mode === 'Encode' ? 'Enter text/SVG content to encode…' : 'Paste data URI…'} />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Mode</label>
                    <Toggle options={['Encode', 'Decode']} value={mode} onChange={v => setMode(v as Mode)} />
                </div>
                {mode === 'Encode' && (
                    <div className="tool-option-group">
                        <label>MIME Type</label>
                        <select className="dt-dropdown" value={mimeType} onChange={e => setMimeType(e.target.value)}>
                            {MIME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                )}
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>{mode}</Button>
                <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
