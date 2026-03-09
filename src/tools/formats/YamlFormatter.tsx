import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'
import yaml from 'js-yaml'

export default function YamlFormatter() {
    const { output, setOutput, clearOutput } = useTool('yaml-formatter')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const format = () => {
        setError('')
        try {
            const obj = yaml.load(input)
            const result = yaml.dump(obj, { indent: 2, lineWidth: 120 })
            setOutput({ input, output: result })
        } catch (e) { setError((e as Error).message) }
    }

    const validate = () => {
        setError('')
        try { yaml.load(input); setError('✓ Valid YAML') } catch (e) { setError('✗ ' + (e as Error).message) }
    }

    const swap = () => { if (typeof output?.output === 'string') { setInput(output.output); clearOutput() } }
    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="yaml-formatter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste YAML here…" />
            <div className="tool-actions">
                <Button onClick={format} icon={<Play size={13} />}>Format</Button>
                <Button variant="secondary" onClick={validate}>Validate</Button>
                <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: error.startsWith('✓') ? 'var(--color-success)' : 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'Formatted YAML', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
