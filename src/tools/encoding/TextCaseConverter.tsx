import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { toCase, type TextCase } from '@/utils/text'

const CASES: TextCase[] = ['camelCase', 'snake_case', 'UPPER_SNAKE', 'kebab-case', 'PascalCase', 'Title Case', 'UPPERCASE', 'lowercase', 'dot.case']

export default function TextCaseConverter() {
    const { output, setOutput, clearOutput } = useTool('text-case-converter')
    const [input, setInput] = useState(output?.input ?? '')
    const [targetCase, setTargetCase] = useState<TextCase>('camelCase')

    const runAll = () => {
        const fields: OutputField[] = CASES.map(c => ({ label: c, value: toCase(input, c) }))
        setOutput({ input, output: JSON.stringify(fields) })
    }

    const runOne = () => {
        setOutput({ input, output: toCase(input, targetCase) })
    }

    const clear = () => { setInput(''); clearOutput() }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch {
            fields = [{ label: 'Output', value: output.output }]
        }
    }

    return (
        <ToolLayout toolId="text-case-converter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter text (e.g. Hello World or hello_world)…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Target Case</label>
                    <Dropdown options={CASES} value={targetCase} onChange={v => setTargetCase(v as TextCase)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={runOne} icon={<Play size={13} />}>Convert to {targetCase}</Button>
                <Button variant="secondary" onClick={runAll}>Show All Cases</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
