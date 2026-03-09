import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { rot13 } from '@/utils/text'

export default function Rot13Cipher() {
    const { output, setOutput, clearOutput } = useTool('rot13-cipher')
    const [input, setInput] = useState(output?.input ?? '')

    const run = () => setOutput({ input, output: rot13(input) })
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="rot13-cipher">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter text to apply ROT13…" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Apply ROT13</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
