import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

function convert(n: number): OutputField[] {
    if (isNaN(n) || !isFinite(n)) return []
    const int = Math.trunc(n)
    return [
        { label: 'Decimal', value: int.toString(10) },
        { label: 'Binary', value: int.toString(2) },
        { label: 'Octal', value: int.toString(8) },
        { label: 'Hexadecimal', value: int.toString(16).toUpperCase() },
    ]
}

function detect(s: string): number {
    const t = s.trim()
    if (t.startsWith('0b') || t.startsWith('0B')) return parseInt(t.slice(2), 2)
    if (t.startsWith('0x') || t.startsWith('0X')) return parseInt(t.slice(2), 16)
    if (t.startsWith('0o') || t.startsWith('0O')) return parseInt(t.slice(2), 8)
    if (/^[01]+$/.test(t)) return parseInt(t, 2)
    if (/^[0-7]+$/.test(t)) return parseInt(t, 8)
    if (/^[0-9a-fA-F]+$/.test(t) && /[a-fA-F]/.test(t)) return parseInt(t, 16)
    return parseInt(t, 10)
}

export default function BinaryHexOctal() {
    const { output, setOutput, clearOutput } = useTool('binary-hex-octal')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        const n = detect(input)
        if (isNaN(n)) { setError('Could not parse the input as a number'); return }
        const fields = convert(n)
        setOutput({ input, output: JSON.stringify(fields) })
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="binary-hex-octal">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter a number in any base (decimal, 0b binary, 0x hex, 0o octal)…" minHeight="70px" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Convert</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
