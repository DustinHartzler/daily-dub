// ─── Kids ────────────────────────────────────────────────────────────────────
export const KIDS = [
  { id: 'kenley', name: 'Kenley', age: 12, icon: 'dancer' },
  { id: 'kellen', name: 'Kellen', age: 9,  icon: 'person-standing' },
]

// ─── Daily Chores ─────────────────────────────────────────────────────────────
const SHARED_CHORES = [
  'Make bed',
  'Pick up clothes',
  'Brush teeth (AM)',
]

export const CHORES_BY_KID = {
  kenley: SHARED_CHORES,
  kellen: SHARED_CHORES,
}

export const getChores = (kidId) => CHORES_BY_KID[kidId] ?? []

// ─── Timed Tasks ──────────────────────────────────────────────────────────────
export const TIMED_TASKS = [
  { id: 'reading', label: 'Reading', icon: 'book-open', targetMinutes: 15 },
  { id: 'piano',   label: 'Piano',   icon: 'music',     targetMinutes: 15 },
  { id: 'spanish', label: 'Spanish', icon: 'languages', targetMinutes: 15, hasNote: true, notePlaceholder: 'What did you do? (Duolingo, show, book…)' },
]

// ─── Basketball Shot Types ────────────────────────────────────────────────────
export const SHOT_TYPES = [
  'Free Throws',
  '3-Pointers',
  'Mid-Range',
  'Layups',
  'Total',
]

// ─── Theme ────────────────────────────────────────────────────────────────────
export const THEME = {
  purple:   '#4B2D83',
  gold:     '#F2A900',
  dark:     '#0F0C17',
  surface:  '#1A1530',
  surface2: '#221D3A',
  text:     '#F0EBF8',
  muted:    '#8B7FA8',
  border:   '#2D2650',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Returns today's date as a YYYY-MM-DD string (local time) */
export const todayString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Returns a blank daily log for a kid */
export const blankDailyLog = (kidId) => ({
  kid_id:          kidId,
  date:            todayString(),
  chores:          {},           // { 'Make bed': true, ... }
  reading_seconds: 0,
  piano_seconds:   0,
  spanish_seconds: 0,
  spanish_note:    '',
})
