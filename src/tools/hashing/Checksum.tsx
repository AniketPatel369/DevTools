import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, RefreshCw, Trash2 } from 'lucide-react'
import { hash, type HashAlgorithm } from '@/utils/crypto'

const ALGOS: HashAlgorithm[] = ['SHA-256', 'SHA-512', 'SHA-1']

export default function Checksum() {
    const { output, setOutput, clearOutput } = useTool('checksum')
    const [input, setInput] = useState(output?.input ?? '')
    const [compare, setCompare] = useState('')
    const [algo, setAlgo] = useState<HashAlgorithm>('SHA-256')
    const [error, setError] = useState('')

    const run = async () => {
        setError('')
        try {
            const result = await hash(input, algo, 'hex')
            const match = compare.trim() ? compare.trim().toLowerCase() === result.toLowerCase() : undefined
            const fields: OutputField[] = [
                { label: `${algo} Checksum`, value: result },
            ]
            if (match !== undefined) {
                fields.push({ label: 'Verification', value: match ? '✓ Checksums match' : '✗ Checksums do NOT match' })
            }
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); setCompare(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="checksum">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter text to checksum…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Algorithm</label>
                    <Dropdown options={ALGOS} value={algo} onChange={v => setAlgo(v as HashAlgorithm)} />
                </div>
                <div className="tool-option-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label>Compare with (optional)</label>
                    <input
                        style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '5px 10px', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', width: '100%', fontFamily: 'var(--font-mono)' }}
                        value={compare} onChange={e => setCompare(e.target.value)} placeholder="Paste expected checksum to verify…"
                    />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Compute</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
