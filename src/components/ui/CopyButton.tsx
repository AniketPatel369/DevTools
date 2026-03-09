import { Copy, Check } from 'lucide-react'
import { useClipboard } from '@/hooks/useClipboard'
import { cn } from '@/utils/cn'

interface CopyButtonProps {
    text: string
    label?: string
    size?: 'sm' | 'md'
}

export function CopyButton({ text, label = 'Copy', size = 'sm' }: CopyButtonProps) {
    const { copied, copy } = useClipboard()
    const iconSize = size === 'sm' ? 13 : 15

    return (
        <button
            className={cn('dt-copy-btn', copied && 'copied')}
            onClick={() => copy(text)}
            aria-label={copied ? 'Copied!' : label}
            title={copied ? 'Copied!' : label}
            type="button"
        >
            {copied
                ? <Check size={iconSize} strokeWidth={2.5} />
                : <Copy size={iconSize} />
            }
            {copied ? 'Copied!' : label}
        </button>
    )
}
