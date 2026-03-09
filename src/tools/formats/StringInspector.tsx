import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { analyzeText } from '@/utils/text'
import { formatBytes } from '@/utils/format'

export default function StringInspector() {
    const { output, setOutput, clearOutput } = useTool('string-inspector')
    const [input, setInput] = useState(output?.input ?? '')

    const run = () => {
        const stats = analyzeText(input)
        const fields: OutputField[] = [
            { label: 'Characters', value: stats.characters.toLocaleString() },
            { label: 'Characters (no spaces)', value: stats.characterNoSpaces.toLocaleString() },
            { label: 'Words', value: stats.words.toLocaleString() },
            { label: 'Lines', value: stats.lines.toLocaleString() },
            { label: 'Sentences', value: stats.sentences.toLocaleString() },
            { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
            { label: 'Byte Size', value: formatBytes(stats.bytes) },
            { label: 'Reading Time', value: `~${stats.readingTimeMin} min` },
            { label: 'Unique Words', value: countUnique(input).toLocaleString() },
        ]
        setOutput({ input, output: JSON.stringify(fields) })
    }

    const clear = () => { setInput(''); clearOutput() }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="string-inspector">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste text to inspect…" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Inspect</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}

function countUnique(text: string): number {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) ?? []
    return new Set(words).size
}
