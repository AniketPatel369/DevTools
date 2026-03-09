import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { RefreshCw, Trash2 } from 'lucide-react'

type LoremType = 'paragraphs' | 'sentences' | 'words'

const WORD_POOL = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa officia deserunt mollit anim id est laborum'.split(' ')

function rand(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)] }

function genWords(n: number): string {
    return Array.from({ length: n }, () => rand(WORD_POOL)).join(' ')
}

function genSentence(): string {
    const words = genWords(8 + Math.floor(Math.random() * 10))
    return words[0].toUpperCase() + words.slice(1) + '.'
}

function genParagraph(): string {
    return Array.from({ length: 4 + Math.floor(Math.random() * 4) }, genSentence).join(' ')
}

export default function LoremIpsum() {
    const { output, setOutput, clearOutput } = useTool('lorem-ipsum')
    const [type, setType] = useState<LoremType>('paragraphs')
    const [count, setCount] = useState(2)

    const generate = () => {
        let result = ''
        if (type === 'paragraphs') result = Array.from({ length: count }, genParagraph).join('\n\n')
        else if (type === 'sentences') result = Array.from({ length: count }, genSentence).join(' ')
        else result = genWords(count)
        setOutput({ input: `${count} ${type}`, output: result })
    }

    const clear = () => clearOutput()

    return (
        <ToolLayout toolId="lorem-ipsum">
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Type</label>
                    <Dropdown options={['paragraphs', 'sentences', 'words']} value={type} onChange={v => setType(v as LoremType)} />
                </div>
                <Spinner label="Count" value={count} onChange={setCount} min={1} max={50} />
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={generate} icon={<RefreshCw size={13} />}>Generate</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            <ToolOutput fields={[{ label: 'Lorem Ipsum', value: typeof output?.output === 'string' ? output.output : '' }]} />
        </ToolLayout>
    )
}
