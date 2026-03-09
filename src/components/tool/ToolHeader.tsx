import { useState, useRef, useEffect } from 'react'
import { Star, HelpCircle, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useFavouritesStore } from '@/store/favourites'
import { findTool } from '@/data/registry'
import { CATEGORY_META } from '@/data/categoryMeta'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import type { CategoryName } from '@/data/types'

type LucideIconName = keyof typeof LucideIcons

function ToolIcon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
    const Icon = (LucideIcons[name as LucideIconName] ?? LucideIcons.Wrench) as React.FC<{ size?: number; color?: string; strokeWidth?: number }>
    return <Icon size={size} color={color} strokeWidth={1.8} />
}

interface ToolHeaderProps { toolId: string }

export function ToolHeader({ toolId }: ToolHeaderProps) {
    const tool = findTool(toolId)
    const { has, toggle } = useFavouritesStore()
    const isFav = has(toolId)
    const [helpOpen, setHelpOpen] = useState(false)
    const helpRef = useRef<HTMLDivElement>(null)

    // Close popover on outside click
    useEffect(() => {
        if (!helpOpen) return
        const handler = (e: MouseEvent) => {
            if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
                setHelpOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [helpOpen])

    if (!tool) return null

    const catKey = tool.category.toLowerCase().replace(' ', '')

    return (
        <div className="tool-header">
            <div className="tool-header-left">
                <div className="tool-icon-wrap" style={{
                    background: `var(--color-${catKey}-bg)`,
                }}>
                    <ToolIcon
                        name={tool.icon}
                        size={22}
                        color={CATEGORY_META[tool.category as CategoryName]?.color}
                    />
                </div>
                <div className="tool-header-info">
                    <div className="tool-header-title-row">
                        <h1 className="tool-name">{tool.name}</h1>
                        <Badge category={tool.category as CategoryName} />
                    </div>
                    <p className="tool-description">{tool.description}</p>
                </div>
            </div>

            <div className="tool-header-actions">
                <button
                    className={cn('tool-fav-btn', isFav && 'active')}
                    onClick={() => toggle(toolId)}
                    aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
                    title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                    type="button"
                >
                    <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
                </button>

                {/* Help button with popover */}
                <div className="tool-help-wrap" ref={helpRef}>
                    <button
                        className={cn('tool-help-btn', helpOpen && 'active')}
                        onClick={() => setHelpOpen(o => !o)}
                        aria-label="About this tool"
                        aria-expanded={helpOpen}
                        title="About this tool"
                        type="button"
                    >
                        <HelpCircle size={16} />
                    </button>

                    {helpOpen && (
                        <div className="tool-help-popover" role="tooltip">
                            <div className="tool-help-popover-head">
                                <span className="tool-help-popover-title">About</span>
                                <button
                                    className="tool-help-popover-close"
                                    onClick={() => setHelpOpen(false)}
                                    aria-label="Close"
                                    type="button"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                            <p className="tool-help-popover-body">{tool.description}</p>
                            {tool.actions && tool.actions.length > 0 && (
                                <div className="tool-help-popover-actions">
                                    <span className="tool-help-popover-label">Actions</span>
                                    <div className="tool-help-popover-chips">
                                        {tool.actions.map(a => (
                                            <span key={a} className="tool-help-chip">{a}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
