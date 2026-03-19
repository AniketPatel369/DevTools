import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { GitCompare, Trash2, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DiffLine {
    type: 'added' | 'removed' | 'same'
    text: string
    lineA?: number
    lineB?: number
}

interface DiffViewerProps {
    toolId: string
    titleA?: string
    titleB?: string
    onFormat?: (val: string) => string
}

export function DiffViewer({ toolId, titleA = 'Original', titleB = 'Modified', onFormat }: DiffViewerProps) {
    const [textA, setTextA] = useState('')
    const [textB, setTextB] = useState('')
    const [mode, setMode] = useState<'Inline' | 'Side by Side'>('Inline')
    const [formatFirst, setFormatFirst] = useState(true)
    const [results, setResults] = useState<{ diff: DiffLine[]; stats: { added: number; removed: number } } | null>(null)
    const [error, setError] = useState('')

    const diffLines = (a: string, b: string): DiffLine[] => {
        const linesA = a.split('\n')
        const linesB = b.split('\n')
        const result: DiffLine[] = []
        
        let ai = 0, bi = 0
        while (ai < linesA.length || bi < linesB.length) {
            const la = linesA[ai], lb = linesB[bi]
            if (ai >= linesA.length) { 
                result.push({ type: 'added', text: lb, lineB: bi + 1 }); bi++ 
            } else if (bi >= linesB.length) { 
                result.push({ type: 'removed', text: la, lineA: ai + 1 }); ai++ 
            } else if (la === lb) { 
                result.push({ type: 'same', text: la, lineA: ai + 1, lineB: bi + 1 }); ai++; bi++ 
            } else {
                result.push({ type: 'removed', text: la, lineA: ai + 1 }); ai++
                result.push({ type: 'added', text: lb, lineB: bi + 1 }); bi++
            }
        }
        return result
    }

    const run = () => {
        setError('')
        let a = textA
        let b = textB
        if (formatFirst && onFormat) {
            try {
                a = onFormat(textA)
                b = onFormat(textB)
            } catch (e) {
                setError(`Format error: ${(e as Error).message}`)
                return
            }
        }
        const diff = diffLines(a, b)
        const adds = diff.filter(d => d.type === 'added').length
        const rems = diff.filter(d => d.type === 'removed').length
        setResults({ diff, stats: { added: adds, removed: rems } })
    }

    const clear = () => {
        setTextA('')
        setTextB('')
        setResults(null)
        setError('')
    }

    return (
        <ToolLayout toolId={toolId}>
            <div className="diff-inputs">
                <Textarea
                    label={titleA}
                    value={textA}
                    onChange={setTextA}
                    placeholder={`Paste input A here...`}
                    minHeight="160px"
                />
                <Textarea
                    label={titleB}
                    value={textB}
                    onChange={setTextB}
                    placeholder={`Paste input B here...`}
                    minHeight="160px"
                />
            </div>

            <ToolOptions>
                <div className="tool-option-group">
                    <label>View Mode</label>
                    <Toggle options={['Inline', 'Side by Side']} value={mode} onChange={v => setMode(v as any)} />
                </div>
                {onFormat && (
                    <label className="dt-checkbox">
                        <input type="checkbox" checked={formatFirst} onChange={e => setFormatFirst(e.target.checked)} />
                        Auto-Format first
                    </label>
                )}
            </ToolOptions>

            <div className="tool-actions">
                <Button onClick={run} icon={<GitCompare size={14} />}>Compare</Button>
                <Button variant="secondary" onClick={() => { setTextA(textB); setTextB(textA); run(); }} icon={<RefreshCw size={14} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={14} />}>Clear</Button>
            </div>

            {error && <div className="diff-error">{error}</div>}

            {results && !error && (
                <div className="diff-results-container">
                    <div className="diff-summary">
                        <span className="diff-stat-removed">− {results.stats.removed} removed</span>
                        <span className="diff-stat-added">+ {results.stats.added} added</span>
                        <span className="diff-stat-unchanged">{results.diff.filter(d => d.type === 'same').length} unchanged lines</span>
                    </div>

                    <div className={cn('diff-viewer-grid', mode === 'Side by Side' && 'side-by-side')}>
                        <div className="diff-scroll-area">
                            {results.diff.map((line, i) => (
                                <div key={i} className={cn('diff-line', line.type)}>
                                    <div className="diff-line-number">
                                        {line.lineA || ''} {line.lineB ? '/' : ''} {line.lineB || ''}
                                    </div>
                                    <div className="diff-line-prefix">
                                        {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ''}
                                    </div>
                                    <div className="diff-line-content">{line.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                .diff-inputs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                }
                .diff-results-container {
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    background: var(--color-bg-panel);
                    overflow: hidden;
                    margin-top: var(--space-4);
                }
                .diff-summary {
                    display: flex;
                    gap: var(--space-6);
                    padding: 10px 16px;
                    background: var(--color-bg-card);
                    border-bottom: 1px solid var(--color-border);
                    font-size: var(--text-sm);
                }
                .diff-stat-removed { color: #f87171; font-weight: 600; }
                .diff-stat-added { color: #10b981; font-weight: 600; }
                .diff-error { color: #f87171; font-size: 13px; margin-top: 10px; font-family: var(--font-mono); }
                
                .diff-scroll-area {
                    max-height: 500px;
                    overflow: auto;
                    background: var(--color-bg-input);
                    font-family: var(--font-mono);
                    font-size: 13px;
                    line-height: 1.5;
                }
                .diff-line { display: flex; min-width: fit-content; }
                .diff-line.same { color: var(--color-text-secondary); }
                .diff-line.removed { background: rgba(248, 113, 113, 0.12); color: #f87171; }
                .diff-line.added { background: rgba(16, 185, 129, 0.12); color: #10b981; }
                
                .diff-line-number {
                    width: 80px;
                    padding: 0 10px;
                    text-align: right;
                    color: var(--color-text-faint);
                    border-right: 1px solid var(--color-border-subtle);
                    flex-shrink: 0;
                    font-size: 11px;
                }
                .diff-line-prefix { width: 22px; text-align: center; flex-shrink: 0; font-weight: bold; }
                .diff-line-content { white-space: pre; padding-left: 4px; }
            `}</style>
        </ToolLayout>
    )
}
