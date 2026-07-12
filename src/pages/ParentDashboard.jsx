import { useDailyLog } from '../hooks/useDailyLog'
import { useShotSessions } from '../hooks/useShotSessions'
import { useDeviceRole } from '../context/DeviceRoleContext'
import { KIDS, TIMED_TASKS, THEME, getChores } from '../lib/constants'
import WeeklyChallengesEditor from '../components/WeeklyChallengesEditor'
import AnnouncementsEditor from '../components/AnnouncementsEditor'
import Icon from '../components/Icon'

export default function ParentDashboard() {
  const { clearRole } = useDeviceRole()

  return (
    <div style={{ minHeight: '100dvh', background: THEME.dark, color: THEME.text }}>
      <header style={{
        background: `linear-gradient(135deg, ${THEME.purple} 0%, #2D1B5C 100%)`,
        padding: '20px 20px 16px',
        borderBottom: `2px solid ${THEME.gold}33`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            color: THEME.gold,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
          }}>Parent View · Daily Dub</div>
          <div style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: 'Barlow Condensed, sans-serif',
            letterSpacing: 1,
            lineHeight: 1.1,
          }}>Today's Snapshot</div>
        </div>
        <button
          onClick={clearRole}
          style={{
            padding: '8px 14px',
            background: 'transparent',
            border: `1px solid ${THEME.gold}55`,
            borderRadius: 8,
            color: THEME.gold,
            fontSize: 12,
            fontFamily: 'Barlow Condensed, sans-serif',
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >Switch</button>
      </header>

      <main style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {KIDS.map(k => <KidCard key={k.id} kid={k} />)}
        </div>

        <AnnouncementsEditor />

        <WeeklyChallengesEditor />
      </main>
    </div>
  )
}

function KidCard({ kid }) {
  const { log, loading: logLoading } = useDailyLog(kid.id)
  const { sessions, loading: shotsLoading } = useShotSessions(kid.id)
  const chores = getChores(kid.id)

  if (logLoading || shotsLoading) {
    return (
      <Card>
        <CardHeader kid={kid} />
        <p style={{ color: THEME.muted, fontSize: 13 }}>Loading…</p>
      </Card>
    )
  }

  const choresDone = chores.filter(c => log.chores?.[c]).length
  const shotMakes    = sessions.reduce((s, x) => s + x.makes, 0)
  const shotAttempts = sessions.reduce((s, x) => s + x.attempts, 0)

  return (
    <Card>
      <CardHeader kid={kid} />

      <Stat label="Chores" value={`${choresDone} / ${chores.length}`} />

      {TIMED_TASKS.map(t => {
        const secs = log[`${t.id}_seconds`] ?? 0
        const mins = Math.floor(secs / 60)
        const target = t.targetMinutes
        const done = secs >= target * 60
        return (
          <Stat
            key={t.id}
            label={t.label}
            icon={t.icon}
            value={done ? `${mins} / ${target} min` : `${mins} / ${target} min`}
            done={done}
            valueColor={done ? THEME.gold : THEME.text}
          />
        )
      })}

      {log.spanish_note && (
        <div style={{
          marginTop: 4,
          padding: '8px 10px',
          background: THEME.dark,
          borderRadius: 8,
          fontSize: 12,
          color: THEME.muted,
        }}>
          <span style={{ color: THEME.gold }}>Spanish note: </span>{log.spanish_note}
        </div>
      )}

      <Stat
        label="Shots today"
        value={shotAttempts > 0
          ? `${shotMakes} / ${shotAttempts} (${Math.round(shotMakes / shotAttempts * 100)}%)`
          : '—'}
      />
    </Card>
  )
}

function Card({ children }) {
  return (
    <div style={{
      background: THEME.surface,
      border: `1px solid ${THEME.border}`,
      borderRadius: 14,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>{children}</div>
  )
}

function CardHeader({ kid }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <Icon name={kid.icon} size={26} color={THEME.gold} />
      <span style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 1,
      }}>{kid.name}</span>
    </div>
  )
}

function Stat({ label, value, valueColor, icon, done }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: THEME.surface2,
      borderRadius: 8,
      border: `1px solid ${THEME.border}`,
    }}>
      <span style={{ color: THEME.muted, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {icon && <Icon name={icon} size={14} color={THEME.muted} />}
        {label}
      </span>
      <span style={{
        color: valueColor ?? THEME.text,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        fontSize: 16,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}>
        {value}
        {done && <Icon name="check" size={14} color={THEME.gold} />}
      </span>
    </div>
  )
}

