import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { randomBytes } from '@/utils/crypto'

type UuidVersion = 'v4' | 'v1-simulated' | 'ULID'

function generateV4(): string {
    return crypto.randomUUID()
}

function generateUlid(): string {
    // Simple ULID-like (timestamp + random) — no npm lib
    const ts = Date.now().toString(36).toUpperCase().padStart(10, '0')
    const rand = randomBytes(10).toUpperCase().slice(0, 16)
    return `${ts}${rand}`
}

function generate(version: string): string {
    if (version === 'ULID') return generateUlid()
    return generateV4() // v1 and v4 both use crypto.randomUUID in browser context
}

const VERSIONS = ['v4', 'ULID']

export default function UuidGenerator() {
    const { output, setOutput, clearOutput } = useTool('uuid-generator')
    const [version, setVersion] = useState('v4')
    const [count, setCount] = useState(1)
    const [uppercase, setUppercase] = useState(false)

    const run = () => {
        const ids = Array.from({ length: count }, () => {
            const id = generate(version)
            return uppercase ? id.toUpperCase() : id.toLowerCase()
        })
        const fields: OutputField[] = ids.map((id, i) => ({
            label: count > 1 ? `${version.toUpperCase()} #${i + 1}` : version.toUpperCase(),
            value: id,
        }))
        setOutput({ input: version, output: JSON.stringify(fields) })
    }

    const clear = () => clearOutput()

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="uuid-generator">
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Version</label>
                    <Dropdown options={VERSIONS} value={version} onChange={setVersion} />
                </div>
                <Spinner label="Count" value={count} onChange={setCount} min={1} max={100} />
                <label className="dt-checkbox">
                    <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} />
                    Uppercase
                </label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Generate</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
