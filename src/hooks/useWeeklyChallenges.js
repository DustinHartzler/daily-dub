import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mondayOf } from '../lib/weekUtils'

/**
 * useWeeklyChallenges — loads this week's Bible verse + fun challenges.
 *
 * Returns:
 *   verse  — single { title, body } or null
 *   fun    — array of { title, body }, sorted by sort_order
 *   weekStart — the YYYY-MM-DD Monday string used for the query
 *   loading, error
 */
export function useWeeklyChallenges() {
  const weekStart = mondayOf()
  const [verse, setVerse] = useState(null)
  const [fun, setFun]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    supabase
      .from('weekly_challenges')
      .select('*')
      .eq('week_start', weekStart)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else {
          const rows = data ?? []
          setVerse(rows.find(r => r.kind === 'bible_verse') ?? null)
          setFun(rows.filter(r => r.kind === 'fun_challenge'))
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [weekStart])

  return { verse, fun, weekStart, loading, error }
}
