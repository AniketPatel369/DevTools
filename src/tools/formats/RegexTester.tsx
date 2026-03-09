import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

type RegexFlag = 'g' | 'i' | 'm' | 's'

export default function RegexTester() {
    const { clearOutput } = useTool('regex-tester')
    const [pattern, setPattern] = useState('')
    const [text, setText] = useState('')
    const [flags, setFlags] = useState<Set<RegexFlag>>(new Set(['g', 'i']))
    const [result, setResult] = useState<{ fields: OutputField[]; highlights: string } | null>(null)
    const [error, setError] = useState('')

    const toggleFlag = (f: RegexFlag) => {
        setFlags(prev => {
            const next = new Set(prev)
            next.has(f) ? next.delete(f) : next.add(f)
            return next
        })
    }

    const run = () => {
        setError('')
        try {
            const re = new RegExp(pattern, [...flags].join(''))
            const matches = [...text.matchAll(new RegExp(pattern, 'g' + [...flags].filter(f => f !== 'g').join('')))]
            const fields: OutputField[] = [
                { label: 'Matches Found', value: String(matches.length) },
                { label: 'Groups', value: matches.length > 0 && matches[0].groups ? JSON.stringify(matches[0].groups, null, 2) : 'No named groups' },
                { label: 'All Matches', value: JSON.stringify(matches.map(m => ({ match: m[0], index: m.index, groups: m.groups })), null, 2) },
            ]
            setResult({ fields, highlights: '' })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setPattern(''); setText(''); setResult(null); setError(''); clearOutput() }

    const flagList: { flag: RegexFlag; label: string }[] = [
        { flag: 'g', label: 'Global (g)' },
        { flag: 'i', label: 'Ignore Case (i)' },
        { flag: 'm', label: 'Multiline (m)' },
        { flag: 's', label: 'Dot All (s)' },
    ]

    return (
        <ToolLayout toolId="regex-tester">
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '8px 14px' }}>
                <span style={{ color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)' }}>/</span>
                <input
                    style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--color-encoding)', background: 'transparent' }}
                    value={pattern} onChange={e => setPattern(e.target.value)} placeholder="pattern" spellCheck={false}
                />
                <span style={{ color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)' }}>/{[...flags].join('')}</span>
            </div>
            <Textarea label="Test String" value={text} onChange={setText} placeholder="Paste text to test against…" />
            <ToolOptions>
                {flagList.map(({ flag, label }) => (
                    <label key={flag} className="dt-checkbox">
                        <input type="checkbox" checked={flags.has(flag)} onChange={() => toggleFlag(flag)} />
                        {label}
                    </label>
                ))}
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Test</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>{error}</div>}
            {result && <ToolOutput fields={result.fields} />}
        </ToolLayout>
    )
}
