import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { removeDuplicateLines } from '@/utils/text'

export default function DuplicateRemover() {
    const { output, setOutput, clearOutput } = useTool('duplicate-remover')
    const [input, setInput] = useState(output?.input ?? '')
    const [caseSensitive, setCaseSensitive] = useState(true)
    const [trim, setTrim] = useState(true)

    const run = () => {
        const cleaned = removeDuplicateLines(input, caseSensitive, trim)
        const original = input.split('\n').length
        const result = cleaned.split('\n').length
        const removed = original - result
        const fields: OutputField[] = [
            { label: 'Result', value: cleaned },
            { label: 'Lines Removed', value: `${removed} duplicate${removed !== 1 ? 's' : ''} removed (${original} → ${result} lines)` },
        ]
        setOutput({ input, output: JSON.stringify(fields) })
    }

    const clear = () => { setInput(''); clearOutput() }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { fields = [{ label: 'Output', value: output.output }] }
    }

    return (
        <ToolLayout toolId="duplicate-remover">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste lines (duplicates will be removed)…" />
            <ToolOptions>
                <label className="dt-checkbox">
                    <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} />
                    Case Sensitive
                </label>
                <label className="dt-checkbox">
                    <input type="checkbox" checked={trim} onChange={e => setTrim(e.target.checked)} />
                    Trim Lines
                </label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Remove Duplicates</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
