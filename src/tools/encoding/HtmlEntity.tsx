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

const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;", '/': '&#47;'
}
const HTML_DECODE: Record<string, string> = Object.fromEntries(Object.entries(HTML_ENTITIES).map(([k, v]) => [v, k]))
const ENCODE_RE = /[&<>"'/]/g
const DECODE_RE = /&amp;|&lt;|&gt;|&quot;|&#39;|&#47;/g

function encode(s: string) { return s.replace(ENCODE_RE, c => HTML_ENTITIES[c] ?? c) }
function decode(s: string) { return s.replace(DECODE_RE, e => HTML_DECODE[e] ?? e) }

export default function HtmlEntity() {
    const { output, setOutput, clearOutput } = useTool('html-entity')
    const [input, setInput] = useState(output?.input ?? '')
    const [mode, setMode] = useState<Mode>('Encode')

    const run = () => setOutput({ input, output: mode === 'Encode' ? encode(input) : decode(input) })
    const swap = () => { if (typeof output?.output === 'string') { setInput(output.output); clearOutput() } }
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="html-entity">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter HTML or text with entities…" />
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
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
