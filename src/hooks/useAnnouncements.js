import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useAnnouncements — loads the family calendar and (for parent use) exposes CRUD.
 *
 * Args:
 *   scopeKidId — when set, results are limited to family-wide rows (kid_id null)
 *                plus that kid's own rows. Omit for the parent view (sees all).
 *
 * Returns:
 *   items      — sorted rows (undated first, then by date, then start_time)
 *   addItem / updateItem / removeItem — CRUD, each reloads the list
 *   loading, error, reload
 */
export function useAnnouncements(scopeKidId = null) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('date', { ascending: true, nullsFirst: true })
      .order('start_time', { ascending: true, nullsFirst: true })

    if (error) setError(error.message)
    else {
      let rows = data ?? []
      if (scopeKidId) rows = rows.filter(r => r.kid_id == null || r.kid_id === scopeKidId)
      setItems(rows)
    }
    setLoading(false)
  }, [scopeKidId])

  useEffect(() => { load() }, [load])

  const addItem = useCallback(async (fields) => {
    const { error } = await supabase.from('announcements').insert(cleanFields(fields))
    if (error) { setError(error.message); return }
    await load()
  }, [load])

  const updateItem = useCallback(async (id, fields) => {
    const { error } = await supabase
      .from('announcements')
      .update({ ...cleanFields(fields), updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) { setError(error.message); return }
    await load()
  }, [load])

  const removeItem = useCallback(async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) { setError(error.message); return }
    await load()
  }, [load])

  return { items, loading, error, addItem, updateItem, removeItem, reload: load }
}

/** Normalize form values: blank date/time/kid → null so the DB stores real nulls. */
function cleanFields(f) {
  return {
    kid_id:     f.kid_id || null,
    title:      (f.title ?? '').trim(),
    body:       (f.body ?? '').trim(),
    date:       f.date || null,
    start_time: f.start_time || null,
    end_time:   f.end_time || null,
  }
}
