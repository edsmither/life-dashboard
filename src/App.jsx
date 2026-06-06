import { useState, useMemo } from 'react'
import { SEED_TASKS, fmt } from './data/appData'
import { resolveTheme, densityScale } from './theme/tokens'
import {
  getTodayInfo, getTomorrowInfo, addDays,
  getWeekBounds, getCurrentWeek, getWeekRangeLabel, formatDayLabel,
} from './data/dateUtils'
import { useGoogleCalendar } from './hooks/useGoogleCalendar'
import Home from './components/Home'
import VoiceCapture from './components/VoiceCapture'
import SchoolDrilldown from './components/SchoolDrilldown'
import ReminderSheet from './components/ReminderSheet'

const SETTINGS_KEY = 'lifedash.settings'
const CATS = ['medical', 'school', 'house', 'personal']
const CAT_LABELS = { medical: 'Medical', school: 'School', house: 'House', personal: 'Personal' }
const GCAL_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {} }
  catch { return {} }
}

function seedToTasks() {
  const todayISO = getTodayInfo().dateISO
  return SEED_TASKS.map(t => ({ ...t, dateISO: addDays(todayISO, t.offset) }))
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

  const {
    isSignedIn: gCalConnected,
    events: calendarEvents,
    loading: gCalLoading,
    signIn: gCalSignIn,
    signOut: gCalSignOut,
    refresh: gCalRefresh,
  } = useGoogleCalendar(GCAL_CLIENT_ID)

  const palette = useMemo(() => resolveTheme(themeName, mode), [themeName, mode])
  const d = densityScale[density]

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }
  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const todayInfo    = getTodayInfo()
  const tomorrowInfo = getTomorrowInfo()
  const todayISO     = todayInfo.dateISO
  const tomorrowISO  = tomorrowInfo.dateISO
  const { weekStartISO, weekEndISO } = getWeekBounds(todayISO)

  // Local tasks + Google Calendar events merged for all time-based views
  const allItems = useMemo(() => [
    ...tasks,
    ...calendarEvents.filter(ev => !tasks.some(t => t.id === ev.id)),
  ], [tasks, calendarEvents])

  const todayTasks    = allItems.filter(t => t.dateISO === todayISO)
  const tomorrowTasks = allItems.filter(t => t.dateISO === tomorrowISO)

  // Category stats + school drilldown use local tasks only
  const schoolTasks    = tasks.filter(t => t.cat === 'school')
  const localWeekTasks = tasks.filter(t => t.dateISO >= weekStartISO && t.dateISO <= weekEndISO)

  const categoryStats = Object.fromEntries(
    CATS.map(cat => [cat, {
      total: localWeekTasks.filter(t => t.cat === cat).length,
      done:  localWeekTasks.filter(t => t.cat === cat && t.done).length,
    }])
  )
  const weekTotal = {
    expected:  localWeekTasks.length,
    completed: localWeekTasks.filter(t => t.done).length,
  }

  const openFutureTasks = allItems.filter(t => t.dateISO >= todayISO && !t.done)
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

  const futureTasks = allItems.filter(t => t.dateISO > todayISO)
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

  const tomorrowItems = tomorrowTasks.map(t => ({ id: t.id, label: fmt(t.title, persona) }))
  const weekDays  = getCurrentWeek(todayISO, allItems)
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
          gcalEnabled={!!GCAL_CLIENT_ID}
          gCalConnected={gCalConnected}
          gCalLoading={gCalLoading}
          onGCalSignIn={gCalSignIn}
          onGCalSignOut={gCalSignOut}
          onGCalRefresh={gCalRefresh}
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
