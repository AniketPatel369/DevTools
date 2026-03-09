import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { escapeText, unescapeText, type EscapeTarget } from '@/utils/text'

const TARGETS: EscapeTarget[] = ['JSON', 'SQL', 'Regex', 'Shell', 'CSV']

export default function TextEscape() {
    const { output, setOutput, clearOutput } = useTool('text-escape')
    const [input, setInput] = useState(output?.input ?? '')
    const [target, setTarget] = useState<EscapeTarget>('JSON')

    const escape = () => setOutput({ input, output: escapeText(input, target) })
    const unescape = () => setOutput({ input, output: unescapeText(input, target) })
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="text-escape">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter text to escape or unescape…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Target Format</label>
                    <Dropdown options={TARGETS} value={target} onChange={v => setTarget(v as EscapeTarget)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={escape} icon={<Play size={13} />}>Escape</Button>
                <Button variant="secondary" onClick={unescape}>Unescape</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
