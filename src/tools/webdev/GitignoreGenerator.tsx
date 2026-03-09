import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

const TEMPLATES: Record<string, string> = {
    Node: '# Node\nnode_modules/\n.env\n.env.local\n.env.*.local\ndist/\nbuild/\n*.log\n.DS_Store',
    Python: '# Python\n__pycache__/\n*.pyc\n*.pyo\n.env\nvenv/\n.venv/\ndist/\nbuild/\n*.egg-info/\n.pytest_cache/\n.DS_Store',
    Java: '# Java\n*.class\n*.jar\n*.war\ntarget/\nbuild/\n.classpath\n.project\n.settings/\n*.log',
    React: '# React\nnode_modules/\ndist/\nbuild/\n.env\n.env.local\n.DS_Store\n*.log\ncoverage/',
    Go: '# Go\nbuild/\ndist/\n*.exe\n*.test\n.env\n*.out\nvendor/',
    Rust: '# Rust\ntarget/\n.env\n**/*.rs.bk\nCargo.lock',
    Docker: '# Docker\n.dockerignore\n*.log\n.env',
    IDE: '# IDE\n.vscode/\n.idea/\n*.swp\n*.swo\n*.suo\n*.ntvs*\n*.njsproj\n*.sln',
}

export default function GitignoreGenerator() {
    const { output, setOutput, clearOutput } = useTool('gitignore-generator')
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [custom, setCustom] = useState('')

    const toggle = (t: string) => setSelected(prev => {
        const next = new Set(prev)
        next.has(t) ? next.delete(t) : next.add(t)
        return next
    })

    const generate = () => {
        const sections = [...selected].map(t => TEMPLATES[t]).join('\n\n')
        const result = [sections, custom.trim()].filter(Boolean).join('\n\n# Custom\n')
        setOutput({ input: [...selected].join(','), output: result })
    }

    const clear = () => { setSelected(new Set()); setCustom(''); clearOutput() }

    return (
        <ToolLayout toolId="gitignore-generator">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                {Object.keys(TEMPLATES).map(t => (
                    <button
                        key={t}
                        onClick={() => toggle(t)}
                        style={{
                            padding: '4px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                            background: selected.has(t) ? 'var(--color-accent)' : 'var(--color-bg-card)',
                            color: selected.has(t) ? '#fff' : 'var(--color-text-secondary)',
                            border: `1px solid ${selected.has(t) ? 'var(--color-accent)' : 'var(--color-border)'}`,
                            transition: 'all var(--transition-fast)'
                        }}
                    >{t}</button>
                ))}
            </div>
            <div className="dt-textarea-wrap">
                <div className="dt-textarea-head"><span className="dt-textarea-label">Custom patterns (optional)</span></div>
                <textarea
                    className="dt-textarea"
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    placeholder="*.secret&#10;my-local-config/&#10;…"
                    style={{ minHeight: 80 }}
                />
            </div>
            <div className="tool-actions">
                <Button onClick={generate} icon={<Play size={13} />}>Generate .gitignore</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: '.gitignore', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
