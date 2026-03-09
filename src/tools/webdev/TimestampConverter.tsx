import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useTool } from '@/hooks/useTool'
import { Play, Clock, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/format'

type InputMode = 'Unix (seconds)' | 'Unix (ms)' | 'ISO 8601' | 'Human'

const INPUT_MODES: InputMode[] = ['Unix (seconds)', 'Unix (ms)', 'ISO 8601', 'Human']
const TIMEZONES = ['UTC', 'Asia/Kolkata', 'America/New_York', 'Europe/London', 'America/Los_Angeles', 'Asia/Tokyo', 'Australia/Sydney']

export default function TimestampConverter() {
    const { output, setOutput, clearOutput } = useTool('timestamp-converter')
    const [input, setInput] = useState(output?.input ?? '')
    const [mode, setMode] = useState<InputMode>('Unix (seconds)')
    const [error, setError] = useState('')

    const insertNow = () => setInput(String(Math.floor(Date.now() / 1000)))

    const run = () => {
        setError('')
        try {
            let d: Date
            if (mode === 'Unix (seconds)') d = new Date(parseInt(input) * 1000)
            else if (mode === 'Unix (ms)') d = new Date(parseInt(input))
            else d = new Date(input)
            if (isNaN(d.getTime())) throw new Error('Could not parse the input as a date/time')

            const unixSec = Math.floor(d.getTime() / 1000)
            const fields: OutputField[] = [
                { label: 'ISO 8601', value: d.toISOString() },
                { label: 'Unix Seconds', value: String(unixSec) },
                { label: 'Unix Ms', value: String(d.getTime()) },
                { label: 'UTC', value: d.toUTCString() },
                { label: 'Local', value: d.toLocaleString() },
                { label: 'Date Only', value: d.toLocaleDateString() },
                { label: 'Time Only', value: d.toLocaleTimeString() },
                { label: 'Day of Week', value: d.toLocaleDateString('en', { weekday: 'long' }) },
                { label: 'Relative', value: getRelative(unixSec) },
            ]
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="timestamp-converter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="1709900400 or 2024-03-08T12:00:00Z or now…" minHeight="70px" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Input Format</label>
                    <select className="dt-dropdown" value={mode} onChange={e => setMode(e.target.value as InputMode)}>
                        {INPUT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Convert</Button>
                <Button variant="secondary" onClick={insertNow} icon={<Clock size={13} />}>Now</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}

function getRelative(unixSec: number): string {
    const diff = Math.floor(Date.now() / 1000) - unixSec
    const abs = Math.abs(diff)
    const tense = diff >= 0 ? 'ago' : 'from now'
    if (abs < 60) return `${abs}s ${tense}`
    if (abs < 3600) return `${Math.floor(abs / 60)}m ${tense}`
    if (abs < 86400) return `${Math.floor(abs / 3600)}h ${tense}`
    return `${Math.floor(abs / 86400)}d ${tense}`
}
