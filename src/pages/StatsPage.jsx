import { useShotSessions } from '../hooks/useShotSessions'
import { THEME } from '../lib/constants'

// ── Helpers ───────────────────────────────────────────────────────────────────
function getWeekStart() {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay()) // Sunday
  return d.toISOString().split('T')[0]
}

function getMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function calcPct(makes, attempts) {
  return attempts ? Math.round((makes / attempts) * 100) : null
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StatsPage({ kidId, kidName }) {
  const { allSessions, loading, error } = useShotSessions(kidId)

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: THEME.muted }}>Loading...</div>
  if (error)   return <ErrorState message={error} />

  const weekStart  = getWeekStart()
  const monthStart = getMonthStart()

  const weekSessions  = allSessions.filter(s => s.date >= weekStart)
  const monthSessions = allSessions.filter(s => s.date >= monthStart)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Shooting — this week */}
      <ShootingBlock label="This Week" sessions={weekSessions} />

      {/* Shooting — this month */}
      <ShootingBlock label="This Month" sessions={monthSessions} />

      {/* Streaks placeholder — will wire to DB in next iteration */}
      <Section label="Streaks">
        <StreakRow emoji="📖" label="Reading"  streak={0} />
        <StreakRow emoji="🎹" label="Piano"    streak={0} />
        <StreakRow emoji="🇪🇸" label="Spanish"  streak={0} />
        <StreakRow emoji="🏀" label="Shooting"  streak={0} />
        <StreakRow emoji="✅" label="All Tasks" streak={0} />
      </Section>

    </div>
  )
}

// ── Shooting block ─────────────────────────────────────────────────────────────
function ShootingBlock({ label, sessions }) {
  const makes    = sessions.reduce((s, x) => s + x.makes, 0)
  const attempts = sessions.reduce((s, x) => s + x.attempts, 0)
  const pct      = calcPct(makes, attempts)

  if (attempts === 0) {
    return (
      <Section label={`Shooting — ${label}`}>
        <EmptyState text="No shots logged yet" />
      </Section>
    )
  }

  // Group by shot type
  const byType = {}
  sessions.forEach(s => {
    if (!byType[s.shot_type]) byType[s.shot_type] = { makes: 0, attempts: 0 }
    byType[s.shot_type].makes    += s.makes
    byType[s.shot_type].attempts += s.attempts
  })

  return (
    <Section label={`Shooting — ${label}`}>
      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        <StatPill label="Makes"    value={makes} />
        <StatPill label="Attempts" value={attempts} />
        <StatPill label="Overall %" value={pct !== null ? `${pct}%` : '—'} gold />
        <StatPill label="Sessions"  value={sessions.length} />
      </div>

      {/* By type */}
      {Object.entries(byType).map(([type, { makes: m, attempts: a }]) => {
        const p = calcPct(m, a)
        const barPct = Math.min(100, (p ?? 0))
        return (
          <div key={type} style={{ marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: THEME.text, fontSize: 14 }}>{type}</span>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, color: THEME.text }}>
                {m}/{a} <span style={{ color: THEME.gold }}>{p !== null ? `${p}%` : '—'}</span>
              </span>
            </div>
            <div style={{ height: 5, background: THEME.border, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${barPct}%`,
                background: `linear-gradient(90deg, ${THEME.purple}, ${THEME.gold})`,
                borderRadius: 4,
              }} />
            </div>
          </div>
        )
      })}
    </Section>
  )
}

// ── Streak row ────────────────────────────────────────────────────────────────
function StreakRow({ emoji, label, streak }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 14px',
      background: THEME.surface2,
      border: `1px solid ${THEME.border}`,
      borderRadius: 10,
    }}>
      <span style={{ color: THEME.text, fontSize: 15 }}>{emoji} {label}</span>
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 18, color: streak > 0 ? THEME.gold : THEME.muted }}>
        {streak > 0 ? `${streak} day streak 🔥` : '—'}
      </span>
    </div>
  )
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Section({ label, children }) {
  return (
    <section>
      <div style={{
        color: THEME.gold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </section>
  )
}

function StatPill({ label, value, gold }) {
  return (
    <div style={{
      background: gold ? `${THEME.gold}22` : `${THEME.purple}44`,
      border: `1px solid ${gold ? THEME.gold + '55' : THEME.purple + '88'}`,
      borderRadius: 8,
      padding: '8px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 70,
    }}>
      <span style={{ color: gold ? THEME.gold : THEME.text, fontWeight: 700, fontSize: 22, fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</span>
      <span style={{ color: THEME.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
    </div>
  )
}

function EmptyState({ text }) {
  return <p style={{ color: THEME.muted, fontSize: 14, textAlign: 'center', padding: '12px 0' }}>{text}</p>
}

function ErrorState({ message }) {
  return (
    <div style={{ background: '#3D1515', border: '1px solid #7D2020', borderRadius: 12, padding: 16, color: '#FF8080', fontSize: 14 }}>
      <strong>Error:</strong> {message}
    </div>
  )
}
