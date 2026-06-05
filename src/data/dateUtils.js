const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LETTERS = ['M','T','W','T','F','S','S']

export function getTodayInfo() {
  const now = new Date()
  return {
    dayName: DAY_NAMES[now.getDay()],
    monthName: MONTH_NAMES[now.getMonth()],
    monthShort: MONTH_SHORT[now.getMonth()],
    dayNum: now.getDate(),
    dateISO: now.toISOString().slice(0, 10),
  }
}

export function addDays(dateISO, n) {
  const d = new Date(dateISO + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function getTomorrowInfo() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return {
    dayShort: DAY_NAMES[d.getDay()].slice(0, 3),
    monthShort: MONTH_SHORT[d.getMonth()],
    dayNum: d.getDate(),
    dateLabel: `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`,
    shortLabel: `${DAY_NAMES[d.getDay()].slice(0, 3)} · ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`,
    dateISO: addDays(new Date().toISOString().slice(0, 10), 1),
  }
}

export function getWeekBounds(todayISO) {
  const today = new Date(todayISO + 'T12:00:00')
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const mon = new Date(today); mon.setDate(today.getDate() + mondayOffset)
  const sun = new Date(today); sun.setDate(today.getDate() + mondayOffset + 6)
  return {
    weekStartISO: mon.toISOString().slice(0, 10),
    weekEndISO: sun.toISOString().slice(0, 10),
  }
}

export function formatDayLabel(dateISO, tomorrowISO) {
  if (dateISO === tomorrowISO) return 'Tomorrow'
  const d = new Date(dateISO + 'T12:00:00')
  return `${DAY_NAMES[d.getDay()].slice(0, 3)} · ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`
}

// Returns Mon–Sun of the current week with dot counts from actual task data
export function getCurrentWeek(todayISO, tasks = []) {
  const today = new Date(todayISO + 'T12:00:00')
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow

  return DAY_LETTERS.map((letter, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + mondayOffset + i)
    const iso = d.toISOString().slice(0, 10)
    const isToday = iso === todayISO
    const dayTasks = tasks.filter(t => t.dateISO === iso)
    return {
      letter,
      num: d.getDate(),
      isToday,
      dots: Math.min(dayTasks.length, 3),
      doneDots: Math.min(dayTasks.filter(t => t.done).length, 3),
    }
  })
}

export function getWeekRangeLabel(todayISO) {
  const today = new Date(todayISO + 'T12:00:00')
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const mon = new Date(today); mon.setDate(today.getDate() + mondayOffset)
  const sun = new Date(today); sun.setDate(today.getDate() + mondayOffset + 6)
  const sameMonth = mon.getMonth() === sun.getMonth()
  if (sameMonth) return `${MONTH_SHORT[mon.getMonth()]} ${mon.getDate()}–${sun.getDate()}`
  return `${MONTH_SHORT[mon.getMonth()]} ${mon.getDate()} – ${MONTH_SHORT[sun.getMonth()]} ${sun.getDate()}`
}
