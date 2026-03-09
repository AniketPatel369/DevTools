// ============================================================
// DEVTOOLS — Crypto Utils (Web Crypto API wrappers)
// All operations are async and use the native SubtleCrypto API.
// No third-party crypto libraries needed.
// ============================================================

const subtle = window.crypto.subtle

// ---- Helpers ----

/**
 * Encode a string to Uint8Array.
 * Cast to `Uint8Array<ArrayBuffer>` so it satisfies Web Crypto API's
 * BufferSource requirement (TextEncoder returns Uint8Array<ArrayBufferLike>).
 */
function encode(s: string): Uint8Array<ArrayBuffer> {
    return new TextEncoder().encode(s) as Uint8Array<ArrayBuffer>
}

/**
 * Convert an ArrayBuffer or Uint8Array to a lowercase hex string.
 * Accepts both types so randomBytes (which has a Uint8Array) can call it directly.
 */
function toHex(buf: ArrayBuffer | Uint8Array): string {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Convert an ArrayBuffer or Uint8Array to a Base64 string.
 * Uses a loop instead of spread to avoid stack-overflow on large buffers.
 */
function toBase64(buf: ArrayBuffer | Uint8Array): string {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

// ---- Exports ----

export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
export type OutputFormat = 'hex' | 'base64'

/** Hash a string using the given algorithm and return hex or base64. */
export async function hash(
    text: string,
    algo: HashAlgorithm = 'SHA-256',
    format: OutputFormat = 'hex'
): Promise<string> {
    const buf = await subtle.digest(algo, encode(text))
    return format === 'hex' ? toHex(buf) : toBase64(buf)
}

/** Generate an HMAC signature for `text` using the given `key`. */
export async function hmac(
    key: string,
    text: string,
    algo: HashAlgorithm = 'SHA-256',
    format: OutputFormat = 'hex'
): Promise<string> {
    const cryptoKey = await subtle.importKey(
        'raw',
        encode(key),
        { name: 'HMAC', hash: algo },
        false,
        ['sign']
    )
    const buf = await subtle.sign('HMAC', cryptoKey, encode(text))
    return format === 'hex' ? toHex(buf) : toBase64(buf)
}

/** Derive a key from a password using PBKDF2. */
export async function pbkdf2(
    password: string,
    salt: string,
    iterations: number,
    keyLengthBytes: number,
    algo: HashAlgorithm = 'SHA-256'
): Promise<{ derivedKey: string; algorithm: string }> {
    const baseKey = await subtle.importKey(
        'raw',
        encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    )
    const bits = await subtle.deriveBits(
        { name: 'PBKDF2', salt: encode(salt), iterations: iterations * 1000, hash: algo },
        baseKey,
        keyLengthBytes * 8
    )
    return {
        derivedKey: toHex(bits),
        algorithm: `PBKDF2-HMAC-${algo}`,
    }
}

/** Generate n cryptographically-random bytes and return as a hex string. */
export function randomBytes(n: number): string {
    const arr = new Uint8Array(n)
    window.crypto.getRandomValues(arr)
    return toHex(arr)   // pass Uint8Array directly — no .buffer needed
}

/** Generate a random hex salt of the given byte length (default 16). */
export function randomSalt(bytes = 16): string {
    return randomBytes(bytes)
}
