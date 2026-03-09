import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'

export default function Nanoid() {
    const { output, setOutput, clearOutput } = useTool('nanoid')
    const [size, setSize] = useState(21)
    const [count, setCount] = useState(1)

    const run = () => {
        const ids = Array.from({ length: count }, () => nanoid(size))
        const fields: OutputField[] = ids.map((id, i) => ({
            label: count > 1 ? `Nanoid #${i + 1}` : 'Nanoid',
            value: id,
        }))
        setOutput({ input: `size:${size}`, output: JSON.stringify(fields) })
    }

    const clear = () => clearOutput()

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="nanoid">
            <ToolOptions>
                <Spinner label="Size (chars)" value={size} onChange={setSize} min={5} max={64} />
                <Spinner label="Count" value={count} onChange={setCount} min={1} max={50} />
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Generate</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
