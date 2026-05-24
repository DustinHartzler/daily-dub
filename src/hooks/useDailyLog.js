import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { todayString, blankDailyLog } from '../lib/constants'

/**
 * useDailyLog — manages one kid's daily log row in Supabase.
 *
 * Returns:
 *   log        — the current log object (local state, optimistic)
 *   updateLog  — (patch) => void  — merges patch into log and upserts to DB
 *   loading    — boolean
 *   error      — string | null
 */
export function useDailyLog(kidId) {
  const [log, setLog]       = useState(blankDailyLog(kidId))
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  // Load today's log on mount / kid switch
  useEffect(() => {
    if (!kidId) return

    setLoading(true)
    setError(null)

    supabase
      .from('daily_logs')
      .select('*')
      .eq('kid_id', kidId)
      .eq('date', todayString())
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
        } else {
          setLog(data ?? blankDailyLog(kidId))
        }
        setLoading(false)
      })
  }, [kidId])

  // Optimistic update → upsert to Supabase
  const updateLog = useCallback(async (patch) => {
    const updated = { ...log, ...patch }
    setLog(updated) // optimistic

    const { error } = await supabase
      .from('daily_logs')
      .upsert(updated, { onConflict: 'kid_id,date' })

    if (error) {
      setError(error.message)
      setLog(log) // rollback on failure
    }
  }, [log])

  return { log, updateLog, loading, error }
}
