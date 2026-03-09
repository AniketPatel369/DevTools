import { useState, useRef } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2, Upload, ImageIcon } from 'lucide-react'

type Variant = 'Standard' | 'URL-Safe'
type TabMode = 'Text' | 'Image'

// ---- Text helpers ----

function encodeBase64(text: string, variant: Variant, addPadding: boolean): string {
    const encoded = variant === 'URL-Safe'
        ? btoa(unescape(encodeURIComponent(text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
        : btoa(unescape(encodeURIComponent(text)))
    return addPadding && variant === 'URL-Safe'
        ? encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=')
        : encoded
}

function decodeBase64(text: string): string {
    try {
        const clean = text.replace(/-/g, '+').replace(/_/g, '/')
        return decodeURIComponent(escape(atob(clean)))
    } catch {
        throw new Error('Invalid Base64 string')
    }
}

// ---- Image tab ----

function ImageTab() {
    const [dataUri, setDataUri] = useState('')
    const [preview, setPreview] = useState('')
    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState('')
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) return
        setFileName(file.name)
        setFileSize(formatBytes(file.size))
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setDataUri(result)
            setPreview(result)
        }
        reader.readAsDataURL(file)
    }

    const formatBytes = (b: number) =>
        b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`

    const clear = () => { setDataUri(''); setPreview(''); setFileName(''); setFileSize('') }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Drop zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                    e.preventDefault(); setDragging(false)
                    const file = e.dataTransfer.files[0]
                    if (file) processFile(file)
                }}
                style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 'var(--space-2)', padding: 'var(--space-8)',
                    border: `2px dashed ${dragging ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                    background: dragging ? 'var(--color-bg-active-row)' : 'var(--color-bg-input)',
                    transition: 'border-color 0.15s, background 0.15s',
                }}
            >
                <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
                {preview ? (
                    <img src={preview} alt="preview"
                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 'var(--radius-md)', objectFit: 'contain' }} />
                ) : (
                    <>
                        <ImageIcon size={32} color="var(--color-text-faint)" strokeWidth={1.5} />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)' }}>
                            Drop an image or click to browse
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                            PNG, JPG, GIF, SVG, WebP…
                        </span>
                    </>
                )}
            </div>

            {/* File info + change/clear */}
            {preview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', flex: 1 }}>
                        <strong style={{ color: 'var(--color-text-primary)' }}>{fileName}</strong>
                        &nbsp;·&nbsp;{fileSize}
                    </span>
                    <Button variant="secondary" size="sm" icon={<Upload size={12} />}
                        onClick={() => inputRef.current?.click()}>Change</Button>
                    <Button variant="danger" size="sm" icon={<Trash2 size={12} />} onClick={clear}>Clear</Button>
                </div>
            )}

            {/* Output */}
            {dataUri && (
                <div className="tool-output-wrap">
                    <div className="tool-output-head">
                        <span className="tool-output-label">Base64 Data URI</span>
                        <CopyButton text={dataUri} />
                    </div>
                    <div className="tool-output-body">
                        <div className="tool-output-field">
                            <div className="tool-output-field-head">
                                <span className="tool-output-field-label">MIME type</span>
                            </div>
                            <pre className="tool-output-field-value">
                                {dataUri.split(';')[0].replace('data:', '')}
                            </pre>
                        </div>
                        <div className="tool-output-field">
                            <div className="tool-output-field-head">
                                <span className="tool-output-field-label">Raw Base64</span>
                                <CopyButton text={dataUri.split(',')[1] ?? ''} label="Copy raw" size="sm" />
                            </div>
                            <pre className="tool-output-field-value" style={{ maxHeight: 140, overflow: 'auto', wordBreak: 'break-all' }}>
                                {dataUri.split(',')[1]}
                            </pre>
                        </div>
                        <div className="tool-output-field">
                            <div className="tool-output-field-head">
                                <span className="tool-output-field-label">Full Data URI</span>
                            </div>
                            <pre className="tool-output-field-value" style={{ maxHeight: 80, overflow: 'auto', fontSize: 'var(--text-xs)', wordBreak: 'break-all' }}>
                                {dataUri}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ---- Main component ----

export default function Base64() {
    const { output, setOutput, clearOutput } = useTool('base64')
    const [tab, setTab] = useState<TabMode>('Text')
    const [input, setInput] = useState(output?.input ?? '')
    const [variant, setVariant] = useState<Variant>('Standard')
    const [addPadding, setAddPadding] = useState(true)
    const [mode, setMode] = useState<'Encode' | 'Decode'>('Encode')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const result = mode === 'Encode'
                ? encodeBase64(input, variant, addPadding)
                : decodeBase64(input)
            setOutput({ input, output: result })
        } catch (e) {
            setError((e as Error).message)
        }
    }

    const swap = () => {
        if (output?.output && typeof output.output === 'string') {
            setInput(output.output)
            clearOutput()
            setMode(m => m === 'Encode' ? 'Decode' : 'Encode')
        }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="base64">
            {/* Tab switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <Toggle options={['Text', 'Image']} value={tab} onChange={v => setTab(v as TabMode)} />
            </div>

            {tab === 'Text' ? (
                <>
                    <ToolInput value={input} onChange={setInput} onClear={clear}
                        placeholder="Enter text to encode or Base64 to decode…" />

                    <ToolOptions>
                        <div className="tool-option-group">
                            <label>Variant</label>
                            <Toggle options={['Standard', 'URL-Safe']} value={variant}
                                onChange={v => setVariant(v as Variant)} />
                        </div>
                        <label className="dt-checkbox">
                            <input type="checkbox" checked={addPadding}
                                onChange={e => setAddPadding(e.target.checked)} />
                            Add Padding
                        </label>
                    </ToolOptions>

                    <div className="tool-actions">
                        <Toggle options={['Encode', 'Decode']} value={mode}
                            onChange={v => setMode(v as 'Encode' | 'Decode')} />
                        <Button onClick={run} icon={<Play size={13} />}>{mode}</Button>
                        <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                        <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
                    </div>

                    {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}

                    <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
                </>
            ) : (
                <ImageTab />
            )}
        </ToolLayout>
    )
}
