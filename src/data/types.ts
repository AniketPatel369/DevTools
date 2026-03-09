// ============================================================
// DEVTOOLS — Type Definitions
// ============================================================

export interface ToolOption {
    label: string
    value: string | number | boolean
}

export interface ToolOutputField {
    label: string
    value: string
}

export interface ToolOutput {
    input: string
    output: string | ToolOutputField[]
    timestamp: number
}

export type CategoryName = 'Encoding' | 'Hashing' | 'Formats' | 'Web Dev'

export interface Tool {
    id: string
    name: string
    icon: string
    description: string
    category: CategoryName
    actions?: string[]
    output?: string[]
}

export interface CategoryMeta {
    color: string
    bgColor: string
    borderColor: string
    order: number
}
