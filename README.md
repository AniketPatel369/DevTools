<div align="center">

# 🛠️ DevTools

**A fast, offline-first developer toolkit — 58 tools, one app.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🐛 Report Bug](https://github.com/AniketPatel369/DevTools/issues) · [💡 Request Feature](https://github.com/AniketPatel369/DevTools/issues)

</div>

---

## ✨ Features

- ⚡ **Instant** — all processing runs locally in the browser, zero network calls
- 🌓 **Dark / Light / System** theme support
- 🔍 **Searchable sidebar** with keyboard shortcut
- ⭐ **Favourites** — pin your most-used tools
- 📋 **One-click copy** on every output field
- ⤢ **Fullscreen output** view for large payloads
- 💾 **State persistence** — last input/output survives page refresh

---

## 🧰 Tool Categories

### 🔤 Encoding (13 tools)
| Tool | Description |
|------|-------------|
| Base64 Encode / Decode | Encode and decode Base64 strings and files |
| URL Encode / Decode | Percent-encode and decode URLs |
| HTML Entity Encode | Escape / unescape HTML special characters |
| Unicode Escape | Convert text to/from Unicode escape sequences |
| Binary / Hex / Octal | Convert numbers between number bases |
| JWT Decoder | Decode & inspect JSON Web Tokens |
| Text Case Converter | camelCase, snake_case, UPPER, Title Case & more |
| Text Escape / Unescape | Escape special chars for JSON, SQL, Regex, etc. |
| Duplicate Line Remover | Strip duplicate lines from text |
| Line Sorter | Sort lines alphabetically, reverse, or shuffle |
| ROT13 Cipher | Rotate text by 13 characters |
| Slugify | Convert strings to URL-safe slugs |
| Morse Code | Encode / decode Morse code |

### #️⃣ Hashing & Crypto (9 tools)
| Tool | Description |
|------|-------------|
| Hash Generator | MD5, SHA-1, SHA-256, SHA-512 |
| HMAC Generator | Generate keyed-hash message authentication codes |
| Password Hash | bcrypt / Argon2 password hashing |
| Checksum | File / string integrity checksums |
| UUID Generator | Generate v1, v4, and ULID identifiers |
| Nanoid | Customisable unique string IDs |
| Random String | Cryptographically secure random strings |
| JWT Debugger | Build, sign, and verify JWTs |
| Unix Permissions | chmod calculator & permission visualiser |

### 📄 Formats (18 tools)
| Tool | Description |
|------|-------------|
| JSON Formatter | Prettify and minify JSON |
| JSON ↔ YAML | Convert between JSON and YAML |
| JSON ↔ CSV | Convert tabular data formats |
| JSON → TypeScript | Generate TypeScript interfaces from JSON |
| JSON Path Query | Query JSON with JSONPath expressions |
| YAML Formatter | Format and validate YAML |
| XML Formatter | Prettify and validate XML |
| XML ↔ JSON | Convert between XML and JSON |
| TOML Parser | Parse TOML config files |
| GraphQL Formatter | Format GraphQL queries and schemas |
| SQL Formatter | Beautify SQL queries |
| Markdown → HTML | Preview and convert Markdown |
| Regex Tester | Live regex testing with match highlighting |
| Regex Library | Searchable library of common patterns |
| Text Diff | Side-by-side text comparison |
| String Inspector | Character counts, byte size, entropy |
| Cron Parser | Human-readable cron expression explainer |
| CSV ↔ JSON | Convert CSV to JSON and back |

### 🌐 Web Dev (18 tools)
| Tool | Description |
|------|-------------|
| Color Picker | Visual colour picker with HEX / RGB / HSL output |
| Color Converter | Convert between colour formats |
| QR Code Generator | Generate QR codes from any text or URL |
| URL Parser | Break down and inspect URL components |
| Query String Builder | Build and parse query strings |
| cURL → Code | Convert cURL commands to fetch / axios / etc. |
| HTML Minifier | Minify HTML for production |
| CSS Minifier | Minify CSS |
| JS Minifier | Minify JavaScript |
| Data URI | Encode files to Base64 data URIs |
| SVG Path Analyser | Inspect and analyse SVG path data |
| Timestamp Converter | Unix timestamp ↔ human-readable date |
| IP / CIDR Calculator | Subnet and IP range calculator |
| HTTP Status Codes | Reference for all HTTP status codes |
| MIME Types | Look up file extension MIME types |
| Lorem Ipsum | Customisable placeholder text generator |
| Markdown Preview | Live Markdown preview |
| Gitignore Generator | Generate `.gitignore` files by project type |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/AniketPatel369/DevTools.git
cd DevTools

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Bundler | Vite 7 |
| Routing | React Router v7 |
| State | Zustand |
| Icons | Lucide React |
| Styling | Vanilla CSS with design tokens |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # App shell, sidebar, topbar
│   ├── tool/         # ToolLayout, ToolInput, ToolOutput, ToolHeader
│   └── ui/           # Button, Toggle, Dropdown, CopyButton…
├── data/             # Tool registry and category metadata
├── hooks/            # useCharCount, useTool, useTheme…
├── pages/            # HomePage
├── store/            # Zustand stores (favourites, history)
├── styles/           # tokens.css, layout.css, components.css…
├── tools/
│   ├── encoding/     # 13 encoding tools
│   ├── formats/      # 18 format tools
│   ├── hashing/      # 9 hashing/crypto tools
│   └── webdev/       # 18 web dev tools
└── utils/            # crypto, text, format helpers
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/my-tool`
3. Commit your changes: `git commit -m 'feat: add my tool'`
4. Push to the branch: `git push origin feat/my-tool`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/AniketPatel369">Aniket Patel</a>
</div>
