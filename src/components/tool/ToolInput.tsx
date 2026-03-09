import { X } from 'lucide-react'
import { Textarea } from '@/components/ui/Textarea'

interface ToolInputProps {
    label?: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    onClear?: () => void
    minHeight?: string
}

export function ToolInput({ label = 'Input', value, onChange, placeholder, onClear, minHeight }: ToolInputProps) {
    return (
        <div className="tool-input-wrap">
            <div style={{ position: 'relative' }}>
                <Textarea
                    label={label}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    minHeight={minHeight}
                />
                {value && onClear && (
                    <button
                        className="tool-input-clear"
                        onClick={onClear}
                        aria-label="Clear input"
                        title="Clear input"
                        type="button"
                    >
                        <X size={13} />
                    </button>
                )}
            </div>
        </div>
    )
}
