import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MainPanel } from './MainPanel'
import { TopBar } from './TopBar'
import { useThemeStore, applyTheme } from '@/store/theme'
import configJson from '@/data/config.json'

const { copyright } = configJson

function Footer() {
    return (
        <footer className="app-footer">
            <span>© {copyright.year} {copyright.owner}</span>
            <span>{copyright.appName} v{copyright.version}</span>
        </footer>
    )
}

export function AppShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { theme } = useThemeStore()
    const location = useLocation()

    // Apply theme on mount and whenever it changes
    useEffect(() => { applyTheme(theme) }, [theme])

    // Also react to system preference changes when theme === 'system'
    useEffect(() => {
        if (theme !== 'system') return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => applyTheme('system')
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [theme])

    // Close sidebar on route change (mobile UX)
    useEffect(() => { setSidebarOpen(false) }, [location.pathname])

    return (
        <div className="app-shell">
            {/* Mobile overlay — closes sidebar on tap outside */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden />
            )}

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(o => !o)} />
                <MainPanel>
                    <Outlet />
                </MainPanel>
                <Footer />
            </div>
        </div>
    )
}
