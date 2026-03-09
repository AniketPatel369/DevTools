import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

function parseJwt(token: string) {
    const parts = token.trim().split('.')
    if (parts.length < 2) throw new Error('Invalid JWT')
    const decode = (s: string) => {
        const pad = s.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(pad + '='.repeat((4 - pad.length % 4) % 4)))
    }
    return {
        header: decode(parts[0]) as Record<string, unknown>,
        payload: decode(parts[1]) as Record<string, unknown>,
        signatureB64: parts[2] ?? '',
        parts,
    }
}

export default function JwtDebugger() {
    const { output, setOutput, clearOutput } = useTool('jwt-debugger')
    const [token, setToken] = useState(output?.input ?? '')
    const [secret, setSecret] = useState('')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const { header, payload, signatureB64 } = parseJwt(token)
            const exp = typeof payload.exp === 'number' ? payload.exp : null
            const expired = exp ? Date.now() > exp * 1000 : false

            const fields: OutputField[] = [
                { label: 'Algorithm', value: String(header.alg ?? 'unknown') },
                { label: 'Type', value: String(header.typ ?? 'JWT') },
                { label: 'Header', value: JSON.stringify(header, null, 2) },
                { label: 'Payload', value: JSON.stringify(payload, null, 2) },
                { label: 'Signature', value: signatureB64 },
                ...(exp ? [{ label: 'Expiry', value: `${new Date(exp * 1000).toLocaleString()} — ${expired ? '⚠ EXPIRED' : '✓ Still valid'}` }] : []),
                ...(secret ? [{ label: 'Signature Verification', value: 'Note: Browser HMAC verification requires the HS256 key. Provide secret above to verify.' }] : []),
            ]
            setOutput({ input: token, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setToken(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="jwt-debugger">
            <ToolInput value={token} onChange={setToken} onClear={clear} placeholder="Paste JWT token here…" minHeight="80px" />
            <ToolOptions>
                <div className="tool-option-group" style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <label>Secret (optional, for verification info)</label>
                    <Textarea value={secret} onChange={setSecret} placeholder="Enter secret key…" minHeight="50px" showCount={false} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Decode</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
