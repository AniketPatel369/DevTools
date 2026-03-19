import { DiffViewer } from '@/components/tool/DiffViewer'

export default function SqlDiff() {
    const onFormat = (val: string) => {
        if (!val.trim()) return ''
        // Basic SQL normalization: uppercase keywords, space out common parts
        const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT']
        let sql = val.trim().replace(/\s+/g, ' ')
        
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi')
            sql = sql.replace(regex, `\n${kw}`)
        });
        
        return sql.split('\n').map(line => line.trim()).filter(Boolean).join('\n')
    }

    return (
        <DiffViewer
            toolId="sql-diff"
            titleA="SQL A"
            titleB="SQL B"
            onFormat={onFormat}
        />
    )
}
