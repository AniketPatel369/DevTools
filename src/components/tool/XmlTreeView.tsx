import { useState, useCallback } from 'react'

interface XmlNodeProps {
    node: Node
    path: string
    defaultExpanded: boolean
    expandedState: Record<string, boolean>
    onToggle: (path: string) => void
}

function getNodePath(node: Node): string {
    let path = ''
    let current: Node | null = node
    while (current && current.nodeType === 1) { // ELEMENT_NODE
        const el = current as Element
        let index = 0
        let sibling = el.previousElementSibling
        while (sibling) {
            if (sibling.tagName === el.tagName) {
                index++
            }
            sibling = sibling.previousElementSibling
        }
        path = `/${el.tagName.toLowerCase()}[${index}]` + path
        current = current.parentNode
    }
    return path || '/'
}

function renderAttributes(el: Element) {
    if (!el.attributes || el.attributes.length === 0) return null
    return Array.from(el.attributes).map(attr => (
        <span key={attr.name}>
            <span className="dt-tree-xml-attr-name"> {attr.name}</span>
            <span className="dt-tree-xml-tag-bracket">=</span>
            <span className="dt-tree-xml-attr-val">"{attr.value}"</span>
        </span>
    ))
}

function XmlNode({
    node,
    path,
    defaultExpanded,
    expandedState,
    onToggle,
}: XmlNodeProps) {
    // 1: ELEMENT_NODE, 3: TEXT_NODE, 4: CDATA_SECTION_NODE, 8: COMMENT_NODE
    if (node.nodeType === 3) {
        const text = node.nodeValue?.trim()
        if (!text) return null
        return (
            <div className="dt-tree-row">
                <span className="dt-tree-xml-text">{text}</span>
            </div>
        )
    }

    if (node.nodeType === 4) {
        return (
            <div className="dt-tree-row">
                <span className="dt-tree-xml-cdata">&lt;![CDATA[{node.nodeValue}]]&gt;</span>
            </div>
        )
    }

    if (node.nodeType === 8) {
        return (
            <div className="dt-tree-row">
                <span className="dt-tree-xml-comment">&lt;!-- {node.nodeValue} --&gt;</span>
            </div>
        )
    }

    if (node.nodeType !== 1) {
        return null
    }

    const el = node as Element
    const tagName = el.tagName

    // Check children
    const childNodes = Array.from(el.childNodes).filter(child => {
        if (child.nodeType === 3) { // TEXT_NODE
            return !!child.nodeValue?.trim()
        }
        return child.nodeType === 1 || child.nodeType === 4 || child.nodeType === 8
    })

    // Self closing tags
    if (childNodes.length === 0) {
        return (
            <div className="dt-tree-row">
                <span className="dt-tree-xml-tag-bracket">&lt;</span>
                <span className="dt-tree-xml-tag-name">{tagName}</span>
                {renderAttributes(el)}
                <span className="dt-tree-xml-tag-bracket"> /&gt;</span>
            </div>
        )
    }

    // Inline elements (single text child only)
    if (childNodes.length === 1 && childNodes[0].nodeType === 3) {
        return (
            <div className="dt-tree-row">
                <span className="dt-tree-xml-tag-bracket">&lt;</span>
                <span className="dt-tree-xml-tag-name">{tagName}</span>
                {renderAttributes(el)}
                <span className="dt-tree-xml-tag-bracket">&gt;</span>
                <span className="dt-tree-xml-text">{childNodes[0].nodeValue}</span>
                <span className="dt-tree-xml-tag-bracket">&lt;/</span>
                <span className="dt-tree-xml-tag-name">{tagName}</span>
                <span className="dt-tree-xml-tag-bracket">&gt;</span>
            </div>
        )
    }

    const isExpanded = expandedState[path] ?? defaultExpanded
    const toggleNode = () => onToggle(path)

    if (!isExpanded) {
        return (
            <div className="dt-tree-row">
                <button
                    type="button"
                    className="dt-tree-toggle"
                    onClick={toggleNode}
                    aria-label="Expand tag"
                >
                    <span className="dt-tree-toggle-icon" />
                </button>
                <span className="dt-tree-xml-tag-bracket">&lt;</span>
                <span className="dt-tree-xml-tag-name">{tagName}</span>
                {renderAttributes(el)}
                <span className="dt-tree-xml-tag-bracket">&gt;</span>
                <span>...</span>
                <span className="dt-tree-xml-tag-bracket">&lt;/</span>
                <span className="dt-tree-xml-tag-name">{tagName}</span>
                <span className="dt-tree-xml-tag-bracket">&gt;</span>
                <span className="dt-tree-meta">({childNodes.length} children)</span>
            </div>
        )
    }

    return (
        <div className="dt-tree-node">
            <div className="dt-tree-row">
                <button
                    type="button"
                    className="dt-tree-toggle expanded"
                    onClick={toggleNode}
                    aria-label="Collapse tag"
                >
                    <span className="dt-tree-toggle-icon" />
                </button>
                <span className="dt-tree-xml-tag-bracket">&lt;</span>
                <span className="dt-tree-xml-tag-name">{tagName}</span>
                {renderAttributes(el)}
                <span className="dt-tree-xml-tag-bracket">&gt;</span>
            </div>

            <div className="dt-tree-indent-guide">
                {childNodes.map((child, index) => {
                    const childPath = child.nodeType === 1 
                        ? getNodePath(child) 
                        : `${path}/child[${index}]`
                    return (
                        <XmlNode
                            key={index}
                            node={child}
                            path={childPath}
                            defaultExpanded={defaultExpanded}
                            expandedState={expandedState}
                            onToggle={onToggle}
                        />
                    )
                })}
            </div>

            <div className="dt-tree-row" style={{ paddingLeft: '20px' }}>
                <span className="dt-tree-xml-tag-bracket">&lt;/</span>
                <span className="dt-tree-xml-tag-name">{tagName}</span>
                <span className="dt-tree-xml-tag-bracket">&gt;</span>
            </div>
        </div>
    )
}

export function XmlTreeView({ xml }: { xml: string }) {
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

    // Parse the XML using DOMParser
    let xmlDoc: Document | null = null
    let errorMsg = ''

    if (xml) {
        try {
            const parser = new DOMParser()
            xmlDoc = parser.parseFromString(xml, 'application/xml')
            const parserError = xmlDoc.getElementsByTagName('parsererror')
            if (parserError.length > 0) {
                errorMsg = parserError[0].textContent || 'XML parsing error'
                xmlDoc = null
            }
        } catch (e) {
            errorMsg = (e as Error).message
            xmlDoc = null
        }
    }

    if (!xml) {
        return (
            <div style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>
                No XML content to display.
            </div>
        )
    }

    if (errorMsg || !xmlDoc || !xmlDoc.documentElement) {
        return (
            <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
                {errorMsg || 'Failed to parse XML for tree view.'}
            </div>
        )
    }

    const rootEl = xmlDoc.documentElement
    const rootPath = getNodePath(rootEl)

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
                <XmlNode
                    node={rootEl}
                    path={rootPath}
                    defaultExpanded={defaultExpanded}
                    expandedState={expandedState}
                    onToggle={handleToggle}
                />
            </div>
        </div>
    )
}
