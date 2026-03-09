import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md'
    icon?: ReactNode
}

export function Button({ variant = 'primary', size = 'md', icon, children, className, ...props }: ButtonProps) {
    return (
        <button
            className={cn('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className)}
            {...props}
        >
            {icon}
            {children}
        </button>
    )
}
