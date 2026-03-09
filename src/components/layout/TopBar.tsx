import { Menu, Moon, Sun, Monitor, X } from 'lucide-react'
import { useThemeStore, type Theme } from '@/store/theme'
import configJson from '@/data/config.json'

const THEME_OPTIONS: { value: Theme; icon: React.FC<{ size?: number }>; label: string }[] = [
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
]

function LogoMark() {
    return (
        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <linearGradient id="topbar-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
            </defs>
            <text
                x="16" y="22"
                textAnchor="middle"
                fontFamily="'Consolas','Cascadia Code','Courier New',monospace"
                fontSize="16"
                fontWeight="700"
                letterSpacing="-0.5"
                fill="url(#topbar-logo-grad)"
            >{'</>'}</text>
        </svg>
    )
}

interface TopBarProps {
    sidebarOpen: boolean
    onToggleSidebar: () => void
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
    const { theme, setTheme } = useThemeStore()

    return (
        <header className="app-topbar">
            {/* Hamburger — mobile only */}
            <button
                className="topbar-hamburger"
                onClick={onToggleSidebar}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Logo + App name */}
            <div className="topbar-brand">
                <LogoMark />
                <span className="topbar-title">{configJson.copyright.appName}</span>
            </div>

            {/* Theme switcher */}
            <div className="topbar-theme-switcher" role="group" aria-label="Theme">
                {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
                    <button
                        key={value}
                        className={`topbar-theme-btn${theme === value ? ' active' : ''}`}
                        onClick={() => setTheme(value)}
                        title={label}
                        aria-label={label}
                        aria-pressed={theme === value}
                    >
                        <Icon size={14} />
                        <span className="topbar-theme-label">{label}</span>
                    </button>
                ))}
            </div>
        </header>
    )
}
