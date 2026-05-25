import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { todayString } from '../lib/constants'
import { computePillars, allPillarsDone } from '../lib/pillars'
import { useDailyLog } from './useDailyLog'

/**
 * useDailyW — computes Mind/Body/Character pillars for today, and persists a
 * `daily_ws` row when all three hit. Reads back the kid's W history for
 * streak + counts.
 *
 * Returns:
 *   pillars       — { mind, body, character } each { progress, done, total, completed }
 *   earnedToday   — boolean, derived from pillars
 *   savedToday    — boolean, true once we've persisted today's W row
 *   currentStreak — consecutive days with a W ending today (0 if today not yet earned)
 *   weeklyCount   — Ws this calendar week (Sun-anchored to match StatsPage convention)
 *   allTimeCount  — total Ws ever
 *   loading, error
 */
export function useDailyW(kidId) {
  const { log } = useDailyLog(kidId)
  const [hadShotsToday, setHadShotsToday] = useState(false)
  const [wDates, setWDates]   = useState(new Set())
  const [savedToday, setSaved] = useState(false)
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState(null)

  const today = todayString()

  // Load shots-today + W history on mount/kid change
  useEffect(() => {
    if (!kidId) return
    let cancelled = false
    setLoading(true)

    Promise.all([
      supabase
        .from('shot_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('kid_id', kidId)
        .eq('date', today),
      supabase
        .from('daily_ws')
        .select('date')
        .eq('kid_id', kidId)
        .order('date', { ascending: false }),
    ]).then(([shotsRes, wsRes]) => {
      if (cancelled) return
      if (shotsRes.error || wsRes.error) {
        setError((shotsRes.error || wsRes.error).message)
      } else {
        setHadShotsToday((shotsRes.count ?? 0) > 0)
        const dates = new Set((wsRes.data ?? []).map(r => r.date))
        setWDates(dates)
        setSaved(dates.has(today))
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [kidId, today])

  const pillars = computePillars(log, hadShotsToday)
  const earnedToday = allPillarsDone(pillars)

  // Persist today's W the first time all pillars hit
  useEffect(() => {
    if (!kidId || !earnedToday || savedToday) return
    let cancelled = false
    supabase
      .from('daily_ws')
      .upsert({ kid_id: kidId, date: today }, { onConflict: 'kid_id,date' })
      .then(({ error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else {
          setSaved(true)
          setWDates(prev => new Set(prev).add(today))
        }
      })
    return () => { cancelled = true }
  }, [kidId, earnedToday, savedToday, today])

  const currentStreak = countCurrentStreak(wDates, today)
  const weeklyCount   = countSince(wDates, weekStartString())
  const allTimeCount  = wDates.size

  return {
    pillars,
    earnedToday,
    savedToday,
    currentStreak,
    weeklyCount,
    allTimeCount,
    loading,
    error,
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function countCurrentStreak(dates, today) {
  if (!dates.has(today)) return 0
  let n = 0
  const d = new Date(today)
  while (true) {
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!dates.has(ds)) break
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

function countSince(dates, startStr) {
  let n = 0
  for (const d of dates) if (d >= startStr) n++
  return n
}

function weekStartString() {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay()) // Sunday-anchored (matches StatsPage)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
