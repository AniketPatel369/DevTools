import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'

type Mode = 'Escape' | 'Unescape'

function escapeUnicode(s: string): string {
    return Array.from(s).map(c => {
        const cp = c.codePointAt(0)!
        return cp > 127 ? `\\u${cp.toString(16).padStart(4, '0').toUpperCase()}` : c
    }).join('')
}

function unescapeUnicode(s: string): string {
    return s.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
}

export default function UnicodeEscape() {
    const { output, setOutput, clearOutput } = useTool('unicode-escape')
    const [input, setInput] = useState(output?.input ?? '')
    const [mode, setMode] = useState<Mode>('Escape')

    const run = () => setOutput({ input, output: mode === 'Escape' ? escapeUnicode(input) : unescapeUnicode(input) })
    const swap = () => { if (typeof output?.output === 'string') { setInput(output.output); clearOutput() } }
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="unicode-escape">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter text or \\uXXXX sequences…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Mode</label>
                    <Toggle options={['Escape', 'Unescape']} value={mode} onChange={v => setMode(v as Mode)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>{mode}</Button>
                <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
