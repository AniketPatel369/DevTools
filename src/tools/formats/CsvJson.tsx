import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

function parseCsv(csv: string, hasHeader: boolean): { headers: string[]; rows: string[][] } {
    const lines = csv.trim().split('\n')
    const parsed = lines.map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"')))
    const headers = hasHeader ? parsed[0] : parsed[0].map((_, i) => `col${i + 1}`)
    const rows = hasHeader ? parsed.slice(1) : parsed
    return { headers, rows }
}

export default function CsvJson() {
    const { output, setOutput, clearOutput } = useTool('csv-json')
    const [input, setInput] = useState(output?.input ?? '')
    const [hasHeader, setHasHeader] = useState(true)
    const [indent, setIndent] = useState(true)
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const { headers, rows } = parseCsv(input, hasHeader)
            const obj = rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])))
            setOutput({ input, output: JSON.stringify(obj, null, indent ? 2 : 0) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="csv-json">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste CSV here…" />
            <ToolOptions>
                <label className="dt-checkbox">
                    <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} />
                    First row is header
                </label>
                <label className="dt-checkbox">
                    <input type="checkbox" checked={indent} onChange={e => setIndent(e.target.checked)} />
                    Pretty Print
                </label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Convert to JSON</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'JSON Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
