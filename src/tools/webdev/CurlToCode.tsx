import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

type Lang = 'JavaScript (fetch)' | 'Python (requests)' | 'Node.js (axios)' | 'PHP (cURL)'

function parseCurl(input: string): { method: string; url: string; headers: Record<string, string>; data: string } {
    const parts = input.replace(/\\\n/g, ' ').trim()
    const method = (parts.match(/-X\s+(\w+)/)?.[1] ?? (parts.includes('-d') || parts.includes('--data') ? 'POST' : 'GET')).toUpperCase()
    const url = parts.match(/curl\s+(?:-\S+\s+)*['"]?([^\s'"]+)/)?.[1] ?? ''
    const headers: Record<string, string> = {}
        ;[...parts.matchAll(/-H\s+['"]([^'"]+)['"]/g)].forEach(m => {
            const [k, ...v] = m[1].split(':')
            headers[k.trim()] = v.join(':').trim()
        })
    const data = parts.match(/(?:--data(?:-raw)?|-d)\s+['"]?([\s\S]+?)['"]?\s*(?:-|$)/)?.[1] ?? ''
    return { method, url, headers, data: data.replace(/\\n/g, '\n') }
}

function toFetch(method: string, url: string, headers: Record<string, string>, data: string): string {
    const h = JSON.stringify(headers, null, 2)
    const body = data ? `,\n  body: ${JSON.stringify(data)}` : ''
    return `const response = await fetch('${url}', {\n  method: '${method}',\n  headers: ${h}${body}\n});\nconst result = await response.json();\nconsole.log(result);`
}

function toPython(method: string, url: string, headers: Record<string, string>, data: string): string {
    const h = JSON.stringify(headers, null, 2)
    const body = data ? `\ndata = ${JSON.stringify(data)}` : ''
    const dataArg = data ? ', json=data' : ''
    return `import requests\n\nheaders = ${h}${body}\nresponse = requests.${method.toLowerCase()}('${url}', headers=headers${dataArg})\nprint(response.json())`
}

function toAxios(method: string, url: string, headers: Record<string, string>, data: string): string {
    const h = JSON.stringify(headers, null, 2)
    const body = data ? `,\n  data: ${JSON.stringify(data)}` : ''
    return `const axios = require('axios');\n\nconst response = await axios({\n  method: '${method.toLowerCase()}',\n  url: '${url}',\n  headers: ${h}${body}\n});\nconsole.log(response.data);`
}

function toPhp(method: string, url: string, headers: Record<string, string>, data: string): string {
    const h = Object.entries(headers).map(([k, v]) => `    "${k}: ${v}"`).join(',\n')
    const body = data ? `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${data.replace(/'/g, "\\'")}');` : ''
    return `$ch = curl_init();\ncurl_setopt($ch, CURLOPT_URL, '${url}');\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n${h}\n]);${body}\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$response = curl_exec($ch);\ncurl_close($ch);`
}

const LANGS: Lang[] = ['JavaScript (fetch)', 'Python (requests)', 'Node.js (axios)', 'PHP (cURL)']

export default function CurlToCode() {
    const { output, setOutput, clearOutput } = useTool('curl-to-code')
    const [input, setInput] = useState(output?.input ?? '')
    const [lang, setLang] = useState<Lang>('JavaScript (fetch)')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const { method, url, headers, data } = parseCurl(input)
            if (!url) throw new Error('Could not parse URL from cURL command')
            let code = ''
            if (lang === 'JavaScript (fetch)') code = toFetch(method, url, headers, data)
            else if (lang === 'Python (requests)') code = toPython(method, url, headers, data)
            else if (lang === 'Node.js (axios)') code = toAxios(method, url, headers, data)
            else code = toPhp(method, url, headers, data)
            const fields: OutputField[] = [
                { label: `${lang} Code`, value: code },
                { label: 'Parsed Method', value: method },
                { label: 'Parsed URL', value: url },
            ]
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="curl-to-code">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder={`curl -X POST https://api.example.com/data -H 'Content-Type: application/json' -d '{"key":"value"}'`} />
            <ToolOptions>
                <div className="tool-option-group">
                    <label>Target Language</label>
                    <Dropdown options={LANGS} value={lang} onChange={v => setLang(v as Lang)} />
                </div>
            </ToolOptions>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Convert</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
