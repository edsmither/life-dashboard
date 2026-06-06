import { useState, useMemo } from 'react'
import { SEED_TASKS, DEFAULT_CATS, fmt } from './data/appData'
import { resolveTheme, densityScale } from './theme/tokens'
import {
  getTodayInfo, getTomorrowInfo, addDays,
  getWeekBounds, getCurrentWeek, getWeekRangeLabel, formatDayLabel,
} from './data/dateUtils'
import { useGoogleCalendar } from './hooks/useGoogleCalendar'
import Home from './components/Home'
import VoiceCapture from './components/VoiceCapture'
import SchoolDrilldown from './components/SchoolDrilldown'
import CategoriesScreen from './components/CategoriesScreen'

const SETTINGS_KEY = 'lifedash.settings'
const CATS_KEY     = 'lifedash.categories'
const GCAL_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {} }
  catch { return {} }
}

function loadCategories() {
  try { return JSON.parse(localStorage.getItem(CATS_KEY)) || DEFAULT_CATS }
  catch { return DEFAULT_CATS }
}

function seedToTasks() {
  const todayISO = getTodayInfo().dateISO
  return SEED_TASKS.map(t => ({ ...t, dateISO: addDays(todayISO, t.offset) }))
}

export default function App() {
  const saved = loadSettings()
  const [screen, setScreen] = useState('home')
  const [mode]      = useState(saved.mode     || 'light')
  const [density]   = useState(saved.density  || 'compact')
  const [themeName] = useState(saved.theme    || 'sage')
  const [persona]   = useState(saved.persona  || 'Ava')
  const [tasks,      setTasks]      = useState(seedToTasks)
  const [categories, setCategories] = useState(loadCategories)

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

  // ── Task mutations ───────────────────────────────────────
  function addTask(task) {
    setTasks(prev => [...prev, task])
  }
  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }
  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // ── Category mutations ───────────────────────────────────
  function saveCats(updated) {
    try { localStorage.setItem(CATS_KEY, JSON.stringify(updated)) } catch {}
    setCategories(updated)
  }
  function addCategory(cat) {
    saveCats([...categories, { ...cat, id: Date.now().toString() }])
  }
  function updateCategory(id, updates) {
    saveCats(categories.map(c => c.id === id ? { ...c, ...updates } : c))
  }
  function deleteCategory(id) {
    saveCats(categories.filter(c => c.id !== id))
  }

  // ── Date anchors ─────────────────────────────────────────
  const todayInfo    = getTodayInfo()
  const tomorrowInfo = getTomorrowInfo()
  const todayISO     = todayInfo.dateISO
  const tomorrowISO  = tomorrowInfo.dateISO
  const { weekStartISO, weekEndISO } = getWeekBounds(todayISO)

  // ── Merge local tasks + Google Calendar events ───────────
  const allItems = useMemo(() => [
    ...tasks,
    ...calendarEvents.filter(ev => !tasks.some(t => t.id === ev.id)),
  ], [tasks, calendarEvents])

  // ── Derived views ─────────────────────────────────────────
  const todayTasks    = allItems.filter(t => t.dateISO === todayISO)
  const schoolTasks   = tasks.filter(t => t.cat === 'school')
  const localWeekTasks = tasks.filter(t => t.dateISO >= weekStartISO && t.dateISO <= weekEndISO)

  const categoryStats = Object.fromEntries(
    categories.map(cat => [cat.id, {
      name:  cat.name,
      color: cat.color,
      total: localWeekTasks.filter(t => t.cat === cat.id).length,
      done:  localWeekTasks.filter(t => t.cat === cat.id && t.done).length,
    }])
  )
  const weekTotal = {
    expected:  localWeekTasks.length,
    completed: localWeekTasks.filter(t => t.done).length,
  }

  const openFutureTasks = allItems.filter(t => t.dateISO >= todayISO && !t.done)
  const categoryData = categories.map(cat => {
    const catTasks = openFutureTasks.filter(t => t.cat === cat.id)
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
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
    .slice(0, 7)
    .map(([dateISO, dayTasks]) => ({
      dateISO,
      dayLabel: formatDayLabel(dateISO, tomorrowISO),
      items: dayTasks.map(t => fmt(t.title, persona)).join(' · '),
      count: dayTasks.length,
    }))

  const weekDays  = getCurrentWeek(todayISO, allItems)
  const weekRange = getWeekRangeLabel(todayISO)
  const completedToday = todayTasks.filter(t => t.done).length

  const taskCounts = Object.fromEntries(
    categories.map(cat => [cat.id, tasks.filter(t => t.cat === cat.id).length])
  )

  const ctx = { palette, d, persona, mode, toggleTask, deleteTask, categories }

  return (
    <div style={{
      width: '100%', maxWidth: 412, minHeight: '100dvh',
      background: palette.bg, position: 'relative',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {screen === 'voice' && (
        <VoiceCapture {...ctx} onClose={() => setScreen('home')} onAddTask={addTask} />
      )}
      {screen === 'school' && (
        <SchoolDrilldown {...ctx} schoolTasks={schoolTasks} todayISO={todayISO} onBack={() => setScreen('home')} />
      )}
      {screen === 'categories' && (
        <CategoriesScreen
          palette={palette} d={d}
          categories={categories}
          taskCounts={taskCounts}
          onAdd={addCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'home' && (
        <Home
          {...ctx}
          tasks={todayTasks}
          completedToday={completedToday}
          todayInfo={todayInfo}
          tomorrowInfo={tomorrowInfo}
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
          onOpenCategories={() => setScreen('categories')}
        />
      )}
    </div>
  )
}
