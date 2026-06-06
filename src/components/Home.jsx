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

function CollapsibleSection({ id, title, badge, action, children, palette, d }) {
  const [open, toggle] = useCollapsible(id)
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={toggle}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: `10px ${d.pad}px`, background: 'none', border: 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: palette.ink }}>{title}</span>
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
        {action && (
          <div style={{ paddingRight: d.pad }}>
            {action}
          </div>
        )}
      </div>
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

function GCalStrip({ gcalEnabled, connected, loading, onSignIn, onSignOut, onRefresh, palette, d }) {
  if (!gcalEnabled) return null
  const base = { display: 'flex', alignItems: 'center', gap: 6, padding: `0 ${d.pad}px 10px` }
  if (loading) return (
    <div style={base}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: palette.accent, opacity: 0.5 }} />
      <span style={{ fontSize: 11, color: palette.inkMute }}>Syncing calendar…</span>
    </div>
  )
  if (connected) return (
    <div style={base}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50' }} />
      <span style={{ fontSize: 11, color: palette.inkMute }}>Google Calendar</span>
      <button onClick={onRefresh} style={{ marginLeft: 'auto', fontSize: 11, color: palette.inkMute, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        refresh
      </button>
      <span style={{ fontSize: 11, color: palette.line }}>·</span>
      <button onClick={onSignOut} style={{ fontSize: 11, color: palette.inkMute, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        disconnect
      </button>
    </div>
  )
  return (
    <div style={{ padding: `0 ${d.pad}px 12px` }}>
      <button
        onClick={onSignIn}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 99,
          background: 'none', border: `1px solid ${palette.line}`,
          cursor: 'pointer', fontSize: 12, fontWeight: 600, color: palette.inkSoft,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        Connect Google Calendar
      </button>
    </div>
  )
}

function CategoryIcon({ id }) {
  const s = { strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  if (id === 'school') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...s}>
      <path d="M12 3L2 8l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  )
  if (id === 'medical') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...s}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  )
  if (id === 'house') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...s}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM9 22V12h6v10"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...s}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
    </svg>
  )
}

function CategorySection({ id, name, count, preview, color, palette, d, onOpen }) {
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
            color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CategoryIcon id={id} />
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
  palette, d, persona, tasks, toggleTask, deleteTask, completedToday, categories,
  todayInfo, tomorrowInfo,
  weekDays, weekRange, weekTotal, categoryStats, categoryData, upcomingGroups,
  gcalEnabled, gCalConnected, gCalLoading, onGCalSignIn, onGCalSignOut, onGCalRefresh,
  onOpenVoice, onOpenSchool, onOpenCategories,
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

      {/* 1b. Google Calendar strip */}
      <GCalStrip
        gcalEnabled={gcalEnabled}
        connected={gCalConnected}
        loading={gCalLoading}
        onSignIn={onGCalSignIn}
        onSignOut={onGCalSignOut}
        onRefresh={onGCalRefresh}
        palette={palette} d={d}
      />

      {/* 2. Week strip */}
      <WeekStrip days={weekDays} palette={palette} d={d} />

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
          palette={palette} d={d} persona={persona} categories={categories}
        />
      </div>

      {/* 4. Week overview */}
      <div style={{ margin: `0 ${d.pad}px ${d.gap}px` }}>
        <WeekOverview
          palette={palette} d={d}
          weekTotal={weekTotal}
          categoryStats={categoryStats}
          weekRange={weekRange}
        />
      </div>

      {/* 5. Upcoming days — now includes tomorrow */}
      <CollapsibleSection id="upcoming" title="Upcoming days" badge={upcomingCount} palette={palette} d={d}>
        <UpcomingSection upcomingGroups={upcomingGroups} palette={palette} d={d} />
      </CollapsibleSection>

      {/* 6. By category */}
      <CollapsibleSection
        id="categories" title="By category" badge={openCatCount} palette={palette} d={d}
        action={
          <button
            onClick={onOpenCategories}
            style={{
              fontSize: 11, fontWeight: 600, color: palette.inkMute,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            }}
          >
            Manage
          </button>
        }
      >
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
