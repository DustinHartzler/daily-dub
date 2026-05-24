// ─── Kids ────────────────────────────────────────────────────────────────────
export const KIDS = [
  { id: 'kenley', name: 'Kenley', age: 12, emoji: '🏀' },
  { id: 'kellen', name: 'Kellen', age: 9,  emoji: '⛹️'  },
]

// ─── Daily Chores ─────────────────────────────────────────────────────────────
// Shared across both kids — extend per-kid in a future iteration if needed
export const CHORES = [
  'Make bed',
  'Pick up clothes',
  'Clean room',
  'Take out trash',
  'Feed pets',
  'Brush teeth (AM)',
  'Brush teeth (PM)',
  'Put dishes away',
]

// ─── Timed Tasks ──────────────────────────────────────────────────────────────
export const TIMED_TASKS = [
  { id: 'reading', label: 'Reading',  icon: '📖', targetMinutes: 15 },
  { id: 'piano',   label: 'Piano',    icon: '🎹', targetMinutes: 15 },
  { id: 'spanish', label: 'Spanish',  icon: '🇪🇸', targetMinutes: 15 },
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
})
