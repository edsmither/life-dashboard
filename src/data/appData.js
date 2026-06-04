export const fmt = (s, p) => (s || '').replace(/\{p\}/g, p)

export const INITIAL_DATA = {
  today: 'Thursday, May 21',
  todayShort: 'Thu · May 21',
  weekRange: 'May 19–25',

  stats: { thisWeek: 11, todayCount: 3, personaCount: 2, doneToday: 1, totalToday: 3 },

  categoryStats: {
    medical:  { total: 4, done: 1 },
    school:   { total: 6, done: 2 },
    house:    { total: 4, done: 1 },
    personal: { total: 2, done: 1 },
  },
  weekTotal: { expected: 16, completed: 5 },

  categories: [
    { id: 'school',   name: 'School',   count: 4 },
    { id: 'medical',  name: 'Medical',  count: 2 },
    { id: 'house',    name: 'House',    count: 3 },
    { id: 'personal', name: 'Personal', count: 2 },
  ],

  categoryPreview: {
    school:   'Movie night blanket Fri · Report card Thu · Yearbook $',
    medical:  '{p} dentist Tue 2pm · Refill prescription',
    house:    'Groceries · Call landlord · Water plants',
    personal: 'Red light session · Call mom back',
  },

  todayList: [
    { id: 't1', done: true,  title: 'Pack {p}’s pajamas', sub: 'For pajama day tomorrow',           cat: 'school',  date: 'Today', dateISO: '2026-05-21', time: null,      timeMin: null,   dueByEOD: false },
    { id: 't2', done: false, title: '{p} dentist',             sub: 'Dr. Reyes · bring insurance card',  cat: 'medical', date: 'Today', dateISO: '2026-05-21', time: '2:00 PM', timeMin: 14*60,  dueByEOD: false },
    { id: 't3', done: false, title: 'Yearbook payment',        sub: '$28 · school portal',               cat: 'school',  date: 'Today', dateISO: '2026-05-21', time: null,      timeMin: null,   dueByEOD: true,  money: '$28' },
    { id: 't4', done: false, title: 'Refill prescription',     sub: 'CVS Maple Ave',                     cat: 'medical', date: 'Today', dateISO: '2026-05-21', time: null,      timeMin: null,   dueByEOD: false },
    { id: 't5', done: false, title: 'Water plants',            sub: 'Front + back porches',              cat: 'house',   date: 'Today', dateISO: '2026-05-21', time: null,      timeMin: null,   dueByEOD: false },
    { id: 't6', done: false, title: 'Call landlord',           sub: 'Re: porch light',                   cat: 'house',   date: 'Today', dateISO: '2026-05-21', time: '4:30 PM', timeMin: 16*60+30, dueByEOD: false },
  ],

  upcoming: [
    { day: 'Fri', date: 'May 22', items: 'Movie night blanket · Groceries',     count: 2 },
    { day: 'Sat', date: 'May 23', items: null,                                  count: 0 },
    { day: 'Sun', date: 'May 24', items: 'Call mom back · Refill prescription', count: 2 },
  ],

  voiceExamples: [
    '{p}’s dentist appointment Thursday 2pm',
    'Bring blanket for movie night Friday',
    'Pay yearbook fee, due today, $28',
  ],

  schoolItems: [
    { id: 's1', done: false, title: 'Movie night blanket', sub: 'Bring · Friday · Mrs. Patel’s class',  due: 'Fri May 22', flag: 'bring' },
    { id: 's2', done: false, title: 'Report card review',  sub: 'Sign and return · parent portal',           due: 'Thu May 22', flag: 'sign'  },
    { id: 's3', done: false, title: 'Yearbook payment',    sub: '$28 · due today · school portal',           due: 'Today',      flag: 'pay'   },
    { id: 's4', done: false, title: 'Pajama day',          sub: 'Tomorrow · all-school spirit day',          due: 'Tmw',        flag: 'wear'  },
  ],

  schoolPast: [
    { id: 'p1', done: true, title: 'Field trip permission slip', sub: 'Signed · returned May 14' },
    { id: 'p2', done: true, title: 'Picture day order',          sub: 'Paid · May 12' },
  ],

  weekDays: [
    { letter: 'M', num: 19, dots: 2, hasDone: true  },
    { letter: 'T', num: 20, dots: 3, hasDone: true  },
    { letter: 'W', num: 21, dots: 3, hasDone: false, isToday: true },
    { letter: 'T', num: 22, dots: 2, hasDone: false },
    { letter: 'F', num: 23, dots: 2, hasDone: false },
    { letter: 'S', num: 24, dots: 1, hasDone: false },
    { letter: 'S', num: 25, dots: 1, hasDone: false },
  ],

  tomorrowItems: [
    { id: 'tb1', label: 'Pack pajamas' },
    { id: 'tb2', label: 'Pack blanket' },
    { id: 'tb3', label: 'Dentist forms' },
  ],
}
