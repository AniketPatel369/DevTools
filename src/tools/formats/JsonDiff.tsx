import { DiffViewer } from '@/components/tool/DiffViewer'

export default function JsonDiff() {
    const onFormat = (val: string) => {
        if (!val.trim()) return ''
        const obj = JSON.parse(val)
        // Sort keys to ensure meaningful diff
        const sortKeys = (obj: any): any => {
            if (Array.isArray(obj)) return obj.map(sortKeys)
            if (obj && typeof obj === 'object') {
                return Object.fromEntries(
                    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sortKeys(v)])
                )
            }
            return obj
        }
        return JSON.stringify(sortKeys(obj), null, 2)
    }

    return (
        <DiffViewer
            toolId="json-diff"
            titleA="JSON A"
            titleB="JSON B"
            onFormat={onFormat}
        />
    )
}
