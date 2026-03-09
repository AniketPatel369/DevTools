import type { ReactNode } from 'react'
import { Collapsible } from '@/components/ui/Collapsible'

interface ToolOptionsProps { children: ReactNode }

export function ToolOptions({ children }: ToolOptionsProps) {
    return (
        <div className="tool-options-wrap">
            <Collapsible title="Options">
                <div className="tool-options-grid">
                    {children}
                </div>
            </Collapsible>
        </div>
    )
}
