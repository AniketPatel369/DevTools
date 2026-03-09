import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { GitCompare, Trash2 } from 'lucide-react'

type DiffMode = 'Side by Side' | 'Inline'

interface DiffLine { type: 'added' | 'removed' | 'same'; text: string; lineA?: number; lineB?: number }

function diffLines(a: string, b: string): DiffLine[] {
    const linesA = a.split('\n')
    const linesB = b.split('\n')
    const result: DiffLine[] = []
    const maxLen = Math.max(linesA.length, linesB.length)
    let ai = 0, bi = 0
    while (ai < linesA.length || bi < linesB.length) {
        const la = linesA[ai], lb = linesB[bi]
        if (ai >= linesA.length) { result.push({ type: 'added', text: lb, lineB: bi + 1 }); bi++ }
        else if (bi >= linesB.length) { result.push({ type: 'removed', text: la, lineA: ai + 1 }); ai++ }
        else if (la === lb) { result.push({ type: 'same', text: la, lineA: ai + 1, lineB: bi + 1 }); ai++; bi++ }
        else {
            result.push({ type: 'removed', text: la, lineA: ai + 1 })
            result.push({ type: 'added', text: lb, lineB: bi + 1 })
            ai++; bi++
        }
    }
    return result
}

export default function TextDiff() {
    const { clearOutput } = useTool('text-diff')
    const [textA, setTextA] = useState('')
    const [textB, setTextB] = useState('')
    const [mode, setMode] = useState<DiffMode>('Inline')
    const [diff, setDiff] = useState<DiffLine[]>([])
    const [compared, setCompared] = useState(false)

    const run = () => {
        setDiff(diffLines(textA, textB))
        setCompared(true)
    }

    const clear = () => { setTextA(''); setTextB(''); setDiff([]); setCompared(false); clearOutput() }

    const colorMap = { added: 'var(--color-encoding)', removed: 'var(--color-danger)', same: 'var(--color-text-secondary)' }
    const bgMap = { added: 'rgba(74,222,128,0.08)', removed: 'rgba(248,113,113,0.08)', same: 'transparent' }
    const prefixMap = { added: '+', removed: '-', same: ' ' }

    return (
        <ToolLayout toolId="text-diff">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <Textarea label="Text A (Original)" value={textA} onChange={setTextA} placeholder="Original text…" />
                <Textarea label="Text B (Modified)" value={textB} onChange={setTextB} placeholder="Modified text…" />
            </div>
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Mode</label>
                    <Toggle options={['Inline', 'Side by Side']} value={mode} onChange={v => setMode(v as DiffMode)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<GitCompare size={13} />}>Compare</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>

            {compared && (
                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--color-bg-card)', padding: '10px 16px', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-4)' }}>
                        <span style={{ color: 'var(--color-danger)' }}>− {diff.filter(d => d.type === 'removed').length} removed</span>
                        <span style={{ color: 'var(--color-encoding)' }}>+ {diff.filter(d => d.type === 'added').length} added</span>
                        <span>{diff.filter(d => d.type === 'same').length} unchanged</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', padding: 'var(--space-2) 0', maxHeight: 400, overflowY: 'auto' }}>
                        {diff.map((line, i) => (
                            <div key={i} style={{ display: 'flex', padding: '1px 16px', background: bgMap[line.type], color: colorMap[line.type] }}>
                                <span style={{ minWidth: 24, opacity: 0.5, userSelect: 'none' }}>{prefixMap[line.type]}</span>
                                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{line.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ToolLayout>
    )
}
