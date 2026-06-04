import { useState, useEffect, useRef } from 'react'
import { fmt } from '../data/appData'

const EXAMPLES = [
  "{p}'s dentist appointment Thursday 2pm",
  'Bring blanket for movie night Friday',
  'Pay yearbook fee, due today, $28',
]

function parseTranscript(text) {
  const lower = text.toLowerCase()
  const catMap = {
    dentist: 'Medical', doctor: 'Medical', prescription: 'Medical', refill: 'Medical',
    school: 'School', homework: 'School', yearbook: 'School', teacher: 'School', class: 'School',
    groceries: 'House', landlord: 'House', plant: 'House', clean: 'House',
    blanket: 'School', pajama: 'School', movie: 'Personal',
  }
  let cat = 'Personal'
  for (const [kw, c] of Object.entries(catMap)) {
    if (lower.includes(kw)) { cat = c; break }
  }

  const timeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i)
  const dayMatch = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow)\b/i)
  const moneyMatch = text.match(/\$(\d+)/i)

  const words = text.trim().split(/\s+/)
  const title = words.slice(0, 5).join(' ')

  return {
    title,
    time: timeMatch ? timeMatch[1] : null,
    day: dayMatch ? dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1) : null,
    cat,
    money: moneyMatch ? `$${moneyMatch[1]}` : null,
  }
}

export default function VoiceCapture({ palette, d, persona, onClose }) {
  const [phase, setPhase] = useState('idle') // idle | listening | result
  const [transcript, setTranscript] = useState('')
  const [parsed, setParsed] = useState(null)
  const recogRef = useRef(null)

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition

  function startListening() {
    if (!SpeechRec) {
      setPhase('result')
      const fallback = fmt(EXAMPLES[0], persona)
      setTranscript(fallback)
      setParsed(parseTranscript(fallback))
      return
    }
    const rec = new SpeechRec()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    recogRef.current = rec
    rec.onresult = e => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      setParsed(parseTranscript(text))
      setPhase('result')
    }
    rec.onerror = () => setPhase('idle')
    rec.onend = () => { if (phase === 'listening') setPhase('idle') }
    rec.start()
    setPhase('listening')
  }

  function useFallback(example) {
    const text = fmt(example, persona)
    setTranscript(text)
    setParsed(parseTranscript(text))
    setPhase('result')
  }

  function handleSave() {
    // In the prototype this is where a real task would be added
    onClose()
  }

  useEffect(() => () => recogRef.current?.abort(), [])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: palette.bg,
      display: 'flex', flexDirection: 'column',
      zIndex: 200,
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${d.pad + 8}px ${d.pad}px ${d.pad}px` }}>
        {phase === 'listening' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: palette.accent,
              animation: 'pulse 1s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: palette.inkSoft }}>Listening</span>
          </div>
        ) : <div />}
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: palette.surface, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: palette.shadow,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke={palette.ink} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `0 ${d.pad}px` }}>
        {/* Mic button */}
        <div style={{ marginTop: 40, marginBottom: 40 }}>
          <button
            onClick={phase === 'idle' ? startListening : undefined}
            style={{
              width: 88, height: 88, borderRadius: '50%',
              background: palette.accent,
              border: 'none', cursor: phase === 'idle' ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 32px ${palette.accent}50`,
              transition: 'transform 0.12s',
              transform: phase === 'listening' ? 'scale(1.06)' : 'scale(1)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth="1.8" fill="none"/>
              <path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {phase === 'idle' && (
          <>
            <p style={{ fontSize: 16, fontWeight: 600, color: palette.ink, marginBottom: 24, textAlign: 'center' }}>
              Tap the mic and say a task
            </p>
            <div style={{ width: '100%', marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.16em', marginBottom: 10 }}>
                TRY SAYING
              </p>
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => useFallback(ex)}
                  style={{
                    display: 'block', width: '100%',
                    background: palette.surface,
                    border: `1px solid ${palette.line}`,
                    borderRadius: 12, padding: '12px 14px',
                    marginBottom: 8, textAlign: 'left',
                    fontSize: 13, color: palette.inkSoft,
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                >
                  "{fmt(ex, persona)}"
                </button>
              ))}
            </div>
          </>
        )}

        {phase === 'listening' && (
          <p style={{
            fontSize: 17, color: palette.inkSoft, textAlign: 'center',
            fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
          }}>
            Speak your task…
          </p>
        )}

        {phase === 'result' && parsed && (
          <div style={{ width: '100%', animation: 'slideUp 0.25s ease' }}>
            <p style={{
              fontSize: 18, fontWeight: 600, color: palette.ink,
              textAlign: 'center', marginBottom: 20, lineHeight: 1.4,
            }}>
              {transcript}
            </p>

            {/* Parse preview card */}
            <div style={{
              background: palette.surface, borderRadius: 16,
              padding: 16, boxShadow: palette.shadow, marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke={palette.accent} strokeWidth="1.8"/>
                  <path d="M12 8v4l3 3" stroke={palette.accent} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: palette.accent, letterSpacing: '0.16em' }}>
                  I'LL ADD THIS
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: palette.ink, marginBottom: 4 }}>{parsed.title}</div>
              <div style={{ fontSize: 13, color: palette.inkSoft, marginBottom: 12 }}>
                {[parsed.day, parsed.time, parsed.money].filter(Boolean).join(' · ') || 'Anytime today'}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[parsed.cat, parsed.day].filter(Boolean).map(chip => (
                  <span key={chip} style={{
                    fontSize: 11, fontWeight: 600, color: palette.inkSoft,
                    background: palette.pillBg, padding: '4px 10px', borderRadius: 99,
                  }}>{chip}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {phase === 'result' && (
        <div style={{
          display: 'flex', gap: 12, padding: `${d.pad}px`,
          borderTop: `1px solid ${palette.line}`,
        }}>
          <button
            onClick={() => setPhase('idle')}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 14,
              background: palette.surface, border: `1px solid ${palette.line}`,
              fontSize: 15, fontWeight: 600, color: palette.inkSoft, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2, padding: '14px 0', borderRadius: 14,
              background: palette.accent, border: 'none',
              fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer',
            }}
          >
            Save it
          </button>
        </div>
      )}
    </div>
  )
}
