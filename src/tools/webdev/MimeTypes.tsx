import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { useTool } from '@/hooks/useTool'
import { CopyButton } from '@/components/ui/CopyButton'

const MIME_TYPES: Array<{ ext: string; mime: string; category: string; description: string }> = [
    // Text
    { ext: '.html', mime: 'text/html', category: 'Text', description: 'HTML document' },
    { ext: '.css', mime: 'text/css', category: 'Text', description: 'Cascading Style Sheets' },
    { ext: '.js', mime: 'text/javascript', category: 'Text', description: 'JavaScript' },
    { ext: '.ts', mime: 'text/typescript', category: 'Text', description: 'TypeScript' },
    { ext: '.txt', mime: 'text/plain', category: 'Text', description: 'Plain text' },
    { ext: '.csv', mime: 'text/csv', category: 'Text', description: 'Comma-Separated Values' },
    { ext: '.xml', mime: 'application/xml', category: 'Application', description: 'XML document' },
    { ext: '.json', mime: 'application/json', category: 'Application', description: 'JSON data' },
    { ext: '.pdf', mime: 'application/pdf', category: 'Application', description: 'PDF document' },
    { ext: '.zip', mime: 'application/zip', category: 'Application', description: 'ZIP archive' },
    { ext: '.gz', mime: 'application/gzip', category: 'Application', description: 'Gzip archive' },
    { ext: '.wasm', mime: 'application/wasm', category: 'Application', description: 'WebAssembly' },
    { ext: '.yaml', mime: 'application/yaml', category: 'Application', description: 'YAML document' },
    // Images
    { ext: '.png', mime: 'image/png', category: 'Image', description: 'PNG image' },
    { ext: '.jpg', mime: 'image/jpeg', category: 'Image', description: 'JPEG image' },
    { ext: '.svg', mime: 'image/svg+xml', category: 'Image', description: 'SVG vector image' },
    { ext: '.gif', mime: 'image/gif', category: 'Image', description: 'GIF image' },
    { ext: '.webp', mime: 'image/webp', category: 'Image', description: 'WebP image' },
    { ext: '.ico', mime: 'image/x-icon', category: 'Image', description: 'Icon image' },
    { ext: '.avif', mime: 'image/avif', category: 'Image', description: 'AVIF image' },
    // Audio / Video
    { ext: '.mp3', mime: 'audio/mpeg', category: 'Audio', description: 'MP3 audio' },
    { ext: '.wav', mime: 'audio/wav', category: 'Audio', description: 'WAV audio' },
    { ext: '.ogg', mime: 'audio/ogg', category: 'Audio', description: 'Ogg audio' },
    { ext: '.mp4', mime: 'video/mp4', category: 'Video', description: 'MP4 video' },
    { ext: '.webm', mime: 'video/webm', category: 'Video', description: 'WebM video' },
    // Fonts
    { ext: '.woff', mime: 'font/woff', category: 'Font', description: 'Web Open Font Format' },
    { ext: '.woff2', mime: 'font/woff2', category: 'Font', description: 'WOFF2 font' },
    { ext: '.ttf', mime: 'font/ttf', category: 'Font', description: 'TrueType font' },
]

export default function MimeTypes() {
    const { clearOutput } = useTool('mime-types')
    const [search, setSearch] = useState('')

    const filtered = MIME_TYPES.filter(m =>
        !search ||
        m.ext.includes(search.toLowerCase()) ||
        m.mime.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <ToolLayout toolId="mime-types">
            <input
                style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '8px 14px', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)', width: '100%' }}
                value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by extension or MIME type…"
            />
            <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginTop: 'var(--space-2)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', padding: '8px 16px', background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span style={{ width: 64 }}>Ext</span>
                    <span style={{ flex: 1 }}>MIME Type</span>
                    <span style={{ flex: 1 }}>Description</span>
                </div>
                {filtered.map((m, i) => (
                    <div key={m.ext} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '8px 16px', background: i % 2 === 0 ? 'transparent' : 'var(--color-bg-card)', borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                        <span style={{ width: 64, fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-medium)', color: 'var(--color-accent)', fontSize: 'var(--text-sm)' }}>{m.ext}</span>
                        <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-code)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            {m.mime}
                            <CopyButton text={m.mime} label="" size="sm" />
                        </span>
                        <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{m.description}</span>
                    </div>
                ))}
            </div>
        </ToolLayout>
    )
}
