import type { ReactNode } from 'react'

interface MainPanelProps { children: ReactNode }

export function MainPanel({ children }: MainPanelProps) {
    return (
        <main className="main-panel" id="main-content">
            <div className="main-panel-inner">
                {children}
            </div>
        </main>
    )
}
