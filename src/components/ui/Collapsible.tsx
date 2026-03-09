import { useState, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CollapsibleProps {
    title: string
    children: ReactNode
    defaultOpen?: boolean
}

export function Collapsible({ title, children, defaultOpen = true }: CollapsibleProps) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div>
            <button
                className="dt-collapsible-header"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                type="button"
            >
                <ChevronRight
                    size={14}
                    className={cn('dt-collapsible-chevron', open && 'open')}
                />
                {title}
            </button>

            {open && (
                <div className="dt-collapsible-body">
                    <div className="dt-collapsible-inner">
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}
