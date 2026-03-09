import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { RefreshCw, Trash2 } from 'lucide-react'

type Perm = { read: boolean; write: boolean; execute: boolean }
const defaultPerm = (): Perm => ({ read: false, write: false, execute: false })

function toOctal(p: Perm): number {
    return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)
}

function toSymbolic(p: Perm): string {
    return `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`
}

export default function UnixPermissions() {
    const { output, setOutput, clearOutput } = useTool('unix-permissions')
    const [owner, setOwner] = useState<Perm>(defaultPerm())
    const [group, setGroup] = useState<Perm>(defaultPerm())
    const [other, setOther] = useState<Perm>(defaultPerm())

    const calculate = () => {
        const oo = toOctal(owner), og = toOctal(group), op = toOctal(other)
        const symbolic = `${toSymbolic(owner)}${toSymbolic(group)}${toSymbolic(other)}`
        const octal = `0${oo}${og}${op}`
        const fields: OutputField[] = [
            { label: 'Octal', value: octal },
            { label: 'Symbolic', value: symbolic },
            { label: 'chmod Command', value: `chmod ${oo}${og}${op} filename` },
        ]
        setOutput({ input: octal, output: JSON.stringify(fields) })
    }

    const reset = () => {
        setOwner(defaultPerm()); setGroup(defaultPerm()); setOther(defaultPerm())
        clearOutput()
    }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    const PermRow = ({ label, perm, setPerm }: { label: string; perm: Perm; setPerm: (p: Perm) => void }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
            <span style={{ width: 60, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>{label}</span>
            {(['read', 'write', 'execute'] as const).map(bit => (
                <label key={bit} className="dt-checkbox">
                    <input type="checkbox" checked={perm[bit]} onChange={e => setPerm({ ...perm, [bit]: e.target.checked })} />
                    {bit.charAt(0).toUpperCase() + bit.slice(1)}
                </label>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                {toSymbolic(perm)} ({toOctal(perm)})
            </span>
        </div>
    )

    return (
        <ToolLayout toolId="unix-permissions">
            <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                <PermRow label="Owner" perm={owner} setPerm={setOwner} />
                <PermRow label="Group" perm={group} setPerm={setGroup} />
                <PermRow label="Other" perm={other} setPerm={setOther} />
            </div>
            <div className="tool-actions">
                <Button onClick={calculate} icon={<RefreshCw size={13} />}>Calculate</Button>
                <Button variant="danger" onClick={reset} icon={<Trash2 size={13} />}>Reset</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
