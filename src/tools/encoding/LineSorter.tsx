import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'
import { sortLines, type SortOrder } from '@/utils/text'

const ORDERS: SortOrder[] = ['A → Z', 'Z → A', 'Numeric Asc', 'Numeric Desc']

export default function LineSorter() {
    const { output, setOutput, clearOutput } = useTool('line-sorter')
    const [input, setInput] = useState(output?.input ?? '')
    const [order, setOrder] = useState<SortOrder>('A → Z')
    const [trim, setTrim] = useState(true)

    const run = () => setOutput({ input, output: sortLines(input, order, trim) })
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="line-sorter">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="Paste lines to sort…" />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Order</label>
                    <Dropdown options={ORDERS} value={order} onChange={v => setOrder(v as SortOrder)} />
                </div>
                <label className="dt-checkbox">
                    <input type="checkbox" checked={trim} onChange={e => setTrim(e.target.checked)} />
                    Trim Lines
                </label>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Sort</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: 'Sorted Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
