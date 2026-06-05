import { useState, useMemo } from 'react'
import { SEED_TASKS, fmt } from './data/appData'
import { resolveTheme, densityScale } from './theme/tokens'
import {
  getTodayInfo, getTomorrowInfo, addDays,
  getWeekBounds, getCurrentWeek, getWeekRangeLabel, formatDayLabel,
} from './data/dateUtils'
import Home from './components/Home'
import VoiceCapture from './components/VoiceCapture'
import SchoolDrilldown from './components/SchoolDrilldown'
import ReminderSheet from './components/ReminderSheet'

const SETTINGS_KEY = 'lifedash.settings'
const CATS = ['medical', 'school', 'house', 'personal']
const CAT_LABELS = { medical: 'Medical', school: 'School', house: 'House', personal: 'Personal' }

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {} }
  catch { return {} }
}

// Resolve seed tasks to real ISO dates once at startup
function seedToTasks() {
  const todayISO = getTodayInfo().dateISO
  return SEED_TASKS.map(t => {
    const dateISO = addDays(todayISO, t.offset)
    return { ...t, dateISO }
  })
}

export default function App() {
  const saved = loadSettings()
  const [screen, setScreen] = useState('home')
  const [reminderOpen, setReminderOpen] = useState(false)
  const [mode] = useState(saved.mode || 'light')
  const [density] = useState(saved.density || 'compact')
  const [themeName] = useState(saved.theme || 'sage')
  const [persona] = useState(saved.persona || 'Ava')
  const [tasks, setTasks] = useState(seedToTasks)

  const palette = useMemo(() => resolveTheme(themeName, mode), [themeName, mode])
  const d = densityScale[density]

  // ── Mutations ───────────────────────────────────────────
  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }
  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // ── Date anchors ────────────────────────────────────────
  const todayInfo = getTodayInfo()
  const tomorrowInfo = getTomorrowInfo()
  const todayISO = todayInfo.dateISO
  const tomorrowISO = tomorrowInfo.dateISO
  const { weekStartISO, weekEndISO } = getWeekBounds(todayISO)

  // ── Derived task views ──────────────────────────────────
  const todayTasks    = tasks.filter(t => t.dateISO === todayISO)
  const tomorrowTasks = tasks.filter(t => t.dateISO === tomorrowISO)
  const weekTasks     = tasks.filter(t => t.dateISO >= weekStartISO && t.dateISO <= weekEndISO)
  const schoolTasks   = tasks.filter(t => t.cat === 'school')

  // ── Week overview stats (live) ──────────────────────────
  const categoryStats = Object.fromEntries(
    CATS.map(cat => [cat, {
      total: weekTasks.filter(t => t.cat === cat).length,
      done:  weekTasks.filter(t => t.cat === cat && t.done).length,
    }])
  )
  const weekTotal = {
    expected:  weekTasks.length,
    completed: weekTasks.filter(t => t.done).length,
  }

  // ── Category section data (open/pending tasks from today forward) ──
  const openFutureTasks = tasks.filter(t => t.dateISO >= todayISO && !t.done)
  const categoryData = CATS.map(cat => {
    const catTasks = openFutureTasks.filter(t => t.cat === cat)
    return {
      id: cat,
      name: CAT_LABELS[cat],
      count: catTasks.length,
      preview: catTasks.length === 0
        ? 'All clear'
        : catTasks.slice(0, 3).map(t => fmt(t.title, persona)).join(' · '),
    }
  })

  // ── Upcoming groups (days after today, up to 5 days out) ──
  const futureTasks = tasks.filter(t => t.dateISO > todayISO)
  const dateMap = {}
  futureTasks.forEach(t => {
    if (!dateMap[t.dateISO]) dateMap[t.dateISO] = []
    dateMap[t.dateISO].push(t)
  })
  const upcomingGroups = Object.entries(dateMap)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(0, 5)
    .map(([dateISO, dayTasks]) => ({
      dateISO,
      dayLabel: formatDayLabel(dateISO, tomorrowISO),
      items: dayTasks.map(t => fmt(t.title, persona)).join(' · '),
      count: dayTasks.length,
    }))

  // ── Tomorrow brief items ────────────────────────────────
  const tomorrowItems = tomorrowTasks.map(t => ({ id: t.id, label: fmt(t.title, persona) }))

  // ── Week strip ──────────────────────────────────────────
  const weekDays  = getCurrentWeek(todayISO, tasks)
  const weekRange = getWeekRangeLabel(todayISO)

  const completedToday = todayTasks.filter(t => t.done).length

  const ctx = { palette, d, persona, mode, toggleTask, deleteTask }

  return (
    <div style={{
      width: '100%', maxWidth: 412, minHeight: '100dvh',
      background: palette.bg, position: 'relative',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {screen === 'voice' && (
        <VoiceCapture {...ctx} onClose={() => setScreen('home')} />
      )}
      {screen === 'school' && (
        <SchoolDrilldown {...ctx} schoolTasks={schoolTasks} todayISO={todayISO} onBack={() => setScreen('home')} />
      )}
      {screen === 'home' && (
        <Home
          {...ctx}
          tasks={todayTasks}
          completedToday={completedToday}
          todayInfo={todayInfo}
          tomorrowInfo={tomorrowInfo}
          tomorrowItems={tomorrowItems}
          weekDays={weekDays}
          weekRange={weekRange}
          weekTotal={weekTotal}
          categoryStats={categoryStats}
          categoryData={categoryData}
          upcomingGroups={upcomingGroups}
          onOpenVoice={() => setScreen('voice')}
          onOpenSchool={() => setScreen('school')}
          onOpenReminder={() => setReminderOpen(true)}
        />
      )}
      {reminderOpen && (
        <ReminderSheet
          {...ctx}
          tomorrowInfo={tomorrowInfo}
          tomorrowItems={tomorrowItems}
          onClose={() => setReminderOpen(false)}
        />
      )}
    </div>
  )
}
