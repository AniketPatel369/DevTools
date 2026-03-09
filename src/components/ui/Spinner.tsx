import { ChevronUp, ChevronDown } from 'lucide-react'

interface SpinnerProps {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    label?: string
}

export function Spinner({ value, onChange, min = 0, max = 99999, step = 1, label }: SpinnerProps) {
    const inc = () => onChange(Math.min(max, value + step))
    const dec = () => onChange(Math.max(min, value - step))

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {label && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{label}</span>}
            <div className="dt-spinner">
                <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={e => {
                        const n = Number(e.target.value)
                        if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)))
                    }}
                    aria-label={label}
                />
                <div className="dt-spinner-arrows">
                    <button className="dt-spinner-btn" onClick={inc} aria-label="Increase" type="button">
                        <ChevronUp size={10} />
                    </button>
                    <button className="dt-spinner-btn" onClick={dec} aria-label="Decrease" type="button">
                        <ChevronDown size={10} />
                    </button>
                </div>
            </div>
        </div>
    )
}
