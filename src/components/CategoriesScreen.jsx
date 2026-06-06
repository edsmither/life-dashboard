import { useState } from 'react'

const COLOR_OPTIONS = [
  '#6b8e6e', '#5b7a91', '#b78850', '#8a5e7d',
  '#c0636b', '#6b8eb5', '#7a9166', '#5b8a7a',
]

function ColorPicker({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {COLOR_OPTIONS.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: c,
            border: `3px solid ${selected === c ? '#222' : 'transparent'}`,
            cursor: 'pointer', flexShrink: 0,
            transition: 'border 0.15s',
          }}
        />
      ))}
    </div>
  )
}

export default function CategoriesScreen({ palette, d, categories, taskCounts, onAdd, onUpdate, onDelete, onBack }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [addName, setAddName] = useState('')
  const [addColor, setAddColor] = useState(COLOR_OPTIONS[0])
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  function startEdit(cat) {
    setEditId(cat.id)
    setEditName(cat.name)
    setEditColor(cat.color)
    setShowAddForm(false)
  }

  function saveEdit() {
    if (editName.trim()) onUpdate(editId, { name: editName.trim(), color: editColor })
    setEditId(null)
  }

  function handleAdd() {
    if (addName.trim()) {
      onAdd({ name: addName.trim(), color: addColor })
      setAddName('')
      setAddColor(COLOR_OPTIONS[0])
      setShowAddForm(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: `1.5px solid ${palette.accent}`,
    background: palette.bg,
    fontSize: 14, fontWeight: 600, color: palette.ink,
    outline: 'none', boxSizing: 'border-box',
    marginBottom: 12,
  }
  const btnPrimary = {
    flex: 1, padding: 10, borderRadius: 10,
    background: palette.accent, border: 'none',
    color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  }
  const btnGhost = {
    flex: 1, padding: 10, borderRadius: 10,
    background: palette.surfaceAlt, border: `1px solid ${palette.line}`,
    color: palette.inkSoft, fontWeight: 600, fontSize: 13, cursor: 'pointer',
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: palette.bg }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: `${d.pad + 8}px ${d.pad}px ${d.pad}px`,
        borderBottom: `1px solid ${palette.line}`,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: palette.surface, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: palette.shadow, flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke={palette.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.16em' }}>SETTINGS</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: palette.ink }}>Categories</div>
        </div>
      </div>

      {/* Category list */}
      <div style={{ padding: `${d.gap}px 0 0` }}>
        {categories.map(cat => {
          const count = taskCounts[cat.id] || 0
          const isEditing = editId === cat.id
          return (
            <div key={cat.id} style={{
              margin: `0 ${d.pad}px ${d.gap}px`,
              background: palette.surface,
              borderRadius: 14,
              padding: d.cardPad,
              boxShadow: palette.shadow,
            }}>
              {isEditing ? (
                <>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    style={inputStyle}
                  />
                  <ColorPicker selected={editColor} onChange={setEditColor} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={saveEdit} style={btnPrimary}>Save</button>
                    <button onClick={() => setEditId(null)} style={btnGhost}>Cancel</button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: palette.ink }}>{cat.name}</span>
                  {count > 0 && (
                    <span style={{
                      fontSize: 11, color: palette.inkMute,
                      background: palette.surfaceAlt,
                      padding: '2px 8px', borderRadius: 99,
                    }}>
                      {count} task{count !== 1 ? 's' : ''}
                    </span>
                  )}
                  <button
                    onClick={() => startEdit(cat)}
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: palette.surfaceAlt, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={palette.inkSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => count === 0 && onDelete(cat.id)}
                    disabled={count > 0}
                    title={count > 0 ? `Move or delete ${count} task${count !== 1 ? 's' : ''} first` : 'Delete category'}
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: palette.surfaceAlt, border: 'none',
                      cursor: count > 0 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: count > 0 ? 0.3 : 1,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={count > 0 ? palette.inkMute : '#e05555'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add form */}
      <div style={{ padding: `0 ${d.pad}px ${d.gap * 3}px` }}>
        {showAddForm ? (
          <div style={{
            background: palette.surface, borderRadius: 14,
            padding: d.cardPad, boxShadow: palette.shadow,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: palette.inkMute, letterSpacing: '0.14em', marginBottom: 10 }}>
              NEW CATEGORY
            </div>
            <input
              value={addName}
              onChange={e => setAddName(e.target.value)}
              placeholder="Category name"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={inputStyle}
            />
            <ColorPicker selected={addColor} onChange={setAddColor} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleAdd} style={btnPrimary}>Add</button>
              <button onClick={() => { setShowAddForm(false); setAddName('') }} style={btnGhost}>Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setShowAddForm(true); setEditId(null) }}
            style={{
              width: '100%', padding: 14, borderRadius: 14,
              background: 'none', border: `1.5px dashed ${palette.line}`,
              fontSize: 13, fontWeight: 600, color: palette.inkSoft,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add category
          </button>
        )}
      </div>
    </div>
  )
}
