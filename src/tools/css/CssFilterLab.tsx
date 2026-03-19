import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Trash2, ImageIcon } from 'lucide-react'

// Reliable demo images for the photo filter
const DEMO_IMAGE = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'

export default function CssFilterLab() {
    // Filter states
    const [blur, setBlur] = useState(0)
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [grayscale, setGrayscale] = useState(0)
    const [hueRotate, setHueRotate] = useState(0)
    const [invert, setInvert] = useState(0)
    const [saturate, setSaturate] = useState(100)
    const [sepia, setSepia] = useState(0)

    const [imageUrl, setImageUrl] = useState(DEMO_IMAGE)
    const [hasError, setHasError] = useState(false)

    const handleImageError = () => {
        if (!hasError) {
            setImageUrl(FALLBACK_IMAGE)
            setHasError(true)
        }
    }

    const filterString = useMemo(() => {
        const filters = []
        if (blur > 0) filters.push(`blur(${blur}px)`)
        if (brightness !== 100) filters.push(`brightness(${brightness}%)`)
        if (contrast !== 100) filters.push(`contrast(${contrast}%)`)
        if (grayscale > 0) filters.push(`grayscale(${grayscale}%)`)
        if (hueRotate > 0) filters.push(`hue-rotate(${hueRotate}deg)`)
        if (invert > 0) filters.push(`invert(${invert}%)`)
        if (saturate !== 100) filters.push(`saturate(${saturate}%)`)
        if (sepia > 0) filters.push(`sepia(${sepia}%)`)

        return filters.length > 0 ? filters.join(' ') : 'none'
    }, [blur, brightness, contrast, grayscale, hueRotate, invert, saturate, sepia])

    const cssCode = `.filtered-image {
    filter: ${filterString};
}`

    const handleClear = () => {
        setBlur(0)
        setBrightness(100)
        setContrast(100)
        setGrayscale(0)
        setHueRotate(0)
        setInvert(0)
        setSaturate(100)
        setSepia(0)
    }

    const setPreset = (preset: string) => {
        handleClear()
        switch (preset) {
            case 'Noir':
                setGrayscale(100)
                setContrast(120)
                break
            case 'Vintage':
                setSepia(80)
                setContrast(90)
                setSaturate(120)
                break
            case 'Cyberpunk':
                setHueRotate(150)
                setSaturate(150)
                setContrast(110)
                break
            case 'Washed Out':
                setContrast(80)
                setBrightness(110)
                setSaturate(70)
                break
        }
    }

    return (
        <ToolLayout toolId="css-filter-lab">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>

                {/* Configuration Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                    {/* Presets */}
                    <div className="tool-option-group">
                        <label>Quick Presets</label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <Button variant="secondary" size="sm" onClick={() => setPreset('Noir')}>Noir</Button>
                            <Button variant="secondary" size="sm" onClick={() => setPreset('Vintage')}>Vintage</Button>
                            <Button variant="secondary" size="sm" onClick={() => setPreset('Cyberpunk')}>Cyberpunk</Button>
                            <Button variant="secondary" size="sm" onClick={() => setPreset('Washed Out')}>Washed Out</Button>
                        </div>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />

                    {/* Sliders */}
                    {[
                        { label: 'Blur (px)', value: blur, set: setBlur, min: 0, max: 20, step: 1, suffix: 'px' },
                        { label: 'Brightness (%)', value: brightness, set: setBrightness, min: 0, max: 200, step: 1, suffix: '%' },
                        { label: 'Contrast (%)', value: contrast, set: setContrast, min: 0, max: 200, step: 1, suffix: '%' },
                        { label: 'Grayscale (%)', value: grayscale, set: setGrayscale, min: 0, max: 100, step: 1, suffix: '%' },
                        { label: 'Hue Rotate (deg)', value: hueRotate, set: setHueRotate, min: 0, max: 360, step: 1, suffix: 'deg' },
                        { label: 'Invert (%)', value: invert, set: setInvert, min: 0, max: 100, step: 1, suffix: '%' },
                        { label: 'Saturate (%)', value: saturate, set: setSaturate, min: 0, max: 200, step: 1, suffix: '%' },
                        { label: 'Sepia (%)', value: sepia, set: setSepia, min: 0, max: 100, step: 1, suffix: '%' },
                    ].map((filter) => (
                        <div key={filter.label} className="tool-option-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{filter.label}</span>
                                <span style={{ color: 'var(--color-primary)' }}>{filter.value}{filter.suffix}</span>
                            </label>
                            <input
                                type="range"
                                min={filter.min}
                                max={filter.max}
                                step={filter.step}
                                value={filter.value}
                                onChange={(e) => filter.set(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Output Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                    {/* Image URL Input */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <ImageIcon size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-faint)' }} />
                            <input
                                type="text"
                                className="dt-input"
                                style={{ paddingLeft: '36px', width: '100%' }}
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value)
                                    setHasError(false)
                                }}
                                placeholder="Paste image URL here..."
                            />
                        </div>
                    </div>

                    {/* Visual Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="tool-output-label">Live Preview</span>
                            <Button variant="danger" size="sm" onClick={handleClear} icon={<Trash2 size={13} />}>Reset Filters</Button>
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
                                backgroundColor: 'var(--color-bg-panel)',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%239C92AC' fill-opacity='0.1' d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/svg%3E")` 
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt="Filter preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    filter: filterString,
                                    transition: 'filter 0.2s ease-out'
                                }}
                                onError={handleImageError}
                            />
                        </div>
                    </div>

                    <ToolOutput fields={[{ label: 'Generated CSS', value: cssCode }]} />
                </div>
            </div>
        </ToolLayout>
    )
}
