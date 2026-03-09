import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Search } from 'lucide-react'
import { TOOLS_MAP, ALL_TOOLS, CATEGORY_NAMES, findTool } from '@/data/registry'
import { CATEGORY_META } from '@/data/categoryMeta'
import { useFavouritesStore } from '@/store/favourites'
import { useRecentStore } from '@/store/recent'
import { Kbd } from '@/components/ui/Kbd'
import { cn } from '@/utils/cn'
import * as LucideIcons from 'lucide-react'
import type { CategoryName } from '@/data/types'

interface SidebarProps {
    open?: boolean
    onClose?: () => void
}

// ---- Helpers ----

type LucideIconName = keyof typeof LucideIcons

function ToolIcon({ name, size = 15, color }: { name: string; size?: number; color?: string }) {
    const Icon = (LucideIcons[name as LucideIconName] ?? LucideIcons.Wrench) as React.FC<{ size?: number; color?: string }>
    return <Icon size={size} color={color} />
}

// ---- SidebarItem ----

interface SidebarItemProps {
    toolId: string
    isFav?: boolean
    iconColor?: string
}

function SidebarItem({ toolId, isFav, iconColor }: SidebarItemProps) {
    const tool = findTool(toolId)
    if (!tool) return null

    return (
        <NavLink
            to={`/tool/${toolId}`}
            className={({ isActive }) => cn('sidebar-item', isActive && 'active')}
        >
            <span className="sidebar-item-icon">
                <ToolIcon name={tool.icon} size={15} color={iconColor} />
            </span>
            <span className="sidebar-item-name">{tool.name}</span>
            {isFav && <span className="sidebar-item-fav-dot" />}
        </NavLink>
    )
}

// ---- SidebarSection ----

function SidebarSection({ title, toolIds, iconColor }: { title: string; toolIds: string[]; iconColor?: string }) {
    const { has } = useFavouritesStore()
    if (!toolIds.length) return null
    return (
        <div className="sidebar-section">
            <div className="sidebar-section-title">{title}</div>
            {toolIds.map(id => (
                <SidebarItem key={id} toolId={id} isFav={has(id)} iconColor={iconColor} />
            ))}
        </div>
    )
}

// ---- Sidebar ----

export function Sidebar({ open, onClose }: SidebarProps) {
    const [query, setQuery] = useState('')
    const searchRef = useRef<HTMLInputElement>(null)
    const { ids: favIds } = useFavouritesStore()
    const { ids: recentIds } = useRecentStore()

    // Ctrl+K — focus handled in AppShell, but also wire here for direct access
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                searchRef.current?.focus()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    // Fuzzy filter
    const q = query.toLowerCase()
    const filtered = q ? ALL_TOOLS.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : null

    return (
        <aside className={cn('sidebar', open && 'sidebar-open')}>
            {/* Search */}
            <div className="sidebar-search-wrap">
                <div className="sidebar-search">
                    <Search size={14} color="var(--color-text-faint)" />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search tools…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        aria-label="Search tools"
                    />
                    {!query && <Kbd>⌘K</Kbd>}
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            style={{ color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
                            aria-label="Clear search"
                        >×</button>
                    )}
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav" aria-label="Tools navigation">
                {filtered ? (
                    /* Search results */
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Results ({filtered.length})</div>
                        {filtered.map(t => (
                            <SidebarItem
                                key={t.id}
                                toolId={t.id}
                                iconColor={CATEGORY_META[t.category as CategoryName]?.color}
                            />
                        ))}
                        {!filtered.length && (
                            <div style={{ padding: 'var(--space-4) var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)' }}>
                                No tools found
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Favourites */}
                        {favIds.length > 0 && (
                            <SidebarSection title="Favourites" toolIds={favIds} iconColor="var(--color-star)" />
                        )}

                        {/* Recent */}
                        {recentIds.length > 0 && (
                            <SidebarSection title="Recent" toolIds={recentIds} />
                        )}

                        {/* Categories */}
                        {CATEGORY_NAMES.map(cat => (
                            <div className="sidebar-section" key={cat}>
                                <div className="sidebar-section-title" style={{ color: CATEGORY_META[cat].color }}>
                                    {cat}
                                </div>
                                {TOOLS_MAP[cat].map(t => (
                                    <SidebarItem
                                        key={t.id}
                                        toolId={t.id}
                                        iconColor={CATEGORY_META[cat].color}
                                    />
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </nav>
        </aside>
    )
}
