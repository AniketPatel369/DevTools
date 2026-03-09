import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Spinner } from '@/components/ui/Spinner'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { pbkdf2, randomSalt, type HashAlgorithm } from '@/utils/crypto'

const ALGOS: HashAlgorithm[] = ['SHA-256', 'SHA-512', 'SHA-1']

export default function PasswordHash() {
    const { output, setOutput, clearOutput } = useTool('password-hash')
    const [input, setInput] = useState(output?.input ?? '')
    const [iterations, setIterations] = useState(100)
    const [keyLength, setKeyLength] = useState(32)
    const [algo, setAlgo] = useState<HashAlgorithm>('SHA-256')
    const [randomSaltEnabled, setRandom] = useState(true)
    const [customSalt, setCustomSalt] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const run = async () => {
        setError(''); setLoading(true)
        try {
            const salt = randomSaltEnabled ? randomSalt(16) : customSalt || randomSalt(16)
            const { derivedKey, algorithm } = await pbkdf2(input, salt, iterations, keyLength, algo)
            const fullHash = `${algo}:${iterations * 1000}:${salt}:${derivedKey}`
            const fields: OutputField[] = [
                { label: 'Derived Key', value: derivedKey },
                { label: 'Salt', value: salt },
                { label: 'Algorithm', value: algorithm },
                { label: 'Iterations', value: (iterations * 1000).toLocaleString() },
                { label: 'Full Hash String', value: fullHash },
            ]
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
        setLoading(false)
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="password-hash">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter password to hash…" minHeight="70px" />
            <ToolOptions>
                {!randomSaltEnabled && (
                    <div className="tool-option-group">
                        <label>Custom Salt</label>
                        <input
                            style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '5px 10px', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}
                            value={customSalt} onChange={e => setCustomSalt(e.target.value)} placeholder="Enter salt…"
                        />
                    </div>
                )}
                <Spinner label="Iterations (thousands)" value={iterations} onChange={setIterations} min={1} max={9999} />
                <Spinner label="Key Length (bytes)" value={keyLength} onChange={setKeyLength} min={16} max={128} step={8} />
                <div className="tool-option-group">
                    <label>Hash Function</label>
                    <Dropdown options={ALGOS} value={algo} onChange={v => setAlgo(v as HashAlgorithm)} />
                </div>
                <label className="dt-checkbox">
                    <input type="checkbox" checked={randomSaltEnabled} onChange={e => setRandom(e.target.checked)} />
                    Generate random salt
                </label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} disabled={loading} icon={<Play size={13} />}>
                    {loading ? 'Computing…' : 'Generate Hash'}
                </Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} loading={loading} />
        </ToolLayout>
    )
}
