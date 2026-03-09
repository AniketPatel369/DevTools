import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Spinner } from '@/components/ui/Spinner'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const ATTR_PREFIXES = ['@', '_', '#']
const TEXT_KEYS = ['#text', '_text', 'value']

export default function XmlJson() {
    const { output, setOutput, clearOutput } = useTool('xml-json')
    const [input, setInput] = useState(output?.input ?? '')
    const [indent, setIndent] = useState(2)
    const [attrPrefix, setAttrPrefix] = useState('@')
    const [textKey, setTextKey] = useState('#text')
    const [lastOp, setLastOp] = useState<'json' | 'xml'>('json')
    const [error, setError] = useState('')

    const toJson = () => {
        setError('')
        try {
            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: attrPrefix, textNodeName: textKey })
            const obj = parser.parse(input)
            setOutput({ input, output: JSON.stringify(obj, null, indent) })
            setLastOp('json')
        } catch (e) { setError((e as Error).message) }
    }

    const toXml = () => {
        setError('')
        try {
            const obj = JSON.parse(input)
            const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: attrPrefix, textNodeName: textKey, format: true, indentBy: ' '.repeat(indent) })
            setOutput({ input, output: builder.build(obj) })
            setLastOp('xml')
        } catch (e) { setError((e as Error).message) }
    }

    const swap = () => { if (typeof output?.output === 'string') { setInput(output.output); clearOutput() } }
    const clear = () => { setInput(''); clearOutput(); setError('') }

    return (
        <ToolLayout toolId="xml-json">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste XML or JSON here…" />
            <ToolOptions>
                <Spinner label="Indent Spaces" value={indent} onChange={setIndent} min={1} max={8} />
                <div className="tool-option-group">
                    <label>Attribute Prefix</label>
                    <Dropdown options={ATTR_PREFIXES} value={attrPrefix} onChange={setAttrPrefix} />
                </div>
                <div className="tool-option-group">
                    <label>Text Content Key</label>
                    <Dropdown options={TEXT_KEYS} value={textKey} onChange={setTextKey} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={toJson} icon={<Play size={13} />}>To JSON</Button>
                <Button variant="secondary" onClick={toXml}>To XML</Button>
                <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={[{ label: lastOp === 'json' ? 'JSON Output' : 'XML Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
