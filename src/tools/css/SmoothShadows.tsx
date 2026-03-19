import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

function generateLayeredShadow(
    layers: number,
    finalAlpha: number,
    finalY: number,
    finalBlur: number
) {
    const shadowList = []

    for (let i = 1; i <= layers; i++) {
        const fraction = i / layers
        const y = Math.round(Math.pow(fraction, 2.5) * finalY)
        const blur = Math.round(Math.pow(fraction, 2.5) * finalBlur)
        const alpha = (fraction * finalAlpha).toFixed(3)

        shadowList.push(`0px ${y}px ${blur}px rgba(0, 0, 0, ${alpha})`)
    }

    return shadowList
}

export default function SmoothShadows() {
    const [layers, setLayers] = useState(6)
    const [finalAlpha, setFinalAlpha] = useState(0.07)
    const [finalY, setFinalY] = useState(100)
    const [finalBlur, setFinalBlur] = useState(80)

    const shadowsArray = useMemo(() => {
        return generateLayeredShadow(layers, finalAlpha, finalY, finalBlur)
    }, [layers, finalAlpha, finalY, finalBlur])

    const shadowValueForCss = shadowsArray.join(',\n    ')
    const shadowValueForPreview = shadowsArray.join(', ')

    const cssCode = `.smooth-shadow {
    box-shadow: 
        ${shadowValueForCss};
}`

    const handleClear = () => {
        setLayers(6)
        setFinalAlpha(0.07)
        setFinalY(100)
        setFinalBlur(80)
    }

    return (
        <ToolLayout toolId="smooth-shadows">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>

                {/* Configuration Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Number of Layers</span>
                            <span style={{ color: 'var(--color-primary)' }}>{layers}</span>
                        </label>
                        <input
                            type="range"
                            min="2"
                            max="10"
                            step="1"
                            value={layers}
                            onChange={(e) => setLayers(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Final Alpha (Opacity)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{finalAlpha.toFixed(2)}</span>
                        </label>
                        <input
                            type="range"
                            min="0.01"
                            max="0.5"
                            step="0.01"
                            value={finalAlpha}
                            onChange={(e) => setFinalAlpha(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Final Distance Y (px)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{finalY}px</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            step="1"
                            value={finalY}
                            onChange={(e) => setFinalY(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Final Blur (px)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{finalBlur}px</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            step="1"
                            value={finalBlur}
                            onChange={(e) => setFinalBlur(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
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
                                height: '340px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f7fa' // Explicit light background to show shadows
                            }}
                        >
                            <div
                                style={{
                                    width: '180px',
                                    height: '180px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#445566',
                                    fontWeight: 600,
                                    fontFamily: 'var(--font-heading)',
                                    boxShadow: shadowValueForPreview
                                }}
                            >
                                Smooth Depth
                            </div>
                        </div>
                    </div>

                    <ToolOutput fields={[{ label: 'Generated CSS', value: cssCode }]} />
                </div>
            </div>
        </ToolLayout>
    )
}
