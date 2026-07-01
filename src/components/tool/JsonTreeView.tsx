import { useState, useCallback } from 'react'

interface JsonNodeProps {
    name?: string | number
    value: unknown
    path: string
    isLast: boolean
    defaultExpanded: boolean
    expandedState: Record<string, boolean>
    onToggle: (path: string) => void
}

function JsonNode({
    name,
    value,
    path,
    isLast,
    defaultExpanded,
    expandedState,
    onToggle,
}: JsonNodeProps) {
    const isObject = value !== null && typeof value === 'object'
    const isArray = Array.isArray(value)

    const isExpanded = expandedState[path] ?? defaultExpanded

    const renderKey = () => {
        if (name === undefined) return null
        const formattedKey = typeof name === 'number' ? name : `"${name}"`
        return (
            <>
                <span className="dt-tree-key">{formattedKey}</span>
                <span className="dt-tree-colon">:</span>
            </>
        )
    }

    if (!isObject) {
        // Primitive values
        let valStr = String(value)
        let valClass = 'dt-tree-val-null'

        if (typeof value === 'string') {
            valStr = `"${value}"`
            valClass = 'dt-tree-val-string'
        } else if (typeof value === 'number') {
            valClass = 'dt-tree-val-number'
        } else if (typeof value === 'boolean') {
            valClass = 'dt-tree-val-boolean'
        } else if (value === null) {
            valStr = 'null'
            valClass = 'dt-tree-val-null'
        }

        return (
            <div className="dt-tree-row">
                {renderKey()}
                <span className={valClass}>{valStr}</span>
                {!isLast && <span className="dt-tree-colon">,</span>}
            </div>
        )
    }

    // Objects and Arrays
    const keys = isArray ? [] : Object.keys(value as Record<string, unknown>)
    const length = isArray ? (value as unknown[]).length : keys.length
    const bracketOpen = isArray ? '[' : '{'
    const bracketClose = isArray ? ']' : '}'

    if (length === 0) {
        return (
            <div className="dt-tree-row">
                {renderKey()}
                <span>{bracketOpen}{bracketClose}</span>
                {!isLast && <span className="dt-tree-colon">,</span>}
            </div>
        )
    }

    const toggleNode = () => onToggle(path)

    if (!isExpanded) {
        return (
            <div className="dt-tree-row">
                <button
                    type="button"
                    className="dt-tree-toggle"
                    onClick={toggleNode}
                    aria-label="Expand node"
                >
                    <span className="dt-tree-toggle-icon" />
                </button>
                {renderKey()}
                <span>{bracketOpen}...{bracketClose}</span>
                <span className="dt-tree-meta">
                    ({length} {isArray ? 'items' : 'keys'})
                </span>
                {!isLast && <span className="dt-tree-colon">,</span>}
            </div>
        )
    }

    const arrayVal = value as unknown[]
    const objVal = value as Record<string, unknown>

    return (
        <div className="dt-tree-node">
            <div className="dt-tree-row">
                <button
                    type="button"
                    className="dt-tree-toggle expanded"
                    onClick={toggleNode}
                    aria-label="Collapse node"
                >
                    <span className="dt-tree-toggle-icon" />
                </button>
                {renderKey()}
                <span>{bracketOpen}</span>
            </div>

            <div className="dt-tree-indent-guide">
                {isArray
                    ? arrayVal.map((item: unknown, index: number) => (
                          <JsonNode
                              key={index}
                              name={index}
                              value={item}
                              path={`${path}[${index}]`}
                              isLast={index === length - 1}
                              defaultExpanded={defaultExpanded}
                              expandedState={expandedState}
                              onToggle={onToggle}
                          />
                      ))
                    : keys.map((key: string, index: number) => (
                          <JsonNode
                              key={key}
                              name={key}
                              value={objVal[key]}
                              path={`${path}.${key}`}
                              isLast={index === length - 1}
                              defaultExpanded={defaultExpanded}
                              expandedState={expandedState}
                              onToggle={onToggle}
                          />
                      ))}
            </div>

            <div className="dt-tree-row" style={{ paddingLeft: '20px' }}>
                <span>{bracketClose}</span>
                {!isLast && <span className="dt-tree-colon">,</span>}
            </div>
        </div>
    )
}

export function JsonTreeView({ data }: { data: unknown }) {
    const [defaultExpanded, setDefaultExpanded] = useState(true)
    const [expandedState, setExpandedState] = useState<Record<string, boolean>>({})

    const handleToggle = useCallback((path: string) => {
        setExpandedState(prev => ({
            ...prev,
            [path]: !(prev[path] ?? defaultExpanded),
        }))
    }, [defaultExpanded])

    const handleExpandAll = () => {
        setDefaultExpanded(true)
        setExpandedState({})
    }

    const handleCollapseAll = () => {
        setDefaultExpanded(false)
        setExpandedState({})
    }

    // Try parsing if data is string, else use direct object
    let parsedData = data
    if (typeof data === 'string') {
        try {
            parsedData = JSON.parse(data)
        } catch {
            return (
                <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
                    Invalid JSON data for tree viewing.
                </div>
            )
        }
    }

    return (
        <div className="dt-tree-wrapper">
            <div className="dt-tree-toolbar">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleExpandAll}
                >
                    Expand All
                </button>
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleCollapseAll}
                >
                    Collapse All
                </button>
            </div>
            <div className="dt-tree-container">
                <JsonNode
                    value={parsedData}
                    path="$"
                    isLast={true}
                    defaultExpanded={defaultExpanded}
                    expandedState={expandedState}
                    onToggle={handleToggle}
                />
            </div>
        </div>
    )
}
