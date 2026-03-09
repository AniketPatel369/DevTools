import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

// Basic GraphQL formatter (indent by 2 spaces on {, dedent on })
function formatGraphql(input: string): string {
    let depth = 0
    const tokens = input.replace(/\s+/g, ' ').trim()
        .split(/([\{\}])/g).flatMap(t => t.split(/([\{\}])/))
    const lines: string[] = []
    for (const token of tokens) {
        const t = token.trim()
        if (!t) continue
        if (t === '}') { depth--; lines.push(' '.repeat(depth * 2) + t) }
        else if (t === '{') { const last = lines.length - 1; lines[last] = (lines[last] ?? '') + ' {'; depth++ }
        else { lines.push(' '.repeat(depth * 2) + t) }
    }
    return lines.join('\n')
}

export default function GraphqlFormatter() {
    const { output, setOutput, clearOutput } = useTool('graphql-formatter')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try { setOutput({ input, output: formatGraphql(input) }) } catch (e) { setError((e as Error).message) }
    }
    const minify = () => {
        setError('')
        setOutput({ input, output: input.replace(/\s+/g, ' ').trim() })
    }
    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="graphql-formatter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste GraphQL query or schema…" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Format</Button>
                <Button variant="secondary" onClick={minify}>Minify</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'Formatted GraphQL', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
