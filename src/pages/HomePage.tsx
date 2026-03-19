import { Link } from 'react-router-dom'
import { useRecentStore } from '@/store/recent'
import { useFavouritesStore } from '@/store/favourites'
import { findTool, ALL_TOOLS } from '@/data/registry'
import { CATEGORY_META } from '@/data/categoryMeta'
import * as LucideIcons from 'lucide-react'
import type { CategoryName } from '@/data/types'

type LucideIconName = keyof typeof LucideIcons

function ToolIcon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
    const Icon = (LucideIcons[name as LucideIconName] ?? LucideIcons.Wrench) as React.FC<{ size?: number; color?: string; strokeWidth?: number }>
    return <Icon size={size} color={color} strokeWidth={1.5} />
}

export function HomePage() {
    const { ids: recentIds } = useRecentStore()
    const { ids: favIds } = useFavouritesStore()

    const recentTools = recentIds.map(id => findTool(id)).filter(Boolean)
    const favTools = favIds.map(id => findTool(id)).filter(Boolean)
    // Show a mix of tools, prioritizing CSS for now since they are new
    const suggestedTools = ALL_TOOLS.filter(t => t.category === 'CSS').concat(ALL_TOOLS.filter(t => t.category !== 'CSS').slice(0, 4))

    return (
        <div className="home-page">
            <div className="home-welcome">
                <h2>Welcome to DevTools</h2>
                <p>62 developer utilities — all running locally in your browser. Pick a tool from the sidebar or search with <kbd style={{ fontFamily: 'var(--font-mono)', background: 'var(--color-bg-card)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Ctrl+K</kbd></p>
            </div>

            {favTools.length > 0 && (
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <div className="home-section-title">⭐ Favourites</div>
                    <div className="home-tools-grid">
                        {favTools.map(t => t && (
                            <Link key={t.id} to={`/tool/${t.id}`} className="home-tool-card">
                                <div className="home-tool-card-icon" style={{ background: CATEGORY_META[t.category as CategoryName]?.bgColor }}>
                                    <ToolIcon name={t.icon} color={CATEGORY_META[t.category as CategoryName]?.color} />
                                </div>
                                <div className="home-tool-card-content">
                                    <div className="home-tool-card-name">{t.name}</div>
                                    <div className="home-tool-card-desc">{t.description}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {recentTools.length > 0 && (
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <div className="home-section-title">🕐 Recently Used</div>
                    <div className="home-tools-grid">
                        {recentTools.map(t => t && (
                            <Link key={t.id} to={`/tool/${t.id}`} className="home-tool-card">
                                <div className="home-tool-card-icon" style={{ background: CATEGORY_META[t.category as CategoryName]?.bgColor }}>
                                    <ToolIcon name={t.icon} color={CATEGORY_META[t.category as CategoryName]?.color} />
                                </div>
                                <div className="home-tool-card-content">
                                    <div className="home-tool-card-name">{t.name}</div>
                                    <div className="home-tool-card-desc">{t.description}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <div className="home-section-title">🚀 Featured Tools</div>
                <div className="home-tools-grid">
                    {suggestedTools.map(t => (
                        <Link key={t.id} to={`/tool/${t.id}`} className="home-tool-card">
                            <div className="home-tool-card-icon" style={{ background: CATEGORY_META[t.category as CategoryName]?.bgColor }}>
                                <ToolIcon name={t.icon} color={CATEGORY_META[t.category as CategoryName]?.color} />
                            </div>
                            <div className="home-tool-card-content">
                                <div className="home-tool-card-name">{t.name}</div>
                                <div className="home-tool-card-desc">{t.description}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
