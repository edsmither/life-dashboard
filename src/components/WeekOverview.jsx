export default function WeekOverview({ palette, d, weekTotal, categoryStats, completedToday, tasks }) {
  const { expected, completed } = weekTotal
  const liveCompleted = completed - (tasks.filter(t => !t.done).length === tasks.length ? 0 : completedToday)
  const pct = expected > 0 ? Math.round((liveCompleted / expected) * 1000) / 10 : 0

  const catColors = {
    medical: '#5b7a91', school: '#6b8e6e', house: '#b78850', personal: '#8a5e7d',
  }

  return (
    <div style={{
      background: palette.ink,
      borderRadius: 18,
      padding: d.cardPad,
      boxShadow: palette.shadowLg,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.18em' }}>
          WEEK OVERVIEW
        </span>
        <span style={{ fontSize: 11, color: palette.inkMute }}>May 19–25</span>
      </div>

      {/* Expected / Completed counts */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.14em', marginBottom: 2 }}>
            EXPECTED
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: palette.bg, lineHeight: 1 }}>
            {expected} <span style={{ fontSize: 13, fontWeight: 500, color: palette.inkSoft }}>tasks</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.14em', marginBottom: 2 }}>
            COMPLETED
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: palette.accent, lineHeight: 1 }}>
            {liveCompleted} <span style={{ fontSize: 13, fontWeight: 500, color: palette.inkSoft }}>tasks</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.12)', marginBottom: 10,
      }}>
        <div style={{
          height: '100%', borderRadius: 99, background: palette.accent,
          width: `${Math.min(pct, 100)}%`,
          transition: 'width 0.5s cubic-bezier(.2,.7,.3,1)',
        }} />
      </div>

      {/* Percentage */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
        <span style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 38, color: palette.bg, lineHeight: 1,
        }}>
          {pct.toFixed(1)}%
        </span>
        <span style={{ fontSize: 12, color: palette.inkSoft, maxWidth: 80, lineHeight: 1.4 }}>
          progress from completing all the tasks
        </span>
      </div>

      {/* By category */}
      <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.14em' }}>
            BY CATEGORY
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: palette.accent }} />
            <span style={{ fontSize: 10, color: palette.inkMute }}>completed</span>
          </div>
        </div>
        {Object.entries(categoryStats).map(([key, stat]) => {
          const catPct = stat.total > 0 ? (stat.done / stat.total) * 100 : 0
          const color = catColors[key] || palette.accent
          return (
            <div key={key} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: palette.inkSoft,
                  width: 60, textTransform: 'capitalize',
                }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.1)' }}>
                  <div style={{
                    height: '100%', borderRadius: 99, background: color,
                    width: `${catPct}%`,
                    transition: 'width 0.5s cubic-bezier(.2,.7,.3,1)',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: palette.inkMute, minWidth: 28, textAlign: 'right' }}>
                  {stat.done}/{stat.total}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
