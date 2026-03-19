import { useState } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOptions } from '@/components/tool/ToolOptions'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { CalendarClock, Play, Copy, Check } from 'lucide-react'

type CronType = 'Standard Crontab' | 'Spring @Scheduled'

export default function CronBuilder() {
    const [type, setType] = useState<CronType>('Standard Crontab')
    const [min, setMin] = useState('*')
    const [hour, setHour] = useState('*')
    const [day, setDay] = useState('*')
    const [month, setMonth] = useState('*')
    const [dow, setDow] = useState('*')
    const [sec, setSec] = useState('0')
    const [copied, setCopied] = useState(false)

    const expression = type === 'Standard Crontab' 
        ? `${min} ${hour} ${day} ${month} ${dow}`
        : `${sec} ${min} ${hour} ${day} ${month} ${dow}`

    const copy = () => {
        navigator.clipboard.writeText(expression)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const preset = (m: string, h: string, d: string, mon: string, dw: string) => {
        setMin(m); setHour(h); setDay(d); setMonth(mon); setDow(dw); setSec('0')
    }

    return (
        <ToolLayout toolId="cron-builder">
            <div className="cron-builder-card">
                <div className="cron-display">
                    <code>{expression}</code>
                </div>
                
                <ToolOptions>
                    <div className="tool-option-group">
                        <label>Expression Type</label>
                        <Toggle options={['Standard Crontab', 'Spring @Scheduled']} value={type} onChange={v => setType(v as CronType)} />
                    </div>
                </ToolOptions>

                <div className="cron-inputs-grid">
                    {type === 'Spring @Scheduled' && (
                        <div className="cron-input-item">
                            <label>Seconds</label>
                            <input value={sec} onChange={e => setSec(e.target.value)} />
                        </div>
                    )}
                    <div className="cron-input-item">
                        <label>Minutes</label>
                        <input value={min} onChange={e => setMin(e.target.value)} />
                    </div>
                    <div className="cron-input-item">
                        <label>Hours</label>
                        <input value={hour} onChange={e => setHour(e.target.value)} />
                    </div>
                    <div className="cron-input-item">
                        <label>Day (Month)</label>
                        <input value={day} onChange={e => setDay(e.target.value)} />
                    </div>
                    <div className="cron-input-item">
                        <label>Month</label>
                        <input value={month} onChange={e => setMonth(e.target.value)} />
                    </div>
                    <div className="cron-input-item">
                        <label>Day (Week)</label>
                        <input value={dow} onChange={e => setDow(e.target.value)} />
                    </div>
                </div>

                <div className="cron-presets">
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-faint)' }}>Presets</span>
                    <div className="cron-preset-buttons">
                        <button onClick={() => preset('*', '*', '*', '*', '*')}>Every Minute</button>
                        <button onClick={() => preset('0', '*', '*', '*', '*')}>Every Hour</button>
                        <button onClick={() => preset('0', '0', '*', '*', '*')}>Every Day</button>
                        <button onClick={() => preset('0', '0', '*', '*', 'MON-FRI')}>Weekdays</button>
                        <button onClick={() => preset('0', '0', '1', '*', '*')}>Monthly</button>
                    </div>
                </div>

                <div className="tool-actions">
                    <Button onClick={copy} icon={copied ? <Check size={14} /> : <Copy size={14} />}>
                        {copied ? 'Copied!' : 'Copy Expression'}
                    </Button>
                </div>
            </div>

            <style>{`
                .cron-builder-card {
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: var(--space-6);
                }
                .cron-display {
                    background: var(--color-bg-input);
                    padding: var(--space-4);
                    border-radius: var(--radius-md);
                    text-align: center;
                    margin-bottom: var(--space-6);
                    border: 1px dashed var(--color-dev);
                }
                .cron-display code {
                    font-size: 24px;
                    color: var(--color-dev);
                    font-family: var(--font-mono);
                }
                .cron-inputs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                    gap: var(--space-3);
                    margin-top: var(--space-6);
                }
                .cron-input-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .cron-input-item label { font-size: 11px; color: var(--color-text-faint); font-weight: 600; text-transform: uppercase; }
                .cron-input-item input {
                    background: var(--color-bg-input);
                    border: 1px solid var(--color-border);
                    border-radius: 4px; padding: 6px;
                    text-align: center; color: var(--color-text-primary);
                    font-family: var(--font-mono);
                }
                .cron-presets { margin-top: var(--space-6); }
                .cron-preset-buttons { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
                .cron-preset-buttons button {
                    background: var(--color-bg-input);
                    border: 1px solid var(--color-border);
                    border-radius: 4px; padding: 4px 10px;
                    font-size: 11px; color: var(--color-text-secondary);
                    cursor: pointer; transition: all 0.2s;
                }
                .cron-preset-buttons button:hover { border-color: var(--color-dev); color: var(--color-dev); }
            `}</style>
        </ToolLayout>
    )
}
