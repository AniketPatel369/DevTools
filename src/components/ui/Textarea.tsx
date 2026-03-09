import { useRef } from 'react'
import { useCharCount } from '@/hooks/useCharCount'

interface TextareaProps {
    label?: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: string
    showCount?: boolean
    readOnly?: boolean
}

export function Textarea({
    label,
    value,
    onChange,
    placeholder = 'Paste or type here…',
    minHeight = '120px',
    showCount = true,
    readOnly = false,
}: TextareaProps) {
    const ref = useRef<HTMLTextAreaElement>(null)
    const { chars } = useCharCount(value)

    return (
        <div className="dt-textarea-wrap">
            {(label || showCount) && (
                <div className="dt-textarea-head">
                    {label && <span className="dt-textarea-label">{label}</span>}
                    {showCount && (
                        <span className="dt-char-count">
                            {chars > 0 ? `${chars.toLocaleString()} chars` : ''}
                        </span>
                    )}
                </div>
            )}
            <textarea
                ref={ref}
                className="dt-textarea"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                readOnly={readOnly}
                style={{ minHeight }}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
            />
        </div>
    )
}
