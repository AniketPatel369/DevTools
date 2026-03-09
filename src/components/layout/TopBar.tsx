import { Menu, Moon, Sun, Monitor, X } from 'lucide-react'
import { useThemeStore, type Theme } from '@/store/theme'
import configJson from '@/data/config.json'

const THEME_OPTIONS: { value: Theme; icon: React.FC<{ size?: number }>; label: string }[] = [
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
]

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

            {/* App name */}
            <span className="topbar-title">{configJson.copyright.appName}</span>

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
