// ============================================================
// DEVTOOLS — Text Utils
// Shared text manipulation used by Encoding tools.
// ============================================================

// ---- Case Conversion ----

export type TextCase =
    | 'camelCase' | 'snake_case' | 'UPPER_SNAKE'
    | 'kebab-case' | 'PascalCase' | 'Title Case'
    | 'UPPERCASE' | 'lowercase' | 'dot.case'

/** Split text into words, handling camel, snake, kebab, and space-separated */
const splitWords = (s: string): string[] =>
    s
        .replace(/([a-z])([A-Z])/g, '$1 $2')      // camel → space
        .replace(/[_\-\.]+/g, ' ')                 // snake/kebab/dot → space
        .split(/\s+/)
        .filter(Boolean)

export function toCase(text: string, targetCase: TextCase): string {
    const words = splitWords(text)
    if (!words.length) return text
    switch (targetCase) {
        case 'camelCase': return words[0].toLowerCase() + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
        case 'PascalCase': return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
        case 'snake_case': return words.map(w => w.toLowerCase()).join('_')
        case 'UPPER_SNAKE': return words.map(w => w.toUpperCase()).join('_')
        case 'kebab-case': return words.map(w => w.toLowerCase()).join('-')
        case 'dot.case': return words.map(w => w.toLowerCase()).join('.')
        case 'Title Case': return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        case 'UPPERCASE': return text.toUpperCase()
        case 'lowercase': return text.toLowerCase()
        default: return text
    }
}

// ---- Slugify ----

export function slugify(text: string, separator = '-'): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // remove diacritics
        .replace(/[^a-z0-9\s-_]/g, '')
        .trim()
        .replace(/[\s_-]+/g, separator)
}

// ---- Escape / Unescape ----

export type EscapeTarget = 'JSON' | 'SQL' | 'Regex' | 'Shell' | 'CSV'

export function escapeText(text: string, target: EscapeTarget): string {
    switch (target) {
        case 'JSON': return JSON.stringify(text).slice(1, -1)
        case 'SQL': return text.replace(/'/g, "''")
        case 'Regex': return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        case 'Shell': return `'${text.replace(/'/g, "'\\''")}'`
        case 'CSV': return text.includes(',') || text.includes('"') || text.includes('\n')
            ? `"${text.replace(/"/g, '""')}"` : text
        default: return text
    }
}

export function unescapeText(text: string, target: EscapeTarget): string {
    switch (target) {
        case 'JSON': try { return JSON.parse(`"${text}"`) } catch { return text }
        case 'SQL': return text.replace(/''/g, "'")
        case 'CSV': return text.replace(/^"|"$/g, '').replace(/""/g, '"')
        default: return text
    }
}

// ---- Word / Character counting ----

export interface TextStats {
    characters: number
    characterNoSpaces: number
    words: number
    lines: number
    sentences: number
    paragraphs: number
    bytes: number
    readingTimeMin: number
}

export function analyzeText(text: string): TextStats {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim()).length
    const bytes = new TextEncoder().encode(text).length
    return {
        characters: text.length,
        characterNoSpaces: text.replace(/\s/g, '').length,
        words,
        lines: text.split('\n').length,
        sentences,
        paragraphs,
        bytes,
        readingTimeMin: Math.ceil(words / 200),
    }
}

// ---- Line operations ----

export type SortOrder = 'A → Z' | 'Z → A' | 'Numeric Asc' | 'Numeric Desc'

export function sortLines(text: string, order: SortOrder, trim = true): string {
    const lines = text.split('\n').map(l => (trim ? l.trim() : l))
    switch (order) {
        case 'A → Z': lines.sort((a, b) => a.localeCompare(b)); break
        case 'Z → A': lines.sort((a, b) => b.localeCompare(a)); break
        case 'Numeric Asc': lines.sort((a, b) => parseFloat(a) - parseFloat(b)); break
        case 'Numeric Desc': lines.sort((a, b) => parseFloat(b) - parseFloat(a)); break
    }
    return lines.join('\n')
}

export function removeDuplicateLines(text: string, caseSensitive = true, trim = true): string {
    const lines = text.split('\n').map(l => (trim ? l.trim() : l))
    const seen = new Set<string>()
    return lines
        .filter(l => {
            const key = caseSensitive ? l : l.toLowerCase()
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
        .join('\n')
}

// ---- Morse code ----

const MORSE_MAP: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': `-.--.-`,
}
const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]))

export function textToMorse(text: string): string {
    return text.toUpperCase().split('').map(c => c === ' ' ? '/' : (MORSE_MAP[c] ?? '?')).join(' ')
}

export function morseToText(morse: string): string {
    return morse.split(' ').map(code => code === '/' ? ' ' : (MORSE_REVERSE[code] ?? '?')).join('')
}

// ---- ROT13 ----

export function rot13(text: string): string {
    return text.replace(/[a-zA-Z]/g, c => {
        const base = c <= 'Z' ? 65 : 97
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
    })
}
