import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

export default function TransformVisualizer() {
    // 3D Matrix states
    const [perspective, setPerspective] = useState(800)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)
    const [rotateZ, setRotateZ] = useState(0)
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)
    const [translateZ, setTranslateZ] = useState(0)
    const [scale, setScale] = useState(1)

    const transformString = [
        perspective < 2000 ? `perspective(${perspective}px)` : '',
        rotateX !== 0 ? `rotateX(${rotateX}deg)` : '',
        rotateY !== 0 ? `rotateY(${rotateY}deg)` : '',
        rotateZ !== 0 ? `rotateZ(${rotateZ}deg)` : '',
        translateX !== 0 ? `translateX(${translateX}px)` : '',
        translateY !== 0 ? `translateY(${translateY}px)` : '',
        translateZ !== 0 ? `translateZ(${translateZ}px)` : '',
        scale !== 1 ? `scale(${scale})` : ''
    ].filter(Boolean).join(' ') || 'none'

    const cssCode = `.transform-box {
    transform: ${transformString};
    transform-style: preserve-3d;
}`

    const handleClear = () => {
        setPerspective(800)
        setRotateX(0)
        setRotateY(0)
        setRotateZ(0)
        setTranslateX(0)
        setTranslateY(0)
        setTranslateZ(0)
        setScale(1)
    }

    return (
        <ToolLayout toolId="transform-visualizer">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>

                {/* Configuration Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                    {/* Perspective */}
                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Perspective (px)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{perspective === 2000 ? 'None' : perspective}</span>
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="2000"
                            step="10"
                            value={perspective}
                            onChange={(e) => setPerspective(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div style={{ borderBottom: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />

                    {/* Rotations */}
                    {[
                        { label: 'Rotate X (deg)', value: rotateX, set: setRotateX, min: -180, max: 180, step: 1 },
                        { label: 'Rotate Y (deg)', value: rotateY, set: setRotateY, min: -180, max: 180, step: 1 },
                        { label: 'Rotate Z (deg)', value: rotateZ, set: setRotateZ, min: -180, max: 180, step: 1 },
                    ].map((t) => (
                        <div key={t.label} className="tool-option-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.label}</span>
                                <span style={{ color: 'var(--color-primary)' }}>{t.value}°</span>
                            </label>
                            <input
                                type="range"
                                min={t.min}
                                max={t.max}
                                step={t.step}
                                value={t.value}
                                onChange={(e) => t.set(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                        </div>
                    ))}

                    <div style={{ borderBottom: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />

                    {/* Translations */}
                    {[
                        { label: 'Translate X (px)', value: translateX, set: setTranslateX, min: -150, max: 150, step: 1 },
                        { label: 'Translate Y (px)', value: translateY, set: setTranslateY, min: -150, max: 150, step: 1 },
                        { label: 'Translate Z (px)', value: translateZ, set: setTranslateZ, min: -150, max: 150, step: 1 },
                    ].map((t) => (
                        <div key={t.label} className="tool-option-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.label}</span>
                                <span style={{ color: 'var(--color-primary)' }}>{t.value}px</span>
                            </label>
                            <input
                                type="range"
                                min={t.min}
                                max={t.max}
                                step={t.step}
                                value={t.value}
                                onChange={(e) => t.set(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                        </div>
                    ))}

                    <div style={{ borderBottom: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />

                    {/* Scale */}
                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Scale</span>
                            <span style={{ color: 'var(--color-primary)' }}>{scale.toFixed(2)}x</span>
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
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
                            <Button variant="danger" size="sm" onClick={handleClear} icon={<Trash2 size={13} />}>Reset Transforms</Button>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                height: '400px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'var(--color-bg-panel)'
                            }}
                        >
                            <div
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    backgroundColor: 'rgba(0, 112, 243, 0.85)',
                                    backgroundImage: 'linear-gradient(45deg, rgba(0, 112, 243, 0.85) 0%, rgba(51, 155, 255, 0.85) 100%)',
                                    color: 'white',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    boxShadow: '0 20px 40px rgba(0, 112, 243, 0.3)',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    transform: transformString,
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.1s linear'
                                }}
                            >
                                <span style={{ transform: 'translateZ(20px)' }}>DevTools</span>
                                <span style={{ transform: 'translateZ(10px)', fontSize: '0.8rem', fontWeight: 400, opacity: 0.8, marginTop: '8px' }}>3D CSS</span>
                            </div>
                        </div>
                    </div>

                    <ToolOutput fields={[{ label: 'Generated CSS', value: cssCode }]} />
                </div>
            </div>
        </ToolLayout>
    )
}
