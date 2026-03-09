import { useState, useRef, useEffect } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { RefreshCw, Trash2 } from 'lucide-react'

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex)
    if (!result) return { r: 0, g: 0, b: 0 }
    const [r, g, b] = result.slice(1).map(c => parseInt(c.length === 1 ? c + c : c, 16))
    return { r, g, b }
}

function toHsl(r: number, g: number, b: number): string {
    const rr = r / 255, gg = g / 255, bb = b / 255
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
    const l = (max + min) / 2
    const d = max - min
    if (d === 0) return `hsl(0, 0%, ${Math.round(l * 100)}%)`
    const s = d / (1 - Math.abs(2 * l - 1))
    let h = 0
    switch (max) {
        case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6; break
        case gg: h = ((bb - rr) / d + 2) / 6; break
        case bb: h = ((rr - gg) / d + 4) / 6; break
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export default function ColorPicker() {
    const { output, setOutput, clearOutput } = useTool('color-picker')
    const [color, setColor] = useState('#3b82f6')

    const update = (hex: string) => {
        setColor(hex)
        const { r, g, b } = hexToRgb(hex)
        const fields: OutputField[] = [
            { label: 'HEX', value: hex.toUpperCase() },
            { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
            { label: 'HSL', value: toHsl(r, g, b) },
            { label: 'CSS Custom Property', value: `--color-brand: ${hex.toUpperCase()};` },
        ]
        setOutput({ input: hex, output: JSON.stringify(fields) })
    }

    const clear = () => { setColor('#3b82f6'); clearOutput() }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="color-picker">
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-4)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                <input
                    type="color"
                    value={color}
                    onChange={e => update(e.target.value)}
                    style={{ width: 80, height: 80, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius-lg)', padding: 2 }}
                    aria-label="Pick a color"
                />
                <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)', letterSpacing: '0.05em' }}>{color.toUpperCase()}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Click the swatch to open the color picker</div>
                </div>
                <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', background: color, border: '1px solid var(--color-border)', marginLeft: 'auto', flexShrink: 0 }} />
            </div>
            <div className="tool-actions">
                <Button variant="secondary" onClick={clear} icon={<Trash2 size={13} />}>Reset</Button>
            </div>
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
