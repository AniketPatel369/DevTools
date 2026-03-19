import { useState, useMemo, useEffect } from 'react'
import { ToolLayout } from '@/components/tool/ToolLayout'
import { ToolOutput } from '@/components/tool/ToolOutput'
import { Button } from '@/components/ui/Button'
import { Play } from 'lucide-react'

// Define the animation keyframes
const ANIMATIONS: Record<string, { id: string, keyframes: string, style: object }> = {
    'Pulse (Standard)': {
        id: 'pulse',
        keyframes: `@keyframes pulseAnim {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}`,
        style: {}
    },
    'Bounce (Standard)': {
        id: 'bounce',
        keyframes: `@keyframes bounceAnim {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }
}`,
        style: {}
    },
    'Fade In Up': {
        id: 'fade-in-up',
        keyframes: `@keyframes fadeInUpAnim {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}`,
        style: {}
    },
    'Cyber Glitch (Premium)': {
        id: 'cyber-glitch',
        keyframes: `@keyframes cyberGlitchAnim {
    0% { clip-path: inset(10% 0 10% 0); transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
    10% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); filter: hue-rotate(0deg); }
    20% { clip-path: inset(20% 0 40% 0); transform: translate(-2px, 0); }
    30% { clip-path: inset(50% 0 10% 0); transform: translate(2px, 2px); filter: hue-rotate(180deg); }
    40% { clip-path: inset(5% 0 80% 0); transform: translate(-2px, -2px); filter: hue-rotate(0deg); }
    50%, 100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); filter: hue-rotate(0deg); }
}`,
        style: {}
    },
    'Neon Flicker (Premium)': {
        id: 'neon-flicker',
        keyframes: `@keyframes neonFlickerAnim {
    0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff, 0 0 80px #0ff; }
    20%, 24%, 55% { opacity: 0.5; text-shadow: none; }
}`,
        style: {}
    },
    'Magnetic Float (Premium)': {
        id: 'magnetic-float',
        keyframes: `@keyframes magneticFloatAnim {
    0% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(2deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
}`,
        style: {}
    },
    'Cinematic Reveal (Premium)': {
        id: 'cinematic-reveal',
        keyframes: `@keyframes cinematicRevealAnim {
    0% { opacity: 0; filter: blur(20px); transform: scale(1.1); letter-spacing: -5px; }
    100% { opacity: 1; filter: blur(0px); transform: scale(1); letter-spacing: normal; }
}`,
        style: {}
    }
}

export default function AnimationPlayground() {
    const [animation, setAnimation] = useState('Cyber Glitch (Premium)')
    const [duration, setDuration] = useState(1.5)
    const [delay, setDelay] = useState(0)
    const [iterationCount, setIterationCount] = useState('infinite') // infinite or 1
    const [timingFunction, setTimingFunction] = useState('ease-in-out')
    const [previewText, setPreviewText] = useState('DEVTOOLS')

    // Toggle state to force re-render/re-run of the animation
    const [playTrigger, setPlayTrigger] = useState(0)

    const animData = ANIMATIONS[animation]
    
    // Extract actual name from keyframes string (e.g., pulseAnim)
    const keyframesName = animData.keyframes.match(/@keyframes\s+(\w+)/)?.[1] || 'anim'

    const cssCode = useMemo(() => {
        return `${animData.keyframes}\n
.animate-${animData.id} {
    animation-name: ${keyframesName};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    animation-iteration-count: ${iterationCount};
    animation-timing-function: ${timingFunction};
    animation-fill-mode: both;
    display: inline-block;
}`
    }, [duration, delay, iterationCount, timingFunction, animData, keyframesName])

    const handlePlay = () => setPlayTrigger(prev => prev + 1)

    // Run once on mount
    useEffect(() => {
        setPlayTrigger(1)
    }, [])

    return (
        <ToolLayout toolId="animation-playground">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>

                {/* Configuration Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="tool-option-group">
                        <label>Preview Text</label>
                        <input
                            type="text"
                            className="dt-input"
                            value={previewText}
                            onChange={(e) => setPreviewText(e.target.value)}
                            placeholder="Type something..."
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label>Animation Effect</label>
                        <select
                            className="dt-input"
                            value={animation}
                            onChange={(e) => setAnimation(e.target.value)}
                        >
                            {Object.keys(ANIMATIONS).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Duration (seconds)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{duration}s</span>
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Delay (seconds)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{delay}s</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="5.0"
                            step="0.1"
                            value={delay}
                            onChange={(e) => setDelay(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                    </div>

                    <div className="tool-option-group">
                        <label>Timing Function</label>
                        <select
                            className="dt-input"
                            value={timingFunction}
                            onChange={(e) => setTimingFunction(e.target.value)}
                        >
                            <option value="ease">ease</option>
                            <option value="ease-in">ease-in</option>
                            <option value="ease-out">ease-out</option>
                            <option value="ease-in-out">ease-in-out</option>
                            <option value="linear">linear</option>
                            <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">cubic-bezier (Bouncy)</option>
                        </select>
                    </div>

                    <div className="tool-option-group">
                        <label>Iteration Count</label>
                        <select
                            className="dt-input"
                            value={iterationCount}
                            onChange={(e) => setIterationCount(e.target.value)}
                        >
                            <option value="infinite">Infinite</option>
                            <option value="1">Once (1)</option>
                            <option value="2">Twice (2)</option>
                            <option value="3">Thrice (3)</option>
                        </select>
                    </div>
                </div>

                {/* Output Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                    {/* Visual Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="tool-output-label">Live Preview</span>
                            <Button variant="secondary" size="sm" onClick={handlePlay} icon={<Play size={13} />}>
                                Replay
                            </Button>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                height: '280px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#0a0a0f', // Darker background for more "premium" look
                                backgroundImage: `radial-gradient(circle at center, #1a2236 0%, #0a0a0f 100%)`, // Subtle gradient
                                textAlign: 'center'
                            }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: `<style>${cssCode}</style>` }} />

                            {/* The element to animate */}
                            <div
                                key={`${playTrigger}-${animation}`}
                                className={`animate-${animData.id}`}
                                style={{
                                    fontSize: 'clamp(2rem, 10vw, 4rem)', // Responsive font size
                                    fontWeight: 900,
                                    color: '#3b82f6', // Bright accent color for better visibility and filter effects
                                    fontFamily: 'Inter, sans-serif',
                                    whiteSpace: 'nowrap',
                                    letterSpacing: '2px',
                                    textShadow: '0 0 20px rgba(59, 130, 246, 0.3)', // Subtle glow
                                    ...animData.style
                                }}
                            >
                                {previewText || 'DEVTOOLS'}
                            </div>
                        </div>
                    </div>

                    {/* Code Output */}
                    <ToolOutput
                        fields={[{ label: 'Generated CSS Code', value: cssCode }]}
                    />
                </div>
            </div>
        </ToolLayout>
    )
}
