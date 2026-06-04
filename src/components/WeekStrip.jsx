import { useState } from 'react'

export default function WeekStrip({ days, palette, d }) {
  const todayIdx = days.findIndex(day => day.isToday)
  const [selected, setSelected] = useState(todayIdx >= 0 ? todayIdx : 0)

  return (
    <div style={{
      margin: `0 ${d.pad}px ${d.gap}px`,
      background: palette.surface,
      borderRadius: 18,
      padding: `${d.cardPad - 4}px ${d.cardPad - 8}px`,
      boxShadow: palette.shadow,
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      {days.map((day, i) => {
        const isSelected = i === selected
        const isToday = day.isToday

        return (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, padding: '6px 8px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: isSelected
                ? palette.accent
                : isToday
                  ? palette.accent + '18'
                  : 'transparent',
              transition: 'background 0.15s',
              minWidth: 36,
            }}
          >
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              color: isSelected ? 'rgba(255,255,255,0.75)' : palette.inkMute,
            }}>
              {day.letter}
            </span>
            <span style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 18, fontWeight: 400, lineHeight: 1,
              color: isSelected ? '#fff' : isToday ? palette.accent : palette.ink,
            }}>
              {day.num}
            </span>
            {/* dots */}
            <div style={{ display: 'flex', gap: 2, height: 5, alignItems: 'center' }}>
              {Array.from({ length: Math.min(day.dots, 3) }).map((_, di) => (
                <div key={di} style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: isSelected
                    ? 'rgba(255,255,255,0.6)'
                    : di < (day.hasDone ? 1 : 0)
                      ? palette.inkMute
                      : palette.accent,
                  opacity: isSelected ? 1 : (di < (day.hasDone ? 1 : 0) ? 0.5 : 0.8),
                }} />
              ))}
              {day.dots === 0 && <div style={{ width: 4, height: 4 }} />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
