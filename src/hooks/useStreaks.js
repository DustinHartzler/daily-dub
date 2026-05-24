import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useStreaks — reads streak rows for a kid, returns:
 *   byTask        — object keyed by task_type, value is the streak row
 *   maxCurrent    — highest current_streak across tasks (used for badge unlocks)
 *   loading, error
 */
export function useStreaks(kidId) {
  const [byTask, setByTask] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!kidId) return
    let cancelled = false
    setLoading(true)

    supabase
      .from('streaks')
      .select('*')
      .eq('kid_id', kidId)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else {
          const map = {}
          for (const r of data ?? []) map[r.task_type] = r
          setByTask(map)
        }
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
