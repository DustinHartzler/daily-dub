import { useState, useEffect, useRef } from 'react'
import { useDailyLog } from '../hooks/useDailyLog'
import { CHORES, TIMED_TASKS, THEME } from '../lib/constants'

export default function DailyPage({ kidId }) {
  const { log, updateLog, loading, error } = useDailyLog(kidId)

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const choresCompleted = CHORES.filter(c => log.chores?.[c]).length
  const timedDone = TIMED_TASKS.filter(t => {
    const secs = log[`${t.id}_seconds`] ?? 0
    return secs >= t.targetMinutes * 60
  }).length

  const total = CHORES.length + TIMED_TASKS.length
  const done  = choresCompleted + timedDone

  const toggleChore = (chore) => {
    updateLog({ chores: { ...log.chores, [chore]: !log.chores?.[chore] } })
  }

  const updateSeconds = (taskId, seconds) => {
    updateLog({ [`${taskId}_seconds`]: seconds })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Progress summary */}
      <ProgressBar done={done} total={total} />

      {/* Chores */}
      <Section label="Chores" count={`${choresCompleted}/${CHORES.length}`}>
        {CHORES.map(chore => (
          <CheckRow
            key={chore}
            label={chore}
            checked={!!log.chores?.[chore]}
            onToggle={() => toggleChore(chore)}
          />
        ))}
      </Section>

      {/* Timed tasks */}
      <Section label="Timed Practice" count={`${timedDone}/${TIMED_TASKS.length}`}>
        {TIMED_TASKS.map(task => (
          <TimedTask
            key={task.id}
            task={task}
            currentSeconds={log[`${task.id}_seconds`] ?? 0}
            onUpdate={(secs) => updateSeconds(task.id, secs)}
          />
        ))}
      </Section>

    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div style={{
      background: THEME.surface2,
      border: `1px solid ${THEME.border}`,
      borderRadius: 12,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: THEME.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5 }}>Today's Progress</span>
        <span style={{ color: THEME.gold, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 18 }}>
          {done}/{total}
        </span>
      </div>
      <div style={{ height: 6, background: THEME.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${THEME.purple}, ${THEME.gold})`,
          borderRadius: 4,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ label, count, children }) {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          color: THEME.gold,
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
        }}>{label}</span>
        {count && <span style={{ color: THEME.muted, fontSize: 12 }}>{count}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </section>
  )
}

// ─── Check Row ────────────────────────────────────────────────────────────────
function CheckRow({ label, checked, onToggle }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? onToggle() : null}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 14px',
        background: checked ? `${THEME.purple}33` : THEME.surface2,
        border: `1px solid ${checked ? THEME.purple : THEME.border}`,
        borderRadius: 10,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `2px solid ${checked ? THEME.gold : THEME.muted}`,
        background: checked ? THEME.gold : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.15s',
      }}>
        {checked && <span style={{ color: THEME.dark, fontSize: 13, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </div>
      <span style={{
        color: checked ? THEME.text : THEME.muted,
        fontSize: 15,
        textDecoration: checked ? 'line-through' : 'none',
        transition: 'all 0.15s',
      }}>{label}</span>
    </div>
  )
}

// ─── Timed Task ───────────────────────────────────────────────────────────────
function TimedTask({ task, currentSeconds, onUpdate }) {
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const localRef = useRef(currentSeconds)

  // Keep localRef in sync when prop changes (e.g. kid switch)
  useEffect(() => { localRef.current = currentSeconds }, [currentSeconds])

  const targetSeconds = task.targetMinutes * 60
  const isDone = currentSeconds >= targetSeconds
  const pct = Math.min(100, (currentSeconds / targetSeconds) * 100)
  const mins = Math.floor(currentSeconds / 60)
  const secs = currentSeconds % 60

  useEffect(() => {
    if (running && !isDone) {
      intervalRef.current = setInterval(() => {
        localRef.current += 1
        if (localRef.current >= targetSeconds) {
          setRunning(false)
          clearInterval(intervalRef.current)
        }
        onUpdate(localRef.current)
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, isDone])

  const toggle = () => { if (!isDone) setRunning(r => !r) }
  const reset  = () => { setRunning(false); localRef.current = 0; onUpdate(0) }

  return (
    <div style={{
      background: isDone ? `${THEME.purple}33` : THEME.surface2,
      border: `1px solid ${isDone ? THEME.purple : THEME.border}`,
      borderRadius: 12,
      padding: '14px 16px',
      transition: 'all 0.2s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{task.icon}</span>
          <span style={{ color: THEME.text, fontWeight: 600, fontSize: 15 }}>{task.label}</span>
        </div>
        <span style={{
          color: isDone ? THEME.gold : THEME.muted,
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 20,
          fontWeight: 700,
        }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} / {task.targetMinutes}:00
          {isDone && ' ✓'}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: THEME.border, borderRadius: 4, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: isDone ? THEME.gold : `linear-gradient(90deg, ${THEME.purple}, ${THEME.gold})`,
          borderRadius: 4,
          transition: 'width 0.5s',
        }} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={toggle}
          disabled={isDone}
          style={{
            flex: 1,
            padding: '8px 0',
            background: running ? `${THEME.gold}22` : `${THEME.purple}88`,
            border: `1px solid ${running ? THEME.gold : THEME.purple}`,
            borderRadius: 8,
            color: running ? THEME.gold : THEME.text,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {isDone ? 'Complete ✓' : running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '8px 14px',
            background: 'transparent',
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            color: THEME.muted,
            fontSize: 14,
          }}
        >↺</button>
      </div>
    </div>
  )
}

// ─── Loading / Error states ───────────────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: THEME.muted }}>
      Loading...
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div style={{
      background: '#3D1515',
      border: '1px solid #7D2020',
      borderRadius: 12,
      padding: 16,
      color: '#FF8080',
      fontSize: 14,
    }}>
      <strong>Error:</strong> {message}
    </div>
  )
}
