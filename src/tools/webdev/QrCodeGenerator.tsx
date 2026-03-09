import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import QRCode from 'qrcode'

type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

export default function QrCodeGenerator() {
    const { output, setOutput, clearOutput } = useTool('qr-code-generator')
    const [input, setInput] = useState(output?.input ?? '')
    const [size, setSize] = useState(256)
    const [errorLevel, setErrorLevel] = useState<ErrorLevel>('M')
    const [dataUrl, setDataUrl] = useState<string | null>(null)
    const [error, setError] = useState('')

    const generate = async () => {
        setError('')
        if (!input.trim()) return
        try {
            const url = await QRCode.toDataURL(input, { width: size, errorCorrectionLevel: errorLevel, margin: 2 })
            setDataUrl(url)
            setOutput({ input, output: url })
        } catch (e) { setError((e as Error).message) }
    }

    const download = () => {
        if (!dataUrl) return
        const a = document.createElement('a')
        a.href = dataUrl; a.download = 'qrcode.png'; a.click()
    }

    const clear = () => { setInput(''); setDataUrl(null); clearOutput(); setError('') }

    const storedUrl = typeof output?.output === 'string' && output.output.startsWith('data:') ? output.output : null
    const displayUrl = dataUrl ?? storedUrl

    return (
        <ToolLayout toolId="qr-code-generator">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Enter URL, text or any data…" minHeight="70px" />
            <ToolOptions>
                <Spinner label="Size (px)" value={size} onChange={setSize} min={64} max={1024} step={64} />
                <div className="tool-option-group">
                    <label>Error Correction</label>
                    <select className="dt-dropdown" value={errorLevel} onChange={e => setErrorLevel(e.target.value as ErrorLevel)}>
                        <option value="L">Low (L) — 7%</option>
                        <option value="M">Medium (M) — 15%</option>
                        <option value="Q">Quartile (Q) — 25%</option>
                        <option value="H">High (H) — 30%</option>
                    </select>
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={generate} icon={<Play size={13} />}>Generate QR</Button>
                {displayUrl && <Button variant="secondary" onClick={download}>Download PNG</Button>}
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            {displayUrl && (
                <div style={{ background: '#fff', display: 'inline-flex', padding: 16, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                    <img src={displayUrl} alt="QR Code" style={{ display: 'block', maxWidth: 256 }} />
                </div>
            )}
        </ToolLayout>
    )
}
