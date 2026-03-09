import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput, type OutputField } from '@/components/tool/ToolOutput'
import { useTool } from '@/hooks/useTool'

const HTTP_CODES: Array<{ code: number; text: string; description: string; category: string }> = [
    // 1xx
    { code: 100, text: 'Continue', description: 'The server has received the request headers and the client should proceed to send the body.', category: '1xx Informational' },
    { code: 101, text: 'Switching Protocols', description: 'The requester has asked the server to switch protocols.', category: '1xx Informational' },
    // 2xx
    { code: 200, text: 'OK', description: 'Standard successful response.', category: '2xx Success' },
    { code: 201, text: 'Created', description: 'Request succeeded and a new resource was created.', category: '2xx Success' },
    { code: 204, text: 'No Content', description: 'The server processed the request successfully but returns no content.', category: '2xx Success' },
    { code: 206, text: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header.', category: '2xx Success' },
    // 3xx
    { code: 301, text: 'Moved Permanently', description: 'The URL of the requested resource has been changed permanently.', category: '3xx Redirection' },
    { code: 302, text: 'Found', description: 'The URI of the requested resource has been changed temporarily.', category: '3xx Redirection' },
    { code: 304, text: 'Not Modified', description: 'The resource has not been modified since the last request.', category: '3xx Redirection' },
    // 4xx
    { code: 400, text: 'Bad Request', description: 'The server cannot process the request due to malformed syntax.', category: '4xx Client Error' },
    { code: 401, text: 'Unauthorized', description: 'Authentication is required and has failed or not been provided.', category: '4xx Client Error' },
    { code: 403, text: 'Forbidden', description: 'The client does not have access rights to the content.', category: '4xx Client Error' },
    { code: 404, text: 'Not Found', description: 'The server cannot find the requested resource.', category: '4xx Client Error' },
    { code: 405, text: 'Method Not Allowed', description: 'The request method is known but not supported by the target resource.', category: '4xx Client Error' },
    { code: 409, text: 'Conflict', description: 'The request conflicts with the current state of the server.', category: '4xx Client Error' },
    { code: 410, text: 'Gone', description: 'The requested resource is no longer available and will not be available again.', category: '4xx Client Error' },
    { code: 422, text: 'Unprocessable Entity', description: 'The request was well-formed but semantically erroneous.', category: '4xx Client Error' },
    { code: 429, text: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time (rate limiting).', category: '4xx Client Error' },
    // 5xx
    { code: 500, text: 'Internal Server Error', description: 'The server encountered an unexpected condition.', category: '5xx Server Error' },
    { code: 501, text: 'Not Implemented', description: 'The server does not support the functionality to fulfill the request.', category: '5xx Server Error' },
    { code: 502, text: 'Bad Gateway', description: 'The server received an invalid response from an upstream server.', category: '5xx Server Error' },
    { code: 503, text: 'Service Unavailable', description: 'The server is not ready to handle the request.', category: '5xx Server Error' },
    { code: 504, text: 'Gateway Timeout', description: 'The server did not receive a timely response from an upstream server.', category: '5xx Server Error' },
]

const CAT_COLORS: Record<string, string> = {
    '1xx Informational': 'var(--color-text-secondary)',
    '2xx Success': 'var(--color-success)',
    '3xx Redirection': 'var(--color-warning)',
    '4xx Client Error': 'var(--color-webdev)',
    '5xx Server Error': 'var(--color-danger)',
}

export default function HttpStatusCodes() {
    const { clearOutput } = useTool('http-status-codes')
    const [search, setSearch] = useState('')

    const filtered = HTTP_CODES.filter(c =>
        !search ||
        String(c.code).includes(search) ||
        c.text.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    )

    const categories = [...new Set(filtered.map(c => c.category))]

    return (
        <ToolLayout toolId="http-status-codes">
            <input
                style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '8px 14px', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)', width: '100%' }}
                value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code, name, or description…"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                {categories.map(cat => (
                    <div key={cat}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: CAT_COLORS[cat], textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>{cat}</div>
                        <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                            {filtered.filter(c => c.category === cat).map((c, i, arr) => (
                                <div key={c.code} style={{ display: 'flex', gap: 'var(--space-4)', padding: '10px 16px', background: i % 2 === 0 ? 'var(--color-bg-card)' : 'transparent', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', color: CAT_COLORS[cat], minWidth: 36 }}>{c.code}</span>
                                    <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-text-primary)', minWidth: 160 }}>{c.text}</span>
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{c.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ToolLayout>
    )
}
