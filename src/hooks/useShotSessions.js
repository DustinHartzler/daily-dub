import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { todayString } from '../lib/constants'

/**
 * useShotSessions — loads and creates shot session rows for a kid.
 *
 * Returns:
 *   sessions      — array of today's shot sessions
 *   allSessions   — array of all-time sessions (for stats)
 *   addSession    — ({ shot_type, makes, attempts }) => void
 *   loading       — boolean
 *   error         — string | null
 */
export function useShotSessions(kidId) {
  const [sessions, setSessions]       = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const loadSessions = useCallback(async () => {
    if (!kidId) return
    setLoading(true)

    // Today's sessions
    const { data: todayData, error: e1 } = await supabase
      .from('shot_sessions')
      .select('*')
      .eq('kid_id', kidId)
      .eq('date', todayString())
      .order('created_at', { ascending: false })

    // All-time sessions (for weekly/monthly stats)
    const { data: allData, error: e2 } = await supabase
      .from('shot_sessions')
      .select('*')
      .eq('kid_id', kidId)
      .order('date', { ascending: false })

    if (e1 || e2) setError((e1 || e2).message)
    else {
      setSessions(todayData ?? [])
      setAllSessions(allData ?? [])
    }

    setLoading(false)
  }, [kidId])

  useEffect(() => { loadSessions() }, [loadSessions])

  const addSession = useCallback(async ({ shot_type, makes, attempts }) => {
    const newSession = {
      kid_id:    kidId,
      date:      todayString(),
      shot_type,
      makes:     parseInt(makes),
      attempts:  parseInt(attempts),
    }

    // Optimistic
    setSessions(s => [newSession, ...s])
    setAllSessions(s => [newSession, ...s])

    const { error } = await supabase
      .from('shot_sessions')
      .insert(newSession)

    if (error) {
      setError(error.message)
      loadSessions() // reload on failure
    }
  }, [kidId, loadSessions])

  return { sessions, allSessions, addSession, loading, error }
}
