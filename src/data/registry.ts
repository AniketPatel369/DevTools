// ============================================================
// DEVTOOLS — Tool Registry
// Imports features.json and exports typed maps and helpers.
// To add a new tool: add it to features.json ONLY.
// ============================================================
import featuresJson from './features.json'
import type { Tool, CategoryName } from './types'

// Cast the raw JSON into our typed map
const raw = featuresJson as Record<string, Omit<Tool, 'category'>[]>

// Inject `category` into every tool
export const TOOLS_MAP: Record<CategoryName, Tool[]> = Object.fromEntries(
    Object.entries(raw).map(([category, tools]) => [
        category,
        tools.map(t => ({ ...t, category: category as CategoryName })),
    ])
) as Record<CategoryName, Tool[]>

// Flat array of all tools (preserving category order)
export const ALL_TOOLS: Tool[] = Object.values(TOOLS_MAP).flat()

// Lookup by id — O(n) but the list is tiny
export const findTool = (id: string): Tool | undefined =>
    ALL_TOOLS.find(t => t.id === id)

// Category names in display order
export const CATEGORY_NAMES: CategoryName[] = [
    'Encoding',
    'Hashing',
    'Formats',
    'Web Dev',
]
