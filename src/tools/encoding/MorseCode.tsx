import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, ArrowLeftRight, Trash2 } from 'lucide-react'
import { textToMorse, morseToText } from '@/utils/text'

type Mode = 'Encode' | 'Decode'

export default function MorseCode() {
    const { output, setOutput, clearOutput } = useTool('morse-code')
    const [input, setInput] = useState(output?.input ?? '')
    const [mode, setMode] = useState<Mode>('Encode')

    const run = () => setOutput({ input, output: mode === 'Encode' ? textToMorse(input) : morseToText(input) })
    const swap = () => { if (typeof output?.output === 'string') { setInput(output.output); clearOutput() } }
    const clear = () => { setInput(''); clearOutput() }

    return (
        <ToolLayout toolId="morse-code">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder={mode === 'Encode' ? 'Enter text (e.g. HELLO WORLD)…' : 'Enter Morse (e.g. .... . .-.. .-.. ---)…'} />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Mode</label>
                    <Toggle options={['Encode', 'Decode']} value={mode} onChange={v => setMode(v as Mode)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>{mode}</Button>
                <Button variant="secondary" onClick={swap} icon={<ArrowLeftRight size={13} />}>Swap</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: 'Output', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
