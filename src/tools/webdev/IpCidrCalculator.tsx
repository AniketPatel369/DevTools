import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolInput } from '@/components/tool/ToolInput'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { useTool } from '@/hooks/useTool'
import { Play, Trash2 } from 'lucide-react'

function cidrCalc(cidr: string): OutputField[] {
    const [ipStr, prefixStr] = cidr.trim().split('/')
    const prefix = parseInt(prefixStr)
    if (isNaN(prefix) || prefix < 0 || prefix > 32) throw new Error('Invalid prefix length (must be 0–32)')

    const ipParts = ipStr.split('.').map(Number)
    if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) throw new Error('Invalid IP address')

    const ipNum = ipParts.reduce((acc, p) => (acc << 8) | p, 0) >>> 0
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
    const network = (ipNum & mask) >>> 0
    const broad = (network | ~mask) >>> 0
    const first = prefix < 31 ? (network + 1) >>> 0 : network
    const last = prefix < 31 ? (broad - 1) >>> 0 : broad
    const hosts = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.pow(2, 32 - prefix) - 2

    const n2ip = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
    const maskIP = n2ip(mask)

    return [
        { label: 'Network Address', value: n2ip(network) },
        { label: 'Broadcast Address', value: n2ip(broad) },
        { label: 'Subnet Mask', value: maskIP },
        { label: 'Wildcard Mask', value: n2ip(~mask >>> 0) },
        { label: 'First Usable Host', value: n2ip(first) },
        { label: 'Last Usable Host', value: n2ip(last) },
        { label: 'Total Hosts', value: Math.pow(2, 32 - prefix).toLocaleString() },
        { label: 'Usable Hosts', value: hosts.toLocaleString() },
        { label: 'IP Range', value: `${n2ip(network)} – ${n2ip(broad)}` },
        { label: 'IP Class', value: getClass(ipParts[0]) },
    ]
}

function getClass(first: number): string {
    if (first < 128) return 'Class A (0.0.0.0 – 127.255.255.255)'
    if (first < 192) return 'Class B (128.0.0.0 – 191.255.255.255)'
    if (first < 224) return 'Class C (192.0.0.0 – 223.255.255.255)'
    if (first < 240) return 'Class D (224.0.0.0 – 239.255.255.255) — Multicast'
    return 'Class E (240.0.0.0 – 255.255.255.255) — Reserved'
}

export default function IpCidrCalculator() {
    const { output, setOutput, clearOutput } = useTool('ip-cidr-calculator')
    const [input, setInput] = useState(output?.input ?? '')
    const [error, setError] = useState('')

    const run = () => {
        setError('')
        try {
            const fields = cidrCalc(input)
            setOutput({ input, output: JSON.stringify(fields) })
        } catch (e) { setError((e as Error).message) }
    }

    const clear = () => { setInput(''); clearOutput(); setError('') }

    let fields: OutputField[] = []
    if (output?.output && typeof output.output === 'string') {
        try { fields = JSON.parse(output.output) } catch { /* noop */ }
    }

    return (
        <ToolLayout toolId="ip-cidr-calculator">
            <ToolInput value={input} onChange={setInput} onClear={clear} placeholder="192.168.1.0/24" minHeight="60px" />
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-1)' }}>
                {['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '10.0.0.0/16'].map(e => (
                    <button key={e} onClick={() => setInput(e)} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        {e}
                    </button>
                ))}
            </div>
            <div className="tool-actions">
                <Button onClick={run} icon={<Play size={13} />}>Calculate</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={13} />}>Clear</Button>
            </div>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>{error}</div>}
            <ToolOutput fields={fields} />
        </ToolLayout>
    )
}
