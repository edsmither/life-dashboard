import { useState } from 'react'
import { fmt } from '../data/appData'
import WeekStrip from './WeekStrip'
import WeekOverview from './WeekOverview'
import TodayTable from './TodayTable'
import FAB from './FAB'

function useCollapsible(id) {
  const key = `lifedash.section.${id}`
  const [open, setOpen] = useState(() => {
    try { const v = localStorage.getItem(key); return v === 'true' }
    catch { return false }
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

function CollapsibleSection({ id, title, badge, children, palette, d }) {
  const [open, toggle] = useCollapsible(id)
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: `10px ${d.pad}px`, background: 'none', border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: palette.ink }}>
            {title}
          </span>
          {badge != null && badge > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: palette.accent,
              background: palette.accent + '18', padding: '2px 7px', borderRadius: 99,
            }}>{badge}</span>
          )}
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s', flexShrink: 0 }}>
          <path d="M6 4l4 4-4 4" stroke={palette.inkMute} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 3000 : 0,
        opacity: open ? 1 : 0,
        transition: 'max-height 0.3s ease, opacity 0.18s ease',
      }}>
        {children}
      </div>
    </div>
  )
}

function TomorrowBriefCard({ palette, d, persona, tomorrowInfo, tomorrowItems, onOpen }) {
  const count = tomorrowItems.length
  const countLabel = count === 0 ? null : count === 1 ? 'One thing' : count === 2 ? 'Two things' : `${count} things`

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
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.accent, letterSpacing: '0.18em', marginBottom: 4 }}>
            TOMORROW BRIEF
          </div>
          <div style={{ fontSize: 12, color: palette.inkSoft }}>{tomorrowInfo?.shortLabel}</div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
            stroke={palette.bg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 18, color: palette.bg, lineHeight: 1.35, marginBottom: count > 0 ? 12 : 0,
      }}>
        {count === 0
          ? `All clear for ${persona} tomorrow.`
          : `${countLabel} for ${persona} — tap to prep.`}
      </div>

      {count > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tomorrowItems.slice(0, 4).map(item => (
            <span key={item.id} style={{
              fontSize: 11, fontWeight: 600, color: palette.bg,
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 10px', borderRadius: 99,
            }}>{item.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}

const CAT_COLORS = { school: '#6b8e6e', medical: '#5b7a91', house: '#b78850', personal: '#8a5e7d' }

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

function CategorySection({ id, name, count, preview, palette, d, onOpen }) {
  const color = CAT_COLORS[id] || palette.accent
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
      <div style={{ fontSize: 12, color: count === 0 ? palette.inkMute : palette.inkSoft, lineHeight: 1.5, fontStyle: count === 0 ? 'italic' : 'normal' }}>
        {preview}
      </div>
    </div>
  )
}

function UpcomingSection({ upcomingGroups, palette, d }) {
  if (upcomingGroups.length === 0) {
    return (
      <div style={{ padding: `0 ${d.pad}px ${d.gap}px`, fontSize: 13, color: palette.inkMute, fontStyle: 'italic' }}>
        Nothing scheduled yet.
      </div>
    )
  }
  return (
    <div style={{ padding: `0 ${d.pad}px ${d.gap}px` }}>
      {upcomingGroups.map(day => (
        <div key={day.dateISO} style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '10px 0',
          borderBottom: `1px solid ${palette.line}`,
        }}>
          <div style={{ minWidth: 80, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: palette.inkSoft }}>{day.dayLabel}</div>
            <div style={{ fontSize: 11, color: palette.inkMute }}>{day.count} item{day.count !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ fontSize: 13, color: palette.ink, lineHeight: 1.5 }}>
            {day.items}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home({
  palette, d, persona, tasks, toggleTask, deleteTask, completedToday,
  todayInfo, tomorrowInfo, tomorrowItems,
  weekDays, weekRange, weekTotal, categoryStats, categoryData, upcomingGroups,
  onOpenVoice, onOpenSchool, onOpenReminder,
}) {
  const totalToday = tasks.length
  const upcomingCount = upcomingGroups.reduce((n, g) => n + g.count, 0)
  const openCatCount = categoryData.reduce((n, c) => n + c.count, 0)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 88 }}>

      {/* 1. Date promenade */}
      <div style={{ padding: `${d.pad + 8}px ${d.pad}px ${d.gap}px` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.2em', marginBottom: 4 }}>
          TODAY IS
        </div>
        <div style={{ fontSize: d.titleSize + 4, fontWeight: 700, color: palette.ink, lineHeight: 1.1 }}>
          {todayInfo.dayName},{' '}
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: palette.accent }}>
            {todayInfo.monthName} {todayInfo.dayNum}
          </span>
        </div>
      </div>

      {/* 2. Weekly calendar: strip + overview */}
      <WeekStrip days={weekDays} palette={palette} d={d} />
      <div style={{ margin: `0 ${d.pad}px ${d.gap}px` }}>
        <WeekOverview
          palette={palette} d={d}
          weekTotal={weekTotal}
          categoryStats={categoryStats}
          weekRange={weekRange}
        />
      </div>

      {/* 3. Today's list */}
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
        <TodayTable
          tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask}
          palette={palette} d={d} persona={persona}
        />
      </div>

      {/* 4. Tomorrow's brief card */}
      <TomorrowBriefCard
        palette={palette} d={d} persona={persona}
        tomorrowInfo={tomorrowInfo} tomorrowItems={tomorrowItems}
        onOpen={onOpenReminder}
      />

      {/* 5. Upcoming days (collapsible, starts closed) */}
      <CollapsibleSection id="upcoming" title="Upcoming days" badge={upcomingCount} palette={palette} d={d}>
        <UpcomingSection upcomingGroups={upcomingGroups} palette={palette} d={d} />
      </CollapsibleSection>

      {/* 6. By category (collapsible, starts closed) */}
      <CollapsibleSection id="categories" title="By category" badge={openCatCount} palette={palette} d={d}>
        <div style={{ paddingBottom: d.gap }}>
          {categoryData.map(cat => (
            <CategorySection
              key={cat.id} {...cat}
              palette={palette} d={d}
              onOpen={onOpenSchool}
            />
          ))}
        </div>
      </CollapsibleSection>

      <FAB onClick={onOpenVoice} accent={palette.accent} />
    </div>
  )
}
