import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'

// TOML parser (basic subset — no npm dep)
function parseToml(input: string): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    let current: Record<string, unknown> = result
    for (const rawLine of input.split('\n')) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#')) continue
        const sectionMatch = line.match(/^\[([^\]]+)\]$/)
        if (sectionMatch) {
            const parts = sectionMatch[1].split('.')
            current = result
            for (const part of parts) {
                if (!current[part]) current[part] = {}
                current = current[part] as Record<string, unknown>
            }
            continue
        }
        const kvMatch = line.match(/^(\w+)\s*=\s*(.+)$/)
        if (kvMatch) {
            const [, key, rawVal] = kvMatch
            let val: unknown = rawVal.trim()
            if ((val as string).startsWith('"') || (val as string).startsWith("'")) {
                val = (val as string).slice(1, -1)
            } else if (!isNaN(Number(val))) {
                val = Number(val)
            } else if (val === 'true' || val === 'false') {
                val = val === 'true'
            }
            current[key] = val
        }
    }
    return result
}

export default function TomlParser() {
    const { output, setOutput, clearOutput } = useTool('toml-parser')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const obj = parseToml(input)
            setOutput({ input, output: JSON.stringify(obj, null, 2) })
        } catch (e) { setError((e as Error).message) }
    }
    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="toml-parser">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste TOML here…" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Parse → JSON</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'JSON Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
