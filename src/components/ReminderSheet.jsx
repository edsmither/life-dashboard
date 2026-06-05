import { useState } from 'react'

const SNOOZE_OPTIONS = [
  { label: '30 min', time: '30 minutes' },
  { label: '8 PM tonight', time: '8 PM' },
  { label: '7 AM', time: '7 AM tomorrow' },
  { label: '12 PM', time: 'noon tomorrow' },
  { label: 'Bedtime', time: '9 PM' },
  { label: 'Pickup', time: 'school pickup' },
]

const CONFIRMATIONS = {
  skip: 'Okay — letting it go.',
  got: 'Lovely — nothing more from me.',
}

export default function ReminderSheet({ palette, d, persona, tomorrowInfo, tomorrowItems = [], onClose }) {
  const [packed, setPacked] = useState({})
  const [snoozeOpen, setSnoozeOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  const accent = palette.accent

  function confirm(msg) {
    setConfirmed(msg)
    setTimeout(onClose, 1100)
  }

  function togglePack(id) {
    setPacked(p => ({ ...p, [id]: !p[id] }))
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: `12px ${d.pad}px ${d.pad}px`,
      paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
    }}>
      {/* Scrim — tap outside does nothing (must-engage) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: palette.scrim,
        animation: 'fadeIn 0.25s ease',
      }} />

      {/* Centered popup card */}
      <div style={{
        position: 'relative', width: '100%',
        background: palette.surface,
        borderRadius: 24,
        padding: `${d.pad}px`,
        boxShadow: palette.shadowLg,
        animation: 'popIn 0.3s cubic-bezier(.2,.7,.2,1)',
        maxHeight: '88dvh',
        overflowY: 'auto',
      }}>

        {confirmed ? (
          /* Confirmation state */
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 0', animation: 'popIn 0.3s ease',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: accent + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 20, color: palette.ink, textAlign: 'center', lineHeight: 1.4,
            }}>
              {confirmed}
            </div>
          </div>
        ) : snoozeOpen ? (
          /* Snooze submenu */
          <>
            <div style={{ fontSize: 14, fontWeight: 700, color: palette.ink, marginBottom: 16 }}>
              Remind me at…
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              {SNOOZE_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => confirm(`See you at ${opt.time}.`)}
                  style={{
                    padding: '12px 6px', borderRadius: 14,
                    background: palette.surfaceAlt,
                    border: `1px solid ${palette.line}`,
                    fontSize: 13, fontWeight: 600, color: palette.ink,
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSnoozeOpen(false)}
              style={{
                width: '100%', padding: 14, borderRadius: 14,
                background: 'none', border: `1px solid ${palette.line}`,
                fontSize: 14, color: palette.inkSoft, cursor: 'pointer',
              }}
            >
              Back
            </button>
          </>
        ) : (
          /* Main sheet */
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: accent, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#fff',
              }}>
                L
              </div>
              <div>
                <div style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 16, color: palette.ink, lineHeight: 1.4,
                }}>
                  Here's what's on for {persona} tomorrow. Want to get ahead?
                </div>
              </div>
            </div>

            <div style={{
              background: palette.surfaceAlt, borderRadius: 14,
              padding: '12px 14px', marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.16em' }}>
                    TOMORROW BRIEF
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: palette.ink }}>{tomorrowInfo?.dateLabel}</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: accent,
                  background: accent + '18', padding: '3px 10px', borderRadius: 99,
                }}>
                  {tomorrowItems.length} things
                </span>
              </div>

              {/* Checklist */}
              {tomorrowItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => togglePack(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderTop: `1px solid ${palette.line}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${packed[item.id] ? accent : palette.line}`,
                    background: packed[item.id] ? accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {packed[item.id] && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 500, color: palette.ink,
                    textDecoration: packed[item.id] ? 'line-through' : 'none',
                    opacity: packed[item.id] ? 0.6 : 1,
                    transition: 'all 0.15s',
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <button
                onClick={() => confirm(CONFIRMATIONS.skip)}
                style={{
                  flex: 1, padding: '14px 8px', borderRadius: 14,
                  background: palette.surfaceAlt, border: `1px solid ${palette.line}`,
                  fontSize: 12, fontWeight: 600, color: palette.inkSoft,
                  cursor: 'pointer', lineHeight: 1.3,
                }}
              >
                Skip<br />
                <span style={{ fontWeight: 400, fontSize: 11 }}>Not happening</span>
              </button>
              <button
                onClick={() => confirm(CONFIRMATIONS.got)}
                style={{
                  flex: 1.5, padding: '14px 8px', borderRadius: 14,
                  background: accent, border: 'none',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  cursor: 'pointer', lineHeight: 1.3,
                }}
              >
                I've got it
              </button>
              <button
                onClick={() => setSnoozeOpen(true)}
                style={{
                  flex: 1, padding: '14px 8px', borderRadius: 14,
                  background: palette.surfaceAlt, border: `1px solid ${palette.line}`,
                  fontSize: 12, fontWeight: 600, color: palette.inkSoft,
                  cursor: 'pointer', lineHeight: 1.3,
                }}
              >
                Later<br />
                <span style={{ fontWeight: 400, fontSize: 11 }}>Remind me</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
