import type { ReactNode } from 'react'
import { ToolHeader } from './ToolHeader'

interface ToolLayoutProps {
    toolId: string
    children: ReactNode
}

/**
 * ToolLayout — wraps every tool page.
 * Renders ToolHeader (with favourites star) above tool-specific content.
 * Children should include: ToolInput, ToolOptions, action Buttons, ToolOutput.
 */
export function ToolLayout({ toolId, children }: ToolLayoutProps) {
    return (
        <div>
            <ToolHeader toolId={toolId} />
            <div className="tool-body">
                {children}
            </div>
        </div>
    )
}
