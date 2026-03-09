import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { useTool } from '@/hooks/useTool'
import { CopyButton } from '@/components/ui/CopyButton'

interface Pattern { name: string; pattern: string; flags: string; description: string; example: string }
type Category = { title: string; patterns: Pattern[] }

const REGEX_CATEGORIES: Category[] = [
    {
        title: 'Validation',
        patterns: [
            { name: 'Email', pattern: '^[\\w.+\\-]+@[a-zA-Z\\d\\-]+\\.[a-zA-Z]{2,}$', flags: 'i', description: 'Standard email address', example: 'user@example.com' },
            { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[\\w\\-\\.]+\\.[a-zA-Z]{2,}(\\/\\S*)?', flags: 'i', description: 'HTTP/HTTPS URL', example: 'https://example.com/path' },
            { name: 'IPv4', pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', flags: '', description: 'IPv4 address', example: '192.168.1.1' },
            { name: 'IPv6', pattern: '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}', flags: 'i', description: 'IPv6 address (full)', example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
            { name: 'Phone (intl)', pattern: '^\\+?[1-9]\\d{6,14}$', flags: '', description: 'International phone number', example: '+14155552671' },
            { name: 'Zip Code (US)', pattern: '^\\d{5}(-\\d{4})?$', flags: '', description: 'US ZIP code (5 or 9 digit)', example: '90210-1234' },
            { name: 'Credit Card', pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$', flags: '', description: 'Visa / Mastercard / Amex', example: '4111111111111111' },
            { name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w]).{8,}$', flags: '', description: '8+ chars, upper, lower, digit, special', example: 'Passw0rd!' },
        ]
    },
    {
        title: 'Identifiers',
        patterns: [
            { name: 'UUID v4', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}', flags: 'i', description: 'UUID v4 format', example: '550e8400-e29b-41d4-a716-446655440000' },
            { name: 'Hex Color', pattern: '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$', flags: '', description: '3 or 6 digit hex color', example: '#FF6600' },
            { name: 'SHA-256 Hash', pattern: '^[a-f0-9]{64}$', flags: 'i', description: 'SHA-256 hex digest', example: 'a665a45920422f9d417e4867efdc4fb8...' },
            { name: 'JWT', pattern: '^[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}$', flags: '', description: 'JSON Web Token 3-part structure', example: 'header.payload.sig' },
            { name: 'Semver', pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(-(0|[1-9A-Za-z-][\\w-]*)([.][\\w-]+)*)?(\\+[\\w-]+([.][\\w-]+)*)?$', flags: '', description: 'Semantic versioning', example: '1.2.3-alpha+build.1' },
            { name: 'Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', flags: '', description: 'URL-safe slug string', example: 'my-blog-post-title' },
        ]
    },
    {
        title: 'Numbers & Dates',
        patterns: [
            { name: 'Integer', pattern: '^-?\\d+$', flags: '', description: 'Positive or negative integer', example: '-42' },
            { name: 'Decimal', pattern: '^-?\\d+(\\.\\d+)?$', flags: '', description: 'Floating-point number', example: '3.14' },
            { name: 'Currency (USD)', pattern: '^\\$?[0-9]{1,3}(?:,?[0-9]{3})*(?:\\.[0-9]{2})?$', flags: '', description: 'US dollar amount', example: '$1,234.56' },
            { name: 'Date YYYY-MM-DD', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', flags: '', description: 'ISO date format', example: '2024-03-08' },
            { name: 'Date MM/DD/YYYY', pattern: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$', flags: '', description: 'US date format', example: '03/08/2024' },
            { name: 'Time HH:MM', pattern: '^([01]?\\d|2[0-3]):[0-5]\\d$', flags: '', description: '24-hour time', example: '14:30' },
        ]
    },
    {
        title: 'Text & Strings',
        patterns: [
            { name: 'Only Letters', pattern: '^[A-Za-z]+$', flags: '', description: 'Alphabetic characters only', example: 'HelloWorld' },
            { name: 'Alphanumeric', pattern: '^[A-Za-z0-9]+$', flags: '', description: 'Letters and digits only', example: 'ABC123' },
            { name: 'No Whitespace', pattern: '^\\S+$', flags: '', description: 'No spaces or newlines', example: 'compact_string' },
            { name: 'Camel Case', pattern: '^[a-z][a-zA-Z0-9]*$', flags: '', description: 'camelCase identifier', example: 'myVariableName' },
            { name: 'Snake Case', pattern: '^[a-z][a-z0-9]*(_[a-z0-9]+)*$', flags: '', description: 'snake_case identifier', example: 'my_variable_name' },
            { name: 'HTML Tag', pattern: '<[a-zA-Z][^>]*>.*?<\\/[a-zA-Z]+>', flags: 's', description: 'Matches an HTML element', example: '<p class="foo">text</p>' },
        ]
    },
]

export default function RegexLibrary() {
    useTool('regex-library')
    const [search, setSearch] = useState('')
    const [testInput, setTestInput] = useState('')
    const [activeRex, setActiveRex] = useState<string | null>(null)

    const q = search.toLowerCase()
    const cats = REGEX_CATEGORIES.map(cat => ({
        ...cat,
        patterns: cat.patterns.filter(p =>
            !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        )
    })).filter(c => c.patterns.length > 0)

    const testMatch = (pattern: string, flags: string) => {
        if (!testInput) return null
        try { return new RegExp(pattern, flags).test(testInput) } catch { return null }
    }

    return (
        <ToolLayout toolId="regex-library">
            {/* Search + test bar */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <input
                    style={{ flex: 1, minWidth: 180, background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '8px 14px', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)' }}
                    value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patterns…"
                />
                <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg-input)', border: `1px solid ${activeRex ? (testMatch(activeRex.split('|')[0], activeRex.split('|')[1]) ? 'var(--color-success)' : 'var(--color-danger)') : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', padding: '8px 14px', transition: 'border-color 0.2s' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', whiteSpace: 'nowrap' }}>Test:</span>
                    <input
                        style={{ flex: 1, background: 'transparent', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)' }}
                        value={testInput} onChange={e => setTestInput(e.target.value)} placeholder="Type to test selected pattern…"
                    />
                    {activeRex && testInput && (
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: testMatch(activeRex.split('|')[0], activeRex.split('|')[1]) ? 'var(--color-success)' : 'var(--color-danger)', whiteSpace: 'nowrap' }}>
                            {testMatch(activeRex.split('|')[0], activeRex.split('|')[1]) ? '✓ Match' : '✗ No match'}
                        </span>
                    )}
                </div>
            </div>

            {/* Pattern categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {cats.map(cat => (
                    <div key={cat.title}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-formats)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>
                            {cat.title}
                        </div>
                        <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                            {cat.patterns.map((p, i, arr) => {
                                const rexKey = `${p.pattern}|${p.flags}`
                                const isActive = activeRex === rexKey
                                const matched = isActive && testInput ? testMatch(p.pattern, p.flags) : null
                                return (
                                    <div
                                        key={p.name}
                                        onClick={() => setActiveRex(isActive ? null : rexKey)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
                                            padding: '10px 16px',
                                            background: isActive ? 'var(--color-bg-hover)' : i % 2 === 0 ? 'var(--color-bg-card)' : 'transparent',
                                            borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                                            cursor: 'pointer',
                                            transition: 'background var(--transition-fast)',
                                            borderLeft: `3px solid ${isActive ? (matched === null ? 'var(--color-accent)' : matched ? 'var(--color-success)' : 'var(--color-danger)') : 'transparent'}`,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', minWidth: 120, fontSize: 'var(--text-sm)' }}>{p.name}</span>
                                            <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-code)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', wordBreak: 'break-all' }}>
                                                /{p.pattern}/{p.flags}
                                            </code>
                                            <CopyButton text={`/${p.pattern}/${p.flags}`} label="" size="sm" />
                                        </div>
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                            {p.description} &nbsp;·&nbsp; <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>e.g. {p.example}</span>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
                {cats.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-faint)', padding: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>
                        No patterns match "{search}"
                    </div>
                )}
            </div>
        </ToolLayout>
    )
}
