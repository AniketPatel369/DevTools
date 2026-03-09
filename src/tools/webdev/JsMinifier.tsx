import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { minify } from 'terser'
import { formatBytes } from '@/utils/format'

export default function JsMinifier() {
    const { output, setOutput, clearOutput } = useTool('js-minifier')
    const [input, setInput] = useState(output?.input ?? '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const run = async () => {
        setError(''); setLoading(true)
        try {
            const result = await minify(input, { compress: true, mangle: true })
            const min = result.code ?? ''
            const saved = input.length - min.length
            const pct = input.length ? Math.round(saved / input.length * 100) : 0
            const fields: OutputField[] = [
                { label: 'Minified JS', value: min },
                { label: 'Stats', value: `Original: ${formatBytes(input.length)} → Minified: ${formatBytes(min.length)} (saved ${pct}%)` },
            ]
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
        setLoading(false)
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { fields = [{ label: 'Output', value: output.output }] }
    }

    return (
        <ToolLayout toolId="js-minifier">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste JavaScript here…" />
            <div className="tool-actions">
                <Button onClick={run} disabled={loading} icon={<Play size={13} />}>{loading ? 'Minifying…' : 'Minify'}</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} loading={loading} />
        </ToolLayout>
    )
}
