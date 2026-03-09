import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Eye, Trash2 } from 'lucide-react'
import { marked } from 'marked'

export default function MarkdownPreview() {
    const { output, setOutput, clearOutput } = useTool('markdown-preview')
    const [input, setInput] = useState(output?.input ?? '')

    const render = () => setOutput({ input, output: marked(input) as string })
    const clear = () => { setInput(''); clearOutput() }

    const html = typeof output?.output === 'string' ? output.output : ''

    return (
        <ToolLayout toolId="markdown-preview">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', minHeight: 400 }}>
                {/* Editor */}
                <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-1)' }}>Markdown</div>
                    <textarea
                        className="dt-textarea"
                        value={input}
                        onChange={e => { setInput(e.target.value); setOutput({ input: e.target.value, output: marked(e.target.value) as string }) }}
                        placeholder="# Hello World&#10;&#10;Write **Markdown** here…"
                        style={{ minHeight: 380, width: '100%', resize: 'none' }}
                        spellCheck={false}
                    />
                </div>

                {/* Preview */}
                <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-1)' }}>Preview</div>
                    <div
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-4)',
                            minHeight: 380,
                            overflow: 'auto',
                            fontFamily: 'var(--font-ui)',
                            fontSize: 'var(--text-md)',
                            lineHeight: 1.7,
                            color: 'var(--color-text-primary)',
                        }}
                        dangerouslySetInnerHTML={{ __html: html || '<p style="color:var(--color-text-muted)">Preview will appear here…</p>' }}
                    />
                </div>
            </div>

            <div className="tool-actions">
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
        </ToolLayout>
    )
}
