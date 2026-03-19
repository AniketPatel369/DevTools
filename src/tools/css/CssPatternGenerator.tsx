import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

// Define the logic for pure CSS patterns
type PatternParams = {
    scale: number
    color1: string
    color2: string
}

function getPatternCSS(pattern: string, { scale, color1, color2 }: PatternParams): string {
    const s = scale
    const half = scale / 2

    switch (pattern) {
        case 'Neon Grid':
            return `
background-color: ${color1};
background-image: 
    linear-gradient(${color2} 2px, transparent 2px),
    linear-gradient(90deg, ${color2} 2px, transparent 2px),
    linear-gradient(${color2} 1px, transparent 1px),
    linear-gradient(90deg, ${color2} 1px, transparent 1px);
background-size: ${s}px ${s}px, ${s}px ${s}px, ${s / 5}px ${s / 5}px, ${s / 5}px ${s / 5}px;
background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
box-shadow: inset 0 0 ${s}px rgba(0,0,0,0.5);`.trim()

        case 'Hacker Matrix':
            return `
background-color: ${color1};
background-image: repeating-linear-gradient(
    0deg,
    ${color1},
    ${color1} ${s - 2}px,
    ${color2} ${s}px
);
opacity: 0.9;`.trim()

        case 'Polka Dots':
            return `
background-color: ${color1};
background-image: 
    radial-gradient(${color2} ${s * 0.15}px, transparent ${s * 0.15}px),
    radial-gradient(${color2} ${s * 0.15}px, transparent ${s * 0.15}px);
background-size: ${s}px ${s}px;
background-position: 0 0, ${half}px ${half}px;`.trim()

        case 'Chevron':
            return `
background-color: ${color1};
background-image: 
    linear-gradient(135deg, ${color2} 25%, transparent 25%),
    linear-gradient(225deg, ${color2} 25%, transparent 25%),
    linear-gradient(45deg, ${color2} 25%, transparent 25%),
    linear-gradient(315deg, ${color2} 25%, transparent 25%);
background-position:  ${half}px 0, ${half}px 0, 0 0, 0 0;
background-size: ${s}px ${s}px;`.trim()

        case 'Diagonal Stripes':
            return `
background-color: ${color1};
background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent ${half}px,
    ${color2} ${half}px,
    ${color2} ${s}px
);`.trim()

        case 'Checkered':
            return `
background-color: ${color1};
background-image: 
    linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2}),
    linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2});
background-size: ${s}px ${s}px;
background-position: 0 0, ${half}px ${half}px;`.trim()

        default:
            return `background-color: ${color1};`
    }
}

export default function CssPatternGenerator() {
    const [pattern, setPattern] = useState('Neon Grid')
    const [scale, setScale] = useState(50)
    const [color1, setColor1] = useState('#0f0f13')
    const [color2, setColor2] = useState('#0055ff')

    const cssCode = useMemo(() => {
        return getPatternCSS(pattern, { scale, color1, color2 })
    }, [pattern, scale, color1, color2])

    const formattedCode = `/* ${pattern} */\n.pattern-bg {\n${cssCode.split('\\n').map(line => '    ' + line).join('\\n')}\n}`

    const handleClear = () => {
        setPattern('Neon Grid')
        setScale(50)
        setColor1('#0f0f13')
        setColor2('#0055ff')
    }

    return (
        <ToolLayout toolId="css-pattern-generator">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>

                {/* Configuration Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="tool-option-group">
                        <label>Pattern Style</label>
                        <select
                            className="dt-input"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                        >
                            <option value="Neon Grid">Neon Grid (Cyberpunk)</option>
                            <option value="Hacker Matrix">Hacker Matrix</option>
                            <option value="Polka Dots">Polka Dots</option>
                            <option value="Chevron">Chevron Weave</option>
                            <option value="Diagonal Stripes">Diagonal Stripes</option>
                            <option value="Checkered">Checkered</option>
                        </select>
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Pattern Scale (px)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{scale}</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <div className="tool-option-group">
                            <label>Background</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="color"
                                    value={color1}
                                    onChange={(e) => setColor1(e.target.value)}
                                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', background: 'none' }}
                                />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                    {color1.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="tool-option-group">
                            <label>Pattern</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="color"
                                    value={color2}
                                    onChange={(e) => setColor2(e.target.value)}
                                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', background: 'none' }}
                                />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                    {color2.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                    {/* Visual Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="tool-output-label">Live Preview</span>
                            <Button variant="danger" size="sm" onClick={handleClear} icon={<Trash2 size={13} />}>Clear</Button>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                height: '240px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: `<style>
                                        .css-pattern-preview-box {
                                            width: 100%;
                                            height: 100%;
                                            ${cssCode}
                                        }
                                    </style>
                                    <div class="css-pattern-preview-box"></div>`
                                }}
                            />
                        </div>
                    </div>

                    <ToolOutput fields={[{ label: 'Generated CSS', value: formattedCode }]} />
                </div>
            </div>
        </ToolLayout>
    )
}
