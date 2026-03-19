import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Play, Plus, Trash2, X } from 'lucide-react'

interface Field {
    name: string
    type: string
    annotations: string[]
}

export default function SpringEntityMaker() {
    const [className, setClassName] = useState('User')
    const [tableName, setTableName] = useState('users')
    const [packageName, setPackageName] = useState('com.example.entity')
    const [fields, setFields] = useState<Field[]>([
        { name: 'id', type: 'Long', annotations: ['Id', 'GeneratedValue'] },
        { name: 'username', type: 'String', annotations: ['Column'] }
    ])
    const [result, setResult] = useState('')

    const addField = () => setFields([...fields, { name: '', type: 'String', annotations: [] }])
    const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i))
    
    const updateField = (i: number, delta: Partial<Field>) => {
        const next = [...fields]
        next[i] = { ...next[i], ...delta }
        setFields(next)
    }

    const generate = () => {
        let code = `package ${packageName};\n\n`
        code += `import jakarta.persistence.*;\n`
        code += `import lombok.*;\n\n`
        code += `@Entity\n`
        code += `@Table(name = "${tableName}")\n`
        code += `@Getter\n@Setter\n@NoArgsConstructor\n@AllArgsConstructor\n`
        code += `public class ${className} {\n\n`
        
        fields.forEach(f => {
            if (!f.name) return
            f.annotations.forEach(a => {
                if (a === 'Id') code += `    @Id\n`
                if (a === 'GeneratedValue') code += `    @GeneratedValue(strategy = GenerationType.IDENTITY)\n`
                if (a === 'Column') code += `    @Column(name = "${f.name}")\n`
            })
            code += `    private ${f.type} ${f.name};\n\n`
        })
        
        code += `}`
        setResult(code)
    }

    return (
        <ToolLayout toolId="spring-entity-maker">
            <div className="entity-maker-grid">
                <div className="entity-maker-config">
                    <div className="entity-input-group">
                        <label>Package Name</label>
                        <input value={packageName} onChange={e => setPackageName(e.target.value)} placeholder="com.example.entity" />
                    </div>
                    <div className="entity-input-group">
                        <label>Class Name</label>
                        <input value={className} onChange={e => setClassName(e.target.value)} placeholder="User" />
                    </div>
                    <div className="entity-input-group">
                        <label>Table Name</label>
                        <input value={tableName} onChange={e => setTableName(e.target.value)} placeholder="users" />
                    </div>
                </div>

                <div className="entity-fields-list">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-secondary)' }}>Fields</span>
                        <Button variant="secondary" onClick={addField} size="sm" icon={<Plus size={13} />}>Add Field</Button>
                    </div>
                    {fields.map((f, i) => (
                        <div key={i} className="field-row">
                            <input value={f.name} onChange={e => updateField(i, { name: e.target.value })} placeholder="field_name" />
                            <select value={f.type} onChange={e => updateField(i, { type: e.target.value })}>
                                <option>String</option><option>Long</option><option>Integer</option><option>Double</option><option>Boolean</option><option>LocalDateTime</option>
                            </select>
                            <Button variant="danger" size="sm" onClick={() => removeField(i)} icon={<Trash2 size={13} />} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="tool-actions">
                <Button onClick={generate} icon={<Play size={14} />}>Generate Java Code</Button>
            </div>

            {result && <ToolOutput fields={[{ label: 'Generated JPA Entity', value: result }]} />}
            
            <style>{`
                .entity-maker-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                    background: var(--color-bg-card);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--color-border-subtle);
                }
                .entity-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 12px;
                }
                .entity-input-group label { font-size: 13px; color: var(--color-text-secondary); }
                .entity-input-group input { 
                    background: var(--color-bg-input); 
                    border: 1px solid var(--color-border); 
                    border-radius: 4px; padding: 6px 10px;
                    color: var(--color-text-primary);
                }
                .field-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .field-row input, .field-row select {
                    flex: 1;
                    background: var(--color-bg-input);
                    border: 1px solid var(--color-border);
                    border-radius: 4px; padding: 4px 8px;
                    color: var(--color-text-primary);
                    font-size: 13px;
                }
            `}</style>
        </ToolLayout>
    )
}
