import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { slugify } from '@/utils/text'

const SEPARATORS = ['-', '_']

export default function Slugify() {
    const { output, setOutput, clearOutput } = useTool('slugify')
    const [input, setInput] = useState(output?.input ?? '')
    const [separator, setSeparator] = useState('-')

    const run = () => setOutput({ input, output: slugify(input, separator) })
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="slugify">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter text to slugify…" minHeight="70px" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Separator</label>
                    <Dropdown options={SEPARATORS} value={separator} onChange={setSeparator} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Slugify</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: 'Slug', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
