import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

type ColorFormat = 'hex' | 'rgb' | 'hsl'

function parseColor(input: string): { r: number; g: number; b: number } | null {
    const s = input.trim()
    // HEX
    const hex = s.match(/^#?([0-9a-f]{3,8})$/i)
    if (hex) {
        let h = hex[1]
        if (h.length === 3) h = h.split('').map(c => c + c).join('')
        return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
    }
    // RGB/RGBA
    const rgb = s.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/)
    if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] }
    // HSL
    const hsl = s.match(/hsla?\((\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)%?[,\s]+(\d+(?:\.\d+)?)%?/)
    if (hsl) {
        const [h2, s2, l2] = [+hsl[1] / 360, +hsl[2] / 100, +hsl[3] / 100]
        if (s2 === 0) {
            const val = Math.round(l2 * 255)
            return { r: val, g: val, b: val }
        }
        const q2 = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2
        const p2 = 2 * l2 - q2
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1; if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        return {
            r: Math.round(hue2rgb(p2, q2, h2 + 1 / 3) * 255),
            g: Math.round(hue2rgb(p2, q2, h2) * 255),
            b: Math.round(hue2rgb(p2, q2, h2 - 1 / 3) * 255),
        }
    }
    return null
}

function toHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0').toUpperCase()).join('')}`
}

function toHsl(r: number, g: number, b: number): string {
    const rr = r / 255, gg = g / 255, bb = b / 255
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
    const l = (max + min) / 2
    const d = max - min
    let h = 0, s = 0
    if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1))
        switch (max) {
            case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6; break
            case gg: h = ((bb - rr) / d + 2) / 6; break
            case bb: h = ((rr - gg) / d + 4) / 6; break
        }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export default function ColorConverter() {
    const { output, setOutput, clearOutput } = useTool('color-converter')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        const rgb = parseColor(input)
        if (!rgb) { setError('Invalid color format. Try: #ff6600, rgb(255, 102, 0), or hsl(24, 100%, 50%)'); return }
        const { r, g, b } = rgb
        const hex = toHex(r, g, b)
        const hsl = toHsl(r, g, b)
        const fields: OutputField[] = [
            { label: 'HEX', value: hex },
            { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
            { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, 1)` },
            { label: 'HSL', value: hsl },
            { label: 'Preview', value: hex },
        ]
        setOutput({ input, output: JSON.stringify(fields) })
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    const previewColor = fields.find(f => f.label === 'Preview')?.value
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }
    const displayFields = fields.filter(f => f.label !== 'Preview')
    const previewColorFinal = fields.find(f => f.label === 'Preview')?.value

    return (
        <ToolLayout toolId="color-converter">
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="#ff6600 or rgb(255, 102, 0) or hsl(24, 100%, 50%)" minHeight="50px" />
                {previewColorFinal && (
                    <div style={{ width: 64, height: 50, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: previewColorFinal, flexShrink: 0, marginTop: 24 }} title={previewColorFinal} />
                )}
            </div>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Convert</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={displayFields} />
        </ToolLayout>
    )
}
