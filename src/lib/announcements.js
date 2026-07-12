import { todayString } from './constants'

/**
 * Split announcement rows into the three buckets the Today tab renders.
 *   standing    — undated notes, pinned to the top until removed
 *   todayEvents — dated for today
 *   upcoming    — dated for a future day (past dated events are hidden)
 */
export function categorize(items, today = todayString()) {
  const standing = []
  const todayEvents = []
  const upcoming = []
  for (const it of items) {
    if (!it.date) standing.push(it)
    else if (it.date === today) todayEvents.push(it)
    else if (it.date > today) upcoming.push(it)
  }
  return { standing, todayEvents, upcoming }
}

/** "2:00 PM – 3:00 PM", "2:00 PM", or "All day" when no start time. */
export function formatTimeRange(start, end) {
  if (!start) return 'All day'
  const s = formatTime(start)
  return end ? `${s} – ${formatTime(end)}` : s
}

function formatTime(t) {
  const [hStr, m] = t.split(':')
  let h = parseInt(hStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

/** "Sat, Jul 12" from a YYYY-MM-DD string (parsed in local time). */
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
