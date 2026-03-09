import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

interface JwtParts { header: Record<string, unknown>; payload: Record<string, unknown> }

function parseJwt(token: string): JwtParts {
    const parts = token.trim().split('.')
    if (parts.length < 2) throw new Error('Invalid JWT: must have at least 2 parts')
    const decode = (s: string) => {
        const pad = s.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(pad + '='.repeat((4 - pad.length % 4) % 4)))
    }
    return { header: decode(parts[0]), payload: decode(parts[1]) }
}

function formatExpiry(exp?: number): string {
    if (!exp) return ''
    const d = new Date(exp * 1000)
    const expired = Date.now() > exp * 1000
    return `${d.toLocaleString()} ${expired ? '⚠ EXPIRED' : '✓ Valid'}`
}

export default function JwtDecoder() {
    const { output, setOutput, clearOutput } = useTool('jwt-decoder')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const { header, payload } = parseJwt(input)
            const fields: OutputField[] = [
                { label: 'Header', value: JSON.stringify(header, null, 2) },
                { label: 'Payload', value: JSON.stringify(payload, null, 2) },
            ]
            if (typeof payload.exp === 'number') {
                fields.push({ label: 'Expiry', value: formatExpiry(payload.exp) })
            }
            if (typeof payload.iat === 'number') {
                fields.push({ label: 'Issued At', value: new Date(payload.iat * 1000).toLocaleString() })
            }
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="jwt-decoder">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste your JWT token here…" minHeight="80px" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Decode</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
