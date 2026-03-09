import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'

type Mode = 'Encode' | 'Decode'

function encode(str: string): string { return encodeURIComponent(str) }
function decode(str: string): string {
    try { return decodeURIComponent(str) } catch { throw new Error('Invalid URL-encoded string') }
}

export default function UrlEncode() {
    const { output, setOutput, clearOutput } = useTool('url-encode')
    const [input, setInput] = useState(output?.input ?? '')
    const [mode, setMode] = useState<Mode>('Encode')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            setOutput({ input, output: mode === 'Encode' ? encode(input) : decode(input) })
        } catch (e) { setError((e as Error).message) }
    }

    const swap = () => {
        if (output?.output && typeof output.output === 'string') {
            setInput(output.output); clearOutput()
            setMode(m => m === 'Encode' ? 'Decode' : 'Encode')
        }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="url-encode">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter URL or encoded string…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Mode</label>
                    <Toggle options={['Encode', 'Decode']} value={mode} onChange={v => setMode(v as Mode)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>{mode}</Button>
                <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
