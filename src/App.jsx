import { useState, useMemo } from 'react'
import { INITIAL_DATA } from './data/appData'
import { resolveTheme, densityScale } from './theme/tokens'
import { getTodayInfo, getTomorrowInfo, getCurrentWeek, getWeekRangeLabel } from './data/dateUtils'
import Home from './components/Home'
import VoiceCapture from './components/VoiceCapture'
import SchoolDrilldown from './components/SchoolDrilldown'
import ReminderSheet from './components/ReminderSheet'

const SETTINGS_KEY = 'lifedash.settings'

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {} }
  catch { return {} }
}

export default function App() {
  const saved = loadSettings()
  const [screen, setScreen] = useState('home')
  const [reminderOpen, setReminderOpen] = useState(false)
  const [mode] = useState(saved.mode || 'light')
  const [density] = useState(saved.density || 'compact')
  const [themeName] = useState(saved.theme || 'sage')
  const [persona] = useState(saved.persona || 'Ava')
  const [tasks, setTasks] = useState(() =>
    INITIAL_DATA.todayList.map(t => ({ ...t, dateISO: getTodayInfo().dateISO }))
  )

  const palette = useMemo(() => resolveTheme(themeName, mode), [themeName, mode])
  const d = densityScale[density]

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const todayInfo = getTodayInfo()
  const tomorrowInfo = getTomorrowInfo()
  const weekDays = getCurrentWeek(todayInfo.dateISO, tasks.length)
  const weekRange = getWeekRangeLabel(todayInfo.dateISO)
  const completedToday = tasks.filter(t => t.done).length

  const ctx = { palette, d, persona, mode, tasks, toggleTask, deleteTask, completedToday }

  return (
    <div style={{
      width: '100%',
      maxWidth: 412,
      minHeight: '100dvh',
      background: palette.bg,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {screen === 'voice' && (
        <VoiceCapture {...ctx} onClose={() => setScreen('home')} />
      )}
      {screen === 'school' && (
        <SchoolDrilldown {...ctx} onBack={() => setScreen('home')} />
      )}
      {screen === 'home' && (
        <Home
          {...ctx}
          data={INITIAL_DATA}
          todayInfo={todayInfo}
          tomorrowInfo={tomorrowInfo}
          weekDays={weekDays}
          weekRange={weekRange}
          onOpenVoice={() => setScreen('voice')}
          onOpenSchool={() => setScreen('school')}
          onOpenReminder={() => setReminderOpen(true)}
        />
      )}
      {reminderOpen && (
        <ReminderSheet {...ctx} tomorrowInfo={tomorrowInfo} onClose={() => setReminderOpen(false)} />
      )}
    </div>
  )
}
