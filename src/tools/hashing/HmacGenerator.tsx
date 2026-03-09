import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Textarea } from '@/components/ui/Textarea'
import { Dropdown } from '@/components/ui/Dropdown'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { hmac, type HashAlgorithm, type OutputFormat } from '@/utils/crypto'

const ALGOS: HashAlgorithm[] = ['SHA-256', 'SHA-512', 'SHA-1']
const FORMATS: OutputFormat[] = ['hex', 'base64']

export default function HmacGenerator() {
    const { output, setOutput, clearOutput } = useTool('hmac-generator')
    const [message, setMessage] = useState(output?.input ?? '')
    const [key, setKey] = useState('')
    const [algo, setAlgo] = useState<HashAlgorithm>('SHA-256')
    const [format, setFormat] = useState<OutputFormat>('hex')
    const [error, setError] = useState('')

    const run = async () => {
        setError('')
        try {
            const result = await hmac(key, message, algo, format)
            const fields: OutputField[] = [{ label: `HMAC-${algo} (${format})`, value: result }]
            setOutput({ input: message, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setMessage(''); setKey(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="hmac-generator">
            <div className="tool-body" style={{ gap: 'var(--space-3)' }}>
                <Textarea label="Secret Key" value={key} onChange={setKey} placeholder="Enter secret key…" minHeight="60px" />
                <Textarea label="Message" value={message} onChange={setMessage} placeholder="Enter message to sign…" />
            </div>
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Algorithm</label>
                    <Dropdown options={ALGOS} value={algo} onChange={v => setAlgo(v as HashAlgorithm)} />
                </div>
                <div className="tool-option-group">
                    <label>Output</label>
                    <Toggle options={['hex', 'base64']} value={format} onChange={v => setFormat(v as OutputFormat)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Generate HMAC</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
