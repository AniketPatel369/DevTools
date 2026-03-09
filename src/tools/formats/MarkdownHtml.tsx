import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Eye, Trash2 } from 'lucide-react'
import { marked } from 'marked'

export default function MarkdownHtml() {
    const { output, setOutput, clearOutput } = useTool('markdown-html')
    const [input, setInput] = useState(output?.input ?? '')
    const [view, setView] = useState<'rendered' | 'html'>('rendered')

    const result = typeof output?.output === 'string' ? output.output : ''

    const run = () => setOutput({ input, output: marked(input) as string })
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="markdown-html">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="# Hello World&#10;&#10;Write Markdown here…" />
            <div className="tool-actions">
                <Button onClick={run} icon={<Eye size={13} />}>Render</Button>
                <Button variant="secondary" onClick={() => setView(v => v === 'rendered' ? 'html' : 'rendered')}>
                    Show {view === 'rendered' ? 'HTML' : 'Preview'}
                </Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>

            {result && (
                view === 'rendered' ? (
                    <div
                        className="tool-output-wrap"
                        style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-ui)', lineHeight: 1.7, color: 'var(--color-text-primary)' }}
                        dangerouslySetInnerHTML={{ __html: result }}
                    />
                ) : (
                    <div className="tool-output-wrap">
                        <div className="tool-output-head">
                            <span className="tool-output-label">HTML Output</span>
                        </div>
                        <div className="tool-output-body">
                            <pre className="tool-output-field-value">{result}</pre>
                        </div>
                    </div>
                )
            )}
        </ToolLayout>
    )
}
