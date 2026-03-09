import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

const CHARSET_ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?'

function generate(length: number, charset: string): string {
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    return Array.from(arr, n => charset[n % charset.length]).join('')
}

export default function RandomString() {
    const { output, setOutput, clearOutput } = useTool('random-string')
    const [length, setLength] = useState(32)
    const [count, setCount] = useState(1)
    const [useUpper, setUpper] = useState(true)
    const [useLower, setLower] = useState(true)
    const [useNums, setNums] = useState(true)
    const [useSymbols, setSymbols] = useState(false)

    const run = () => {
        let charset = ''
        if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz'
        if (useNums) charset += '0123456789'
        if (useSymbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?'
        if (!charset) charset = CHARSET_ALL

        const results = Array.from({ length: count }, (_, i) => ({
            label: count > 1 ? `String #${i + 1}` : 'Random String',
            value: generate(length, charset),
        }))
        setOutput({ input: `length:${length}`, output: JSON.stringify(results) })
    }

    const clear = () => clearOutput()

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="random-string">
            <ToolOptions>
                <Spinner label="Length" value={length} onChange={setLength} min={1} max={512} />
                <Spinner label="Count" value={count} onChange={setCount} min={1} max={50} />
                <label className="dt-checkbox"><input type="checkbox" checked={useUpper} onChange={e => setUpper(e.target.checked)} /> Uppercase</label>
                <label className="dt-checkbox"><input type="checkbox" checked={useLower} onChange={e => setLower(e.target.checked)} /> Lowercase</label>
                <label className="dt-checkbox"><input type="checkbox" checked={useNums} onChange={e => setNums(e.target.checked)} /> Numbers</label>
                <label className="dt-checkbox"><input type="checkbox" checked={useSymbols} onChange={e => setSymbols(e.target.checked)} /> Symbols</label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Generate</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
