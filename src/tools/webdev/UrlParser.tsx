import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

export default function UrlParser() {
    const { output, setOutput, clearOutput } = useTool('url-parser')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const url = new URL(input.trim().startsWith('http') ? input.trim() : 'https://' + input.trim())
            const params = [...url.searchParams.entries()].map(([k, v]) => `  ${k}: ${v}`).join('\n')
            const fields: OutputField[] = [
                { label: 'Protocol', value: url.protocol },
                { label: 'Hostname', value: url.hostname },
                { label: 'Port', value: url.port || '(default)' },
                { label: 'Pathname', value: url.pathname },
                { label: 'Search', value: url.search || '(none)' },
                { label: 'Hash', value: url.hash || '(none)' },
                { label: 'Origin', value: url.origin },
                ...(url.searchParams.size ? [{ label: 'Query Parameters', value: params }] : []),
            ]
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError('Invalid URL: ' + (e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="url-parser">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="https://example.com/path?key=value#section" minHeight="60px" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Parse URL</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
