export const fmt = (s, p) => (s || '').replace(/\{p\}/g, p)

// Tasks use `offset` (days from today). App converts to real dateISO at startup.
export const SEED_TASKS = [
  // Past done tasks — appear in category "past" sections, not today/upcoming
  { id: 'p1', done: true,  offset: -5, title: "Picture day order",           sub: "Paid",                                    cat: 'school',   time: null,       timeMin: null,     dueByEOD: false, flag: 'pay'  },
  { id: 'p2', done: true,  offset: -3, title: "Field trip permission slip",   sub: "Signed and returned",                     cat: 'school',   time: null,       timeMin: null,     dueByEOD: false, flag: 'sign' },

  // Today (offset 0)
  { id: 't1', done: true,  offset: 0, title: "Pack {p}'s pajamas",    sub: "For pajama day tomorrow",              cat: 'school',   time: null,       timeMin: null,     dueByEOD: false },
  { id: 't2', done: false, offset: 0, title: "{p} dentist",            sub: "Dr. Reyes · bring insurance card",     cat: 'medical',  time: '2:00 PM',  timeMin: 14*60,    dueByEOD: false },
  { id: 't3', done: false, offset: 0, title: "Yearbook payment",       sub: "$28 · school portal",                  cat: 'school',   time: null,       timeMin: null,     dueByEOD: true,  money: '$28' },
  { id: 't4', done: false, offset: 0, title: "Refill prescription",    sub: "CVS Maple Ave",                        cat: 'medical',  time: null,       timeMin: null,     dueByEOD: false },
  { id: 't5', done: false, offset: 0, title: "Water plants",           sub: "Front + back porches",                 cat: 'house',    time: null,       timeMin: null,     dueByEOD: false },
  { id: 't6', done: false, offset: 0, title: "Call landlord",          sub: "Re: porch light",                      cat: 'house',    time: '4:30 PM',  timeMin: 16*60+30, dueByEOD: false },

  // Tomorrow (offset 1)
  { id: 't7', done: false, offset: 1, title: "Groceries run",          sub: "Trader Joe's list",                    cat: 'house',    time: null,       timeMin: null,     dueByEOD: false },
  { id: 't8', done: false, offset: 1, title: "Movie night blanket",    sub: "Bring · {p}'s class",                  cat: 'school',   time: null,       timeMin: null,     dueByEOD: false, flag: 'bring' },
  { id: 't9', done: false, offset: 1, title: "Dentist forms",          sub: "Fill out and bring",                   cat: 'medical',  time: null,       timeMin: null,     dueByEOD: false },

  // +2 days
  { id: 't10', done: false, offset: 2, title: "Call mom back",         sub: "",                                     cat: 'personal', time: null,       timeMin: null,     dueByEOD: false },

  // +3 days
  { id: 't11', done: false, offset: 3, title: "Report card review",    sub: "Sign and return · parent portal",      cat: 'school',   time: null,       timeMin: null,     dueByEOD: false, flag: 'sign' },
  { id: 't12', done: false, offset: 3, title: "Red light session",     sub: "Self-care",                            cat: 'personal', time: '10:00 AM', timeMin: 10*60,    dueByEOD: false },
]
