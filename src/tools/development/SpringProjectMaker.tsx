import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { FolderCheck, Download, Package } from 'lucide-react'

export default function SpringProjectMaker() {
    const [name, setName] = useState('demo-project')
    const [group, setGroup] = useState('com.example')
    const [javaVer, setJavaVer] = useState('17')
    const [packType, setPackType] = useState('Jar')
    const [result, setResult] = useState<{ structure: string; pom: string } | null>(null)

    const generate = () => {
        const pkgPath = group.replace(/\./g, '/')
        const structure = `
${name}/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ${pkgPath}/
│   │   │       └── DemoApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
│           └── ${pkgPath}/
│               └── DemoApplicationTests.java
├── .gitignore
├── pom.xml
└── README.md`

        const pom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>${group}</groupId>
    <artifactId>${name}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>${name}</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>${javaVer}</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`

        setResult({ structure: structure.trim(), pom: pom.trim() })
    }

    return (
        <ToolLayout toolId="spring-project-maker">
            <div className="project-maker-grid">
                <div className="project-config">
                    <div className="entity-input-group">
                        <label>Artifact Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="demo-project" />
                    </div>
                    <div className="entity-input-group">
                        <label>Group ID</label>
                        <input value={group} onChange={e => setGroup(e.target.value)} placeholder="com.example" />
                    </div>
                    <div className="entity-input-group">
                        <label>Java Version</label>
                        <select value={javaVer} onChange={e => setJavaVer(e.target.value)}>
                            <option>17</option><option>21</option><option>11</option><option>8</option>
                        </select>
                    </div>
                    <div className="entity-input-group">
                        <label>Packaging</label>
                        <select value={packType} onChange={e => setPackType(e.target.value)}>
                            <option>Jar</option><option>War</option>
                        </select>
                    </div>
                </div>
                
                <div className="project-info-box">
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        This tool scaffolds a standard **Spring Boot 3.2.x** project structure with **Maven**, **Lombok**, and **Spring Web** dependencies pre-configured.
                    </p>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <Button onClick={generate} icon={<Package size={14} />}>Generate Project</Button>
                    </div>
                </div>
            </div>

            {result && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                    <ToolOutput fields={[{ label: 'Directory Structure', value: result.structure }]} />
                    <ToolOutput fields={[{ label: 'Generated pom.xml', value: result.pom }]} />
                </div>
            )}

            <style>{`
                .project-maker-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                    background: var(--color-bg-card);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--color-border-subtle);
                }
                .project-config { display: flex; flex-direction: column; gap: 8px; }
                .entity-input-group { display: flex; flex-direction: column; gap: 4px; }
                .entity-input-group label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-faint); margin-bottom: 2px; }
                .entity-input-group input, .entity-input-group select {
                    background: var(--color-bg-input);
                    border: 1px solid var(--color-border);
                    border-radius: 4px; padding: 6px 10px;
                    color: var(--color-text-primary);
                    font-size: 14px;
                }
                .project-info-box {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 var(--space-4);
                }
            `}</style>
        </ToolLayout>
    )
}
