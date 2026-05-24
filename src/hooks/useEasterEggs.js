import { useEffect, useState } from 'react'
import { EASTER_EGG_RULES, rewardKey } from '../lib/easterEggRules'
import { todayString } from '../lib/constants'
import { useDailyLog } from './useDailyLog'

const SEEN_KEY = 'dc-tracker:seen-rewards'

function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]')) }
  catch { return new Set() }
}
function persistSeen(set) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...set]))
}

/**
 * useEasterEggs — runs the rule registry against the kid's daily log.
 * Returns the next pending reward (one at a time) and a markSeen() to dismiss it.
 */
export function useEasterEggs(kidId) {
  const { log } = useDailyLog(kidId)
  const [pending, setPending] = useState(null)
  const [seen, setSeen] = useState(loadSeen)

  useEffect(() => {
    if (!kidId || !log) return
    const ctx = { kidId, log, now: new Date() }
    const today = todayString()

    for (const rule of EASTER_EGG_RULES) {
      const key = rewardKey(rule.id, kidId, today)
      if (seen.has(key)) continue
      if (rule.check(ctx)) {
        setPending({ ...rule, _key: key })
        return
      }
    }
    setPending(null)
  }, [kidId, log, seen])

  const markSeen = () => {
    if (!pending) return
    const next = new Set(seen)
    next.add(pending._key)
    setSeen(next)
    persistSeen(next)
    setPending(null)
  }

  return { reward: pending, markSeen }
}
