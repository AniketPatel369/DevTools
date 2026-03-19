import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Package, Play, Trash2 } from 'lucide-react'

type Stack = 'Node.js' | 'Python' | 'Java/Maven' | 'Go' | 'Nginx'

export default function DockerScaffold() {
    const [stack, setStack] = useState<Stack>('Node.js')
    const [compose, setCompose] = useState(true)
    const [result, setResult] = useState<{ dockerfile: string; compose: string } | null>(null)

    const generate = () => {
        let df = ''
        let cp = ''
        
        if (stack === 'Node.js') {
            df = `FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]`
            cp = `version: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    volumes:\n      - .:/app\n      - /app/node_modules`
        } else if (stack === 'Python') {
            df = `FROM python:3.10-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD ["python", "app.py"]`
            cp = `version: '3.8'\nservices:\n  api:\n    build: .\n    ports:\n      - "8000:8000"\n    volumes:\n      - .:/app`
        } else if (stack === 'Java/Maven') {
            df = `FROM maven:3.8-openjdk-17 AS build\nWORKDIR /app\nCOPY pom.xml .\nRUN mvn dependency:go-offline\nCOPY src ./src\nRUN mvn package\n\nFROM openjdk:17-slim\nWORKDIR /app\nCOPY --from=build /app/target/*.jar app.jar\nEXPOSE 8080\nENTRYPOINT ["java", "-jar", "app.jar"]`
            cp = `version: '3.8'\nservices:\n  server:\n    build: .\n    ports:\n      - "8080:8080"`
        } else if (stack === 'Go') {
            df = `FROM golang:1.21-alpine AS build\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN go build -o main .\n\nFROM alpine:latest\nWORKDIR /app\nCOPY --from=build /app/main .\nEXPOSE 8080\nCMD ["./main"]`
            cp = `version: '3.8'\nservices:\n  backend:\n    build: .\n    ports:\n      - "8080:8080"`
        } else if (stack === 'Nginx') {
            df = `FROM nginx:alpine\nCOPY . /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`
            cp = `version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - "80:80"`
        }
        
        setResult({ dockerfile: df, compose: cp })
    }

    const clear = () => setResult(null)

    return (
        <ToolLayout toolId="docker-scaffold">
            <ToolOptions>
                <div className="tool-option-group">
                    <label>App Stack</label>
                    <Toggle options={['Node.js', 'Python', 'Java/Maven', 'Go', 'Nginx']} value={stack} onChange={v => setStack(v as Stack)} />
                </div>
            </ToolOptions>

            <div className="tool-actions">
                <Button onClick={generate} icon={<Play size={14} />}>Generate Files</Button>
                <Button variant="danger" onClick={clear} icon={<Trash2 size={14} />}>Clear</Button>
            </div>

            {result && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                    <ToolOutput fields={[{ label: 'Dockerfile', value: result.dockerfile }]} />
                    {compose && <ToolOutput fields={[{ label: 'docker-compose.yml', value: result.compose }]} />}
                </div>
            )}
        </ToolLayout>
    )
}
