import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { hash, type HashAlgorithm, type OutputFormat } from '@/utils/crypto'

const ALGOS: HashAlgorithm[] = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1']
const FORMATS: OutputFormat[] = ['hex', 'base64']

export default function HashGenerator() {
    const { output, setOutput, clearOutput } = useTool('hash-generator')
    const [input, setInput] = useState(output?.input ?? '')
    const [algo, setAlgo] = useState<HashAlgorithm>('SHA-256')
    const [format, setFormat] = useState<OutputFormat>('hex')
    const [error, setError] = useState('')

    const run = async () => {
        setError('')
        try {
            const result = await hash(input, algo, format)
            const fields: OutputField[] = [{ label: `${algo} (${format})`, value: result }]
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const runAll = async () => {
        setError('')
        try {
            const results = await Promise.all(ALGOS.map(a => hash(input, a, format).then(v => ({ label: `${a} (${format})`, value: v }))))
            setOutput({ input, output: JSON.stringify(results) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="hash-generator">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter text to hash…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Algorithm</label>
                    <Dropdown options={ALGOS} value={algo} onChange={v => setAlgo(v as HashAlgorithm)} />
                </div>
                <div className="tool-option-group">
                    <label>Output</label>
                    <Toggle options={['hex', 'base64']} value={format} onChange={v => setFormat(v as OutputFormat)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Generate</Button>
                <Button variant="secondary" onClick={runAll}>All Algorithms</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
