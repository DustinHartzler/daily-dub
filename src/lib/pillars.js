import { TIMED_TASKS } from './constants'

export const PILLARS = {
  mind: {
    id:    'mind',
    label: 'Mind',
    icon:  '🧠',
    color: '#7C5BFF',
    chores:     [],
    timedTasks: ['reading', 'piano', 'spanish'],
    requireShots: false,
  },
  body: {
    id:    'body',
    label: 'Body',
    icon:  '💪',
    color: '#E15B7C',
    chores:     ['Brush teeth (AM)'],
    timedTasks: [],
    requireShots: true,
  },
  character: {
    id:    'character',
    label: 'Character',
    icon:  '⭐',
    color: '#F2A900',
    chores:     ['Make bed', 'Pick up clothes'],
    timedTasks: [],
    requireShots: false,
  },
}

export const PILLAR_ORDER = ['mind', 'body', 'character']

// Returns { mind: {progress: 0-1, done: bool, total: int, completed: int}, body: {...}, character: {...} }
export function computePillars(log, hadShotsToday = false) {
  const result = {}
  for (const id of PILLAR_ORDER) {
    const p = PILLARS[id]
    let total = p.chores.length + p.timedTasks.length + (p.requireShots ? 1 : 0)
    let completed = 0

    for (const chore of p.chores) {
      if (log?.chores?.[chore]) completed++
    }
    for (const taskId of p.timedTasks) {
      const target = TIMED_TASKS.find(t => t.id === taskId)?.targetMinutes ?? 0
      const secs = log?.[`${taskId}_seconds`] ?? 0
      if (target > 0 && secs >= target * 60) completed++
    }
    if (p.requireShots && hadShotsToday) completed++

    const progress = total > 0 ? completed / total : 0
    result[id] = { progress, done: progress >= 1, total, completed }
  }
  return result
}

export function allPillarsDone(pillars) {
  return PILLAR_ORDER.every(id => pillars[id]?.done)
}
