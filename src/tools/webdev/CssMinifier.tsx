import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { formatBytes } from '@/utils/format'

function minifyCss(css: string): string {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')   // comments
        .replace(/\s+/g, ' ')               // whitespace
        .replace(/\s*([{}:;,>~+])\s*/g, '$1') // around special chars
        .replace(/;}/g, '}')               // trailing semicolon before }
        .replace(/\s*!\s*important/g, ' !important')
        .trim()
}

export default function CssMinifier() {
    const { output, setOutput, clearOutput } = useTool('css-minifier')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const minified = minifyCss(input)
            const saved = input.length - minified.length
            const pct = input.length ? Math.round(saved / input.length * 100) : 0
            const fields: OutputField[] = [
                { label: 'Minified CSS', value: minified },
                { label: 'Stats', value: `Original: ${formatBytes(input.length)} → Minified: ${formatBytes(minified.length)} (saved ${pct}%)` },
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
        <ToolLayout toolId="css-minifier">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste CSS here…" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Minify</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
