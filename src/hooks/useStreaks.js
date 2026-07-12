import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { todayString, TIMED_TASKS } from '../lib/constants'

/**
 * useStreaks — computes habit streaks for a kid straight from history, so no
 * nightly job is needed. A day "counts" for a task when:
 *   reading / piano / spanish — that timer hit its target minutes that day
 *   shooting                  — at least one practice session was logged
 *   all_tasks                 — a Daily Dub (all three pillars) was earned
 *
 * Returns:
 *   byTask     — { [task_type]: { current_streak, longest_streak } }
 *   maxCurrent — highest current_streak across tasks (used for badge unlocks)
 *   loading, error
 */

const TARGET_SECONDS = Object.fromEntries(
  TIMED_TASKS.map(t => [t.id, (t.targetMinutes ?? 0) * 60])
)

export function useStreaks(kidId) {
  const [byTask, setByTask] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!kidId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      supabase
        .from('daily_logs')
        .select('date, reading_seconds, piano_seconds, spanish_seconds')
        .eq('kid_id', kidId),
      supabase
        .from('shot_sessions')
        .select('date')
        .eq('kid_id', kidId),
      supabase
        .from('daily_ws')
        .select('date')
        .eq('kid_id', kidId),
    ]).then(([logsRes, shotsRes, wsRes]) => {
      if (cancelled) return
      const err = logsRes.error || shotsRes.error || wsRes.error
      if (err) { setError(err.message); setLoading(false); return }

      const readingDates = new Set()
      const pianoDates   = new Set()
      const spanishDates = new Set()
      for (const l of logsRes.data ?? []) {
        if ((l.reading_seconds ?? 0) >= TARGET_SECONDS.reading) readingDates.add(l.date)
        if ((l.piano_seconds   ?? 0) >= TARGET_SECONDS.piano)   pianoDates.add(l.date)
        if ((l.spanish_seconds ?? 0) >= TARGET_SECONDS.spanish) spanishDates.add(l.date)
      }
      const shootingDates = new Set((shotsRes.data ?? []).map(r => r.date))
      const allTaskDates  = new Set((wsRes.data ?? []).map(r => r.date))

      const today = todayString()
      setByTask({
        reading:   streakStats(readingDates, today),
        piano:     streakStats(pianoDates, today),
        spanish:   streakStats(spanishDates, today),
        shooting:  streakStats(shootingDates, today),
        all_tasks: streakStats(allTaskDates, today),
      })
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [kidId])

  const maxCurrent = Object.values(byTask).reduce(
    (m, r) => Math.max(m, r.current_streak ?? 0),
    0
  )

  return { byTask, maxCurrent, loading, error }
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function shift(dateStr, deltaDays) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + deltaDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * current_streak — consecutive qualifying days ending today, or yesterday when
 *   today isn't done yet (so the streak doesn't read as broken every morning).
 *   0 once the most recent qualifying day is older than yesterday.
 * longest_streak — the longest run of consecutive qualifying days ever.
 */
function streakStats(dates, today) {
  if (dates.size === 0) return { current_streak: 0, longest_streak: 0 }

  let anchor = null
  if (dates.has(today)) anchor = today
  else if (dates.has(shift(today, -1))) anchor = shift(today, -1)

  let current = 0
  if (anchor) {
    let d = anchor
    while (dates.has(d)) { current++; d = shift(d, -1) }
  }

  let longest = 0
  for (const ds of dates) {
    if (dates.has(shift(ds, -1))) continue // only count a run from its start
    let n = 0, d = ds
    while (dates.has(d)) { n++; d = shift(d, 1) }
    if (n > longest) longest = n
  }

  return { current_streak: current, longest_streak: longest }
}
