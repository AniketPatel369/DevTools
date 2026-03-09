import { cn } from '@/utils/cn'

interface ToggleProps {
    options: string[]
    value: string
    onChange: (value: string) => void
}

export function Toggle({ options, value, onChange }: ToggleProps) {
    return (
        <div className="dt-toggle" role="group">
            {options.map(opt => (
                <button
                    key={opt}
                    className={cn('dt-toggle-btn', opt === value && 'active')}
                    onClick={() => onChange(opt)}
                    type="button"
                    aria-pressed={opt === value}
                >
                    {opt}
                </button>
            ))}
        </div>
    )
}
