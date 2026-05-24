import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { todayString } from '../lib/constants'

/**
 * useShotSessions — loads and creates session rows for a kid + sport.
 *
 * Args:
 *   kidId  — required
 *   sport  — defaults to 'basketball'. When provided, queries/inserts are scoped to that sport.
 *
 * TODO: rename the underlying table to practice_sessions when baseball/soccer have real forms.
 *
 * Returns:
 *   sessions      — today's sessions for this sport
 *   allSessions   — all-time sessions for this sport (for stats)
 *   addSession    — ({ shot_type, makes, attempts, metrics? }) => void
 *   loading       — boolean
 *   error         — string | null
 */
export function useShotSessions(kidId, sport = 'basketball') {
  const [sessions, setSessions]       = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const loadSessions = useCallback(async () => {
    if (!kidId) return
    setLoading(true)

    const { data: todayData, error: e1 } = await supabase
      .from('shot_sessions')
      .select('*')
      .eq('kid_id', kidId)
      .eq('sport', sport)
      .eq('date', todayString())
      .order('created_at', { ascending: false })

    const { data: allData, error: e2 } = await supabase
      .from('shot_sessions')
      .select('*')
      .eq('kid_id', kidId)
      .eq('sport', sport)
      .order('date', { ascending: false })

    if (e1 || e2) setError((e1 || e2).message)
    else {
      setSessions(todayData ?? [])
      setAllSessions(allData ?? [])
    }

    setLoading(false)
  }, [kidId, sport])

  useEffect(() => { loadSessions() }, [loadSessions])

  const addSession = useCallback(async ({ shot_type, makes, attempts, metrics }) => {
    const newSession = {
      kid_id:    kidId,
      date:      todayString(),
      sport,
      shot_type,
      makes:     parseInt(makes),
      attempts:  parseInt(attempts),
      metrics:   metrics ?? {},
    }

    setSessions(s => [newSession, ...s])
    setAllSessions(s => [newSession, ...s])

    const { error } = await supabase
      .from('shot_sessions')
      .insert(newSession)

    if (error) {
      setError(error.message)
      loadSessions()
    }
  }, [kidId, sport, loadSessions])

  return { sessions, allSessions, addSession, loading, error }
}
