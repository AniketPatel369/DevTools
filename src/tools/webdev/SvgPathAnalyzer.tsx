import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

function parseSvgPath(d: string): OutputField[] {
    const commands: Array<{ cmd: string; args: number[]; description: string }> = []
    const re = /([MLHVCSQTAZmlhvcsqtaz])([\d\s,.-]*)/g
    let m: RegExpExecArray | null
    while ((m = re.exec(d)) !== null) {
        const cmd = m[1]
        const args = m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number)
        commands.push({ cmd, args, description: cmdDescription(cmd, args) })
    }
    return [
        { label: 'Total Commands', value: String(commands.length) },
        { label: 'Command Breakdown', value: commands.map(c => `${c.cmd}  →  ${c.description}`).join('\n') },
        { label: 'Normalized', value: commands.map(c => `${c.cmd}${c.args.join(' ')}`).join(' ') },
    ]
}

const CMD_NAMES: Record<string, string> = {
    M: 'MoveTo', L: 'LineTo', H: 'HorizontalLine', V: 'VerticalLine',
    C: 'CubicBézier', S: 'SmoothCubicBézier', Q: 'QuadraticBézier', T: 'SmoothQuadraticBézier',
    A: 'EllipticalArc', Z: 'ClosePath',
}

function cmdDescription(cmd: string, args: number[]): string {
    const name = CMD_NAMES[cmd.toUpperCase()] ?? cmd
    const relative = cmd === cmd.toLowerCase() && cmd !== 'z' && cmd !== 'Z' ? ' (relative)' : ''
    return `${name}${relative} [${args.join(', ')}]`
}

export default function SvgPathAnalyzer() {
    const { output, setOutput, clearOutput } = useTool('svg-path-analyzer')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const d = input.trim()
            if (!d) throw new Error('Enter an SVG path d attribute value')
            const fields = parseSvgPath(d)
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="svg-path-analyzer">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder='M 0 0 L 100 100 Q 150 50 200 100 Z' />
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Analyze Path</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
