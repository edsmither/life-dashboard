import { useState } from 'react'
import { fmt } from '../data/appData'

const catColors = {
  school: '#6b8e6e', medical: '#5b7a91', house: '#b78850', personal: '#8a5e7d',
}

function SortIcon({ active, dir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 2 }}>
      <path d="M5 2v6M2.5 4.5L5 2l2.5 2.5" stroke={active ? '#6b8e6e' : '#aaa'} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: active && dir === 'desc' ? 'scaleY(-1)' : 'none', transformOrigin: '5px 5px' }}
      />
    </svg>
  )
}

function TaskRow({ task, toggleTask, palette, persona }) {
  const color = catColors[task.cat] || palette.accent
  const timeLabel = task.time || (task.dueByEOD ? 'EOD' : '—')

  return (
    <tr
      style={{ opacity: task.done ? 0.55 : 1, transition: 'opacity 0.15s' }}
      onClick={() => toggleTask(task.id)}
    >
      <td style={{ padding: '10px 4px 10px 0', width: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
            border: `2px solid ${task.done ? color : palette.line}`,
            background: task.done ? color : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            {task.done && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 11, color: palette.inkSoft, fontWeight: 600 }}>{timeLabel}</span>
        </div>
      </td>
      <td style={{ padding: '10px 4px', fontSize: 11, color: palette.inkMute, width: 32 }}>
        {task.dateISO ? task.dateISO.slice(5).replace('-', '/') : ''}
      </td>
      <td style={{ padding: '10px 4px', maxWidth: 140 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: palette.ink,
          textDecoration: task.done ? 'line-through' : 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {fmt(task.title, 'Ava')}
        </div>
        <div style={{
          fontSize: 11, color: palette.inkMute,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {task.sub}
        </div>
      </td>
      <td style={{ padding: '10px 0 10px 4px', textAlign: 'right' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color,
          background: color + '18',
          padding: '2px 7px', borderRadius: 99,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
        }}>
          {task.cat}
        </span>
      </td>
    </tr>
  )
}

export default function TodayTable({ tasks, toggleTask, palette, d, persona }) {
  const [sortBy, setSortBy] = useState('time')
  const [dir, setDir] = useState('asc')
  const [hideDone, setHideDone] = useState(false)

  function handleSort(col) {
    if (sortBy === col) setDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setDir('asc') }
  }

  const sorted = [...tasks]
    .filter(t => hideDone ? !t.done : true)
    .sort((a, b) => {
      let va, vb
      if (sortBy === 'time') {
        va = a.timeMin ?? (a.dueByEOD ? 23 * 60 + 59 : 99999)
        vb = b.timeMin ?? (b.dueByEOD ? 23 * 60 + 59 : 99999)
      } else if (sortBy === 'date') {
        va = a.dateISO; vb = b.dateISO
      } else if (sortBy === 'desc') {
        va = a.title; vb = b.title
      } else if (sortBy === 'cat') {
        va = a.cat; vb = b.cat
      }
      if (va < vb) return dir === 'asc' ? -1 : 1
      if (va > vb) return dir === 'asc' ? 1 : -1
      return 0
    })

  const colStyle = col => ({
    fontSize: 10, fontWeight: 700, color: sortBy === col ? palette.accent : palette.inkMute,
    letterSpacing: '0.12em', padding: '8px 4px', cursor: 'pointer',
    userSelect: 'none', whiteSpace: 'nowrap',
  })

  return (
    <div style={{
      background: palette.surface,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: palette.shadow,
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `10px ${d.cardPad - 4}px 0`,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.16em' }}>
          TODAY · SPREADSHEET
        </span>
        <button
          onClick={() => setHideDone(h => !h)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 600, color: hideDone ? palette.accent : palette.inkMute,
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
          }}
        >
          <div style={{
            width: 14, height: 14, borderRadius: 3,
            border: `1.5px solid ${hideDone ? palette.accent : palette.inkMute}`,
            background: hideDone ? palette.accent : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', flexShrink: 0,
          }}>
            {hideDone && (
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          HIDE DONE
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', padding: `0 ${d.cardPad - 4}px` }}>
        <thead>
          <tr>
            <th style={{ ...colStyle('time'), paddingLeft: d.cardPad - 4 }} onClick={() => handleSort('time')}>
              TIME <SortIcon active={sortBy === 'time'} dir={dir} />
            </th>
            <th style={colStyle('date')} onClick={() => handleSort('date')}>
              DATE <SortIcon active={sortBy === 'date'} dir={dir} />
            </th>
            <th style={colStyle('desc')} onClick={() => handleSort('desc')}>
              DESCRIPTION <SortIcon active={sortBy === 'desc'} dir={dir} />
            </th>
            <th style={{ ...colStyle('cat'), paddingRight: d.cardPad - 4, textAlign: 'right' }} onClick={() => handleSort('cat')}>
              CATEGORY <SortIcon active={sortBy === 'cat'} dir={dir} />
            </th>
          </tr>
        </thead>
        <tbody style={{ borderTop: `1px solid ${palette.line}` }}>
          {sorted.map(task => (
            <TaskRow
              key={task.id} task={task} toggleTask={toggleTask}
              palette={palette} persona={persona}
            />
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div style={{ textAlign: 'center', padding: 24, color: palette.inkMute, fontSize: 13 }}>
          All done for today 🎉
        </div>
      )}
    </div>
  )
}
