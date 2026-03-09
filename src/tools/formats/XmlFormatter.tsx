import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

export default function XmlFormatter() {
    const { output, setOutput, clearOutput } = useTool('xml-formatter')
    const [input, setInput] = useState(output?.input ?? '')
    const [indent, setIndent] = useState(2)
    const [error, setError] = useState('')

    const format = () => {
        setError('')
        try {
            const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true })
            const obj = parser.parse(input)
            const builder = new XMLBuilder({ ignoreAttributes: false, preserveOrder: true, format: true, indentBy: ' '.repeat(indent) })
            setOutput({ input, output: builder.build(obj) })
        } catch (e) { setError((e as Error).message) }
    }

    const minify = () => {
        setError('')
        try {
            const trimmed = input.replace(/>\s+</g, '><').trim()
            setOutput({ input, output: trimmed })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="xml-formatter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste XML here…" />
            <ToolOptions>
                <Spinner label="Indent Spaces" value={indent} onChange={setIndent} min={1} max={8} />
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={format} icon={<Play size={13} />}>Format</Button>
                <Button variant="secondary" onClick={minify}>Minify</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
