import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import cronstrue from 'cronstrue'

function getNextDates(cron: string, count = 5): string[] {
    // Simple next-date computation for standard 5-field cron
    // (For real use an npm lib like cron-parser, but cronstrue covers the description)
    return ['Next execution times require cron-parser NPM package (not installed)']
}

export default function CronParser() {
    const { output, setOutput, clearOutput } = useTool('cron-parser')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const description = cronstrue.toString(input.trim())
            const fields: OutputField[] = [
                { label: 'Human Description', value: description },
                { label: 'Expression', value: input.trim() },
                { label: 'Fields', value: formatField(input.trim()) },
            ]
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { fields = [{ label: 'Output', value: output.output }] }
    }

    return (
        <ToolLayout toolId="cron-parser">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Cron expression (e.g. */5 * * * * or 0 9 * * MON-FRI)…" minHeight="60px" />
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                {['* * * * *', '0 * * * *', '0 9 * * 1-5', '0 0 1 * *', '*/5 * * * *'].map(e => (
                    <button key={e} onClick={() => setInput(e)} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        {e}
                    </button>
                ))}
            </div>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Parse</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}

function formatField(cron: string): string {
    const parts = cron.trim().split(/\s+/)
    const labels = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week', 'Year (optional)']
    return parts.map((p, i) => `${labels[i] ?? `Field ${i + 1}`}: ${p}`).join('\n')
}
