import { useEffect, useRef, useState } from 'react'
import { Copy, Maximize2, Minimize2, X } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'
import { useCharCount } from '@/hooks/useCharCount'

export interface OutputField {
    label: string
    value: string
}

interface ToolOutputProps {
    fields: OutputField[]
    loading?: boolean
}

function OutputFields({ fields, accented }: { fields: OutputField[], accented: boolean }) {
    return (
        <>
            {fields.map(({ label, value }) =>
                value ? (
                    <div key={label} className={`tool-output-field${accented ? ' tool-output-field--accented' : ''}`}>
                        <div className="tool-output-field-head">
                            <span className="tool-output-field-label">{label}</span>
                            <button
                                className="tool-output-field-copy"
                                onClick={() => navigator.clipboard.writeText(value)}
                                aria-label={`Copy ${label}`}
                                title={`Copy ${label}`}
                                type="button"
                            >
                                <Copy size={13} />
                            </button>
                        </div>
                        <pre className="tool-output-field-value">{value}</pre>
                    </div>
                ) : null
            )}
        </>
    )
}

export function ToolOutput({ fields, loading }: ToolOutputProps) {
    const fullText = fields.map(f => `${f.label}:\n${f.value}`).join('\n\n')
    const { chars } = useCharCount(fullText)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Close on Escape key
    useEffect(() => {
        if (!isFullscreen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFullscreen(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isFullscreen])

    if (loading) {
        return (
            <div className="tool-output-wrap">
                <div className="tool-output-head">
                    <span className="tool-output-label">Output</span>
                </div>
                <div className="tool-output-loading">Computing…</div>
            </div>
        )
    }

    const hasOutput = fields.some(f => f.value)
    if (!hasOutput) return null

    // Show left-accent border only when there are multiple populated fields
    const filledCount = fields.filter(f => f.value).length
    const accented = filledCount > 1

    const headerRight = (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {chars > 0 && <span className="dt-char-count">{chars.toLocaleString()} chars</span>}
            <CopyButton text={fullText} label="Copy" />
            <button
                className="tool-output-expand-btn"
                onClick={() => setIsFullscreen(v => !v)}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                type="button"
            >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
        </div>
    )

    return (
        <>
            {/* Normal inline output */}
            <div className="tool-output-wrap">
                <div className="tool-output-head">
                    <span className="tool-output-label">Output</span>
                    {headerRight}
                </div>
                <div className="tool-output-body">
                    <OutputFields fields={fields} accented={accented} />
                </div>
            </div>

            {/* Fullscreen overlay */}
            {isFullscreen && (
                <div
                    className="tool-output-fullscreen-overlay"
                    ref={overlayRef}
                    onClick={e => { if (e.target === overlayRef.current) setIsFullscreen(false) }}
                >
                    <div className="tool-output-fullscreen-panel">
                        <div className="tool-output-fullscreen-head">
                            <span className="tool-output-label">
                                Output
                                <span className="tool-output-fullscreen-badge">Fullscreen</span>
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                {chars > 0 && <span className="dt-char-count">{chars.toLocaleString()} chars</span>}
                                <CopyButton text={fullText} label="Copy" />
                                <div className="tool-output-fullscreen-divider" />
                                <button
                                    className="tool-output-expand-btn"
                                    onClick={() => setIsFullscreen(false)}
                                    title="Exit fullscreen"
                                    aria-label="Exit fullscreen"
                                    type="button"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="tool-output-fullscreen-body">
                            <OutputFields fields={fields} accented={accented} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
