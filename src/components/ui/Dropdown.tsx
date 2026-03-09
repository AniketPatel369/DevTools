interface DropdownProps {
    options: string[]
    value: string
    onChange: (value: string) => void
    label?: string
}

export function Dropdown({ options, value, onChange, label }: DropdownProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {label && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{label}</span>}
            <select
                className="dt-dropdown"
                value={value}
                onChange={e => onChange(e.target.value)}
                aria-label={label}
            >
                {options.map(o => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
        </div>
    )
}
