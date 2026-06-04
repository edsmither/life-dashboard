import { useState, useEffect } from 'react'
import { fmt } from '../data/appData'
import WeekStrip from './WeekStrip'
import WeekOverview from './WeekOverview'
import TodayTable from './TodayTable'
import FAB from './FAB'

function useCollapsible(id, defaultOpen = true) {
  const key = `lifedash.section.${id}`
  const [open, setOpen] = useState(() => {
    try { const v = localStorage.getItem(key); return v === null ? defaultOpen : v === 'true' }
    catch { return defaultOpen }
  })
  function toggle() {
    setOpen(v => {
      const next = !v
      try { localStorage.setItem(key, String(next)) } catch {}
      return next
    })
  }
  return [open, toggle]
}

function CollapsibleSection({ id, title, defaultOpen = true, children, palette, d }) {
  const [open, toggle] = useCollapsible(id, defaultOpen)
  return (
    <div style={{ marginBottom: d.gap }}>
      <button
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: `8px ${d.pad}px`, background: 'none', border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: palette.ink, letterSpacing: '0.04em' }}>
          {title}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}>
          <path d="M6 4l4 4-4 4" stroke={palette.inkMute} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 2000 : 0,
        opacity: open ? 1 : 0,
        transition: 'max-height 0.3s ease, opacity 0.18s ease',
      }}>
        {children}
      </div>
    </div>
  )
}

function TomorrowBriefCard({ palette, d, persona, onOpen }) {
  return (
    <div
      onClick={onOpen}
      style={{
        margin: `0 ${d.pad}px ${d.gap}px`,
        background: palette.ink,
        borderRadius: 18,
        padding: `${d.cardPad}px`,
        cursor: 'pointer',
        boxShadow: palette.shadowLg,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.accent || '#6b8e6e', letterSpacing: '0.18em', marginBottom: 4 }}>
            TOMORROW BRIEF
          </div>
          <div style={{ fontSize: 12, color: palette.inkSoft, letterSpacing: '0.04em' }}>Fri · May 22</div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
            stroke={palette.bg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 18, color: palette.bg,
        lineHeight: 1.35, marginBottom: 12,
      }}>
        Three things for {persona} — tap to prep.
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Pajamas', 'Blanket', 'Dentist forms'].map(label => (
          <span key={label} style={{
            fontSize: 11, fontWeight: 600, color: palette.bg,
            background: 'rgba(255,255,255,0.15)',
            padding: '4px 10px', borderRadius: 99,
            letterSpacing: '0.02em',
          }}>{label}</span>
        ))}
      </div>
    </div>
  )
}

function CategorySection({ id, name, count, preview, palette, d, persona, onOpen }) {
  const catColors = {
    school: '#6b8e6e', medical: '#5b7a91', house: '#b78850', personal: '#8a5e7d',
  }
  const color = catColors[id] || palette.accent

  return (
    <div
      style={{
        margin: `0 ${d.pad}px ${d.gap}px`,
        background: palette.surface,
        borderRadius: 14,
        padding: `${d.cardPad}px`,
        boxShadow: palette.shadow,
        cursor: id === 'school' ? 'pointer' : 'default',
      }}
      onClick={id === 'school' ? onOpen : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: color + '22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CategoryIcon id={id} color={color} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: palette.ink }}>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color, background: color + '18',
            padding: '2px 8px', borderRadius: 99,
          }}>{count}</span>
          {id === 'school' && (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke={palette.inkMute} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
      <div style={{ fontSize: 12, color: palette.inkSoft, lineHeight: 1.5 }}>
        {fmt(preview, persona)}
      </div>
    </div>
  )
}

function CategoryIcon({ id, color }) {
  const s = { stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  if (id === 'school') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L2 8l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" {...s}/>
    </svg>
  )
  if (id === 'medical') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" {...s}/>
    </svg>
  )
  if (id === 'house') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" {...s}/>
      <path d="M9 22V12h6v10" {...s}/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" {...s}/>
    </svg>
  )
}

function UpcomingSection({ upcoming, palette, d }) {
  return (
    <div style={{ padding: `0 ${d.pad}px ${d.gap}px` }}>
      {upcoming.map(day => (
        <div key={day.day} style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '10px 0',
          borderBottom: `1px solid ${palette.line}`,
        }}>
          <div style={{ minWidth: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.1em' }}>{day.day}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: palette.inkSoft }}>{day.date}</div>
          </div>
          <div style={{ fontSize: 13, color: day.count === 0 ? palette.inkMute : palette.ink, fontStyle: day.count === 0 ? 'italic' : 'normal' }}>
            {day.count === 0 ? 'Nothing scheduled' : day.items}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home({ palette, d, persona, mode, tasks, toggleTask, completedToday, data, onOpenVoice, onOpenSchool, onOpenReminder }) {
  const totalToday = tasks.length

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      {/* Date promenade */}
      <div style={{ padding: `${d.pad + 8}px ${d.pad}px ${d.gap}px` }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: palette.inkMute,
          letterSpacing: '0.2em', marginBottom: 4,
        }}>
          TODAY IS
        </div>
        <div style={{ fontSize: d.titleSize + 4, fontWeight: 700, color: palette.ink, lineHeight: 1.1 }}>
          Thursday,{' '}
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            color: palette.accent,
          }}>
            May 21
          </span>
        </div>
      </div>

      {/* Week strip */}
      <WeekStrip days={data.weekDays} palette={palette} d={d} />

      {/* Tomorrow brief card */}
      <TomorrowBriefCard palette={palette} d={d} persona={persona} onOpen={onOpenReminder} />

      {/* Week overview */}
      <div style={{ margin: `0 ${d.pad}px ${d.gap}px` }}>
        <WeekOverview
          palette={palette} d={d}
          weekTotal={data.weekTotal}
          categoryStats={data.categoryStats}
          completedToday={completedToday}
          tasks={tasks}
        />
      </div>

      {/* Today's list */}
      <div style={{ padding: `0 ${d.pad}px`, marginBottom: d.gap }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: palette.ink }}>Today's list</span>
            <span style={{ fontSize: 13, color: palette.inkMute }}>· {totalToday}</span>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600, color: palette.accent,
            background: palette.accent + '18', padding: '3px 10px', borderRadius: 99,
          }}>
            {totalToday - completedToday} to go
          </span>
        </div>
        <TodayTable tasks={tasks} toggleTask={toggleTask} palette={palette} d={d} persona={persona} />
      </div>

      {/* Collapsible sections */}
      <CollapsibleSection id="upcoming" title="Upcoming days" palette={palette} d={d}>
        <UpcomingSection upcoming={data.upcoming} palette={palette} d={d} />
      </CollapsibleSection>

      <CollapsibleSection id="categories" title="By category" palette={palette} d={d}>
        {data.categories.map(cat => (
          <CategorySection
            key={cat.id}
            {...cat}
            preview={data.categoryPreview[cat.id]}
            palette={palette} d={d} persona={persona}
            onOpen={onOpenSchool}
          />
        ))}
      </CollapsibleSection>

      {/* FAB */}
      <FAB onClick={onOpenVoice} accent={palette.accent} />
    </div>
  )
}
