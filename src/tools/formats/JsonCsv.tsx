import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

function jsonToCsv(json: string): string {
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) throw new Error('Input must be a JSON array of objects')
    const headers = [...new Set(arr.flatMap(o => Object.keys(o)))]
    const escape = (s: string) => {
        const str = String(s ?? '')
        return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str
    }
    const rows = arr.map(o => headers.map(h => escape(o[h] ?? '')).join(','))
    return [headers.join(','), ...rows].join('\n')
}

export default function JsonCsv() {
    const { output, setOutput, clearOutput } = useTool('json-csv')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try { setOutput({ input, output: jsonToCsv(input) }) } catch (e) { setError((e as Error).message) }
    }
    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="json-csv">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder='Paste JSON array of objects (e.g. [{"name":"Alice","age":30}])…' />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Convert to CSV</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'CSV Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
