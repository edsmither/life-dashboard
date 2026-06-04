import { useState } from 'react'
import { INITIAL_DATA } from '../data/appData'

const flagColors = { bring: '#6b8e6e', sign: '#5b7a91', pay: '#b78850', wear: '#8a5e7d' }

function FlagChip({ flag, palette }) {
  const color = flagColors[flag] || palette.accent
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color,
      background: color + '18',
      padding: '3px 8px', borderRadius: 99,
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>
      {flag}
    </span>
  )
}

function SchoolItem({ item, onToggle, palette, d }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: `${d.listGap + 2}px ${d.pad}px`,
        borderBottom: `1px solid ${palette.line}`,
        cursor: 'pointer',
        opacity: item.done ? 0.6 : 1,
      }}
      onClick={() => onToggle(item.id)}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        border: `2px solid ${item.done ? flagColors[item.flag] || palette.accent : palette.line}`,
        background: item.done ? flagColors[item.flag] || palette.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {item.done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: palette.ink, marginBottom: 2,
          textDecoration: item.done ? 'line-through' : 'none',
        }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: palette.inkSoft, marginBottom: 6 }}>{item.sub}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: palette.inkMute }}>{item.due}</span>
          {item.flag && <FlagChip flag={item.flag} palette={palette} />}
        </div>
      </div>
    </div>
  )
}

export default function SchoolDrilldown({ palette, d, onBack }) {
  const [upcoming, setUpcoming] = useState(INITIAL_DATA.schoolItems)
  const [past] = useState(INITIAL_DATA.schoolPast)

  function toggle(id) {
    setUpcoming(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: palette.bg }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: `${d.pad + 8}px ${d.pad}px ${d.pad}px`,
        borderBottom: `1px solid ${palette.line}`,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: palette.surface, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: palette.shadow, flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke={palette.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.16em' }}>CATEGORY</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: palette.ink }}>School</div>
        </div>
      </div>

      {/* Upcoming */}
      <div style={{ padding: `${d.gap}px 0 0` }}>
        <div style={{ padding: `0 ${d.pad}px 8px`, fontSize: 11, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.14em' }}>
          UPCOMING
        </div>
        {upcoming.map(item => (
          <SchoolItem key={item.id} item={item} onToggle={toggle} palette={palette} d={d} />
        ))}
      </div>

      {/* Past / Done */}
      <div style={{ padding: `${d.gap}px 0 0` }}>
        <div style={{ padding: `0 ${d.pad}px 8px`, fontSize: 11, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.14em' }}>
          PAST · DONE
        </div>
        {past.map(item => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: `${d.listGap + 2}px ${d.pad}px`,
            borderBottom: `1px solid ${palette.line}`,
            opacity: 0.5,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
              background: palette.inkMute,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: palette.ink, textDecoration: 'line-through', marginBottom: 2 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: palette.inkSoft }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
