import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { format as formatSql } from 'sql-formatter'

type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql' | 'bigquery'
const DIALECTS: SqlDialect[] = ['sql', 'mysql', 'postgresql', 'sqlite', 'tsql', 'bigquery']

export default function SqlFormatter() {
    const { output, setOutput, clearOutput } = useTool('sql-formatter')
    const [input, setInput] = useState(output?.input ?? '')
    const [dialect, setDialect] = useState<SqlDialect>('sql')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try { setOutput({ input, output: formatSql(input, { language: dialect, tabWidth: 2 }) }) } catch (e) { setError((e as Error).message) }
    }
    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="sql-formatter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste SQL query here…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Dialect</label>
                    <Dropdown options={DIALECTS} value={dialect} onChange={v => setDialect(v as SqlDialect)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Format SQL</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: 'Formatted SQL', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
