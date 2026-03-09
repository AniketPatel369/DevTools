import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'
import yaml from 'js-yaml'

export default function JsonYaml() {
    const { output, setOutput, clearOutput } = useTool('json-yaml')
    const [input, setInput] = useState(output?.input ?? '')
    const [lastOp, setLastOp] = useState<'json' | 'yaml'>('yaml')
    const [error, setError] = useState('')

    const toYaml = () => {
        setError('')
        try {
            const obj = JSON.parse(input)
            setOutput({ input, output: yaml.dump(obj, { indent: 2 }) })
            setLastOp('yaml')
        } catch (e) { setError((e as Error).message) }
    }

    const toJson = () => {
        setError('')
        try {
            const obj = yaml.load(input)
            setOutput({ input, output: JSON.stringify(obj, null, 2) })
            setLastOp('json')
        } catch (e) { setError((e as Error).message) }
    }

    const swap = () => {
        if (typeof output?.output === 'string') {
            setInput(output.output); clearOutput()
        }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="json-yaml">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste JSON or YAML here…" />
            <div className="tool-actions">
                <Button onClick={toYaml} icon={<Play size={13} />}>To YAML</Button>
                <Button variant="secondary" onClick={toJson}>To JSON</Button>
                <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: lastOp === 'yaml' ? 'YAML Output' : 'JSON Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
