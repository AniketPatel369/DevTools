import { DiffViewer } from '@/components/tool/DiffViewer'

export default function XmlDiff() {
    const onFormat = (val: string) => {
        if (!val.trim()) return ''
        // Simple XML prettification
        let formatted = ''
        let indent = 0
        const tab = '  '
        const xml = val.replace(/>\s*</g, '><').trim()
        
        xml.split(/>(?=<)/).forEach(element => {
            if (element.match(/^\/\w/)) {
                indent--
            }
            formatted += tab.repeat(indent) + element + '>\n'
            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('<?')) {
                indent++
            }
        });
        return formatted.trim()
    }

    return (
        <DiffViewer
            toolId="xml-diff"
            titleA="XML A"
            titleB="XML B"
            onFormat={onFormat}
        />
    )
}
