import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

// Convert hex to rgb string 'r, g, b' for rgba() usage
function hexToRgbTuple(hex: string): string {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
}

export default function Glassmorphism() {
    const [blur, setBlur] = useState(12)
    const [opacity, setOpacity] = useState(0.5)
    const [color, setColor] = useState('#ffffff')
    const [borderOpacity, setBorderOpacity] = useState(0.2)
    const [showBackground, setShowBackground] = useState(true)

    const rgb = useMemo(() => hexToRgbTuple(color), [color])

    const cssCode = useMemo(() => {
        return `.glass-panel {
    background: rgba(${rgb}, ${opacity});
    backdrop-filter: blur(${blur}px);
    -webkit-backdrop-filter: blur(${blur}px);
    border: 1px solid rgba(${rgb}, ${borderOpacity});
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}`
    }, [rgb, opacity, blur, borderOpacity])

    const handleClear = () => {
        setBlur(12)
        setOpacity(0.5)
        setColor('#ffffff')
        setBorderOpacity(0.2)
    }

    // A beautiful abstract mesh gradient background for testing the glass effect
    const backgroundStyle = showBackground ? {
        backgroundImage: `
            radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%),
            radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%),
            radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%),
            radial-gradient(at 0% 100%, hsla(225,39%,30%,1) 0, transparent 50%),
            radial-gradient(at 50% 100%, hsla(253,16%,7%,1) 0, transparent 50%),
            radial-gradient(at 100% 100%, hsla(339,49%,30%,1) 0, transparent 50%)
        `,
        backgroundColor: '#0f0f13'
    } : {
        backgroundColor: 'var(--color-bg-panel)'
    }

    return (
        <ToolLayout toolId="glassmorphism">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>

                {/* Configuration Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Blur Amount (px)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{blur}px</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            step="1"
                            value={blur}
                            onChange={(e) => setBlur(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Background Opacity</span>
                            <span style={{ color: 'var(--color-primary)' }}>{opacity}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={opacity}
                            onChange={(e) => setOpacity(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Border Opacity</span>
                            <span style={{ color: 'var(--color-primary)' }}>{borderOpacity}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={borderOpacity}
                            onChange={(e) => setBorderOpacity(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label>Glass Tint Color</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{ width: '40px', height: '40px', padding: 0, border: 'none', background: 'none' }}
                            />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                {color.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="tool-option-group" style={{ marginTop: 'var(--space-2)' }}>
                        <label className="dt-checkbox" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontFamily: 'var(--font-heading)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)' }}>
                            <input
                                type="checkbox"
                                checked={showBackground}
                                onChange={(e) => setShowBackground(e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                            />
                            Show Mesh Gradient Background
                        </label>
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
                                height: '300px',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...backgroundStyle,
                                transition: 'background 0.3s ease'
                            }}
                        >
                            {/* Colorful shapes behind the glass to emphasize the blur */}
                            {showBackground && (
                                <>
                                    <div style={{ position: 'absolute', top: '20%', left: '20%', width: '100px', height: '100px', borderRadius: '50%', background: '#ff3366', filter: 'blur(10px)' }} />
                                    <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '120px', height: '120px', borderRadius: '20%', background: '#33ccff', filter: 'blur(15px)', transform: 'rotate(45deg)' }} />
                                </>
                            )}

                            {/* The Glass Element */}
                            <div
                                style={{
                                    width: '60%',
                                    height: '60%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: color === '#ffffff' ? '#ffffff' : 'var(--color-text-primary)',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 600,
                                    zIndex: 10,
                                    background: `rgba(${rgb}, ${opacity})`,
                                    backdropFilter: `blur(${blur}px)`,
                                    WebkitBackdropFilter: `blur(${blur}px)`,
                                    border: `1px solid rgba(${rgb}, ${borderOpacity})`,
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                Frosted Glass
                            </div>
                        </div>
                    </div>

                    <ToolOutput fields={[{ label: 'Generated CSS', value: cssCode }]} />
                </div>
            </div>
        </ToolLayout>
    )
}
