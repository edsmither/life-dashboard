export const fmt = (s, p) => (s || '').replace(/\{p\}/g, p)

export const SEED_TASKS = []

export const DEFAULT_CATS = [
  { id: 'medical',  name: 'Medical',  color: '#5b7a91' },
  { id: 'school',   name: 'School',   color: '#6b8e6e' },
  { id: 'house',    name: 'House',    color: '#b78850' },
  { id: 'personal', name: 'Personal', color: '#8a5e7d' },
]
