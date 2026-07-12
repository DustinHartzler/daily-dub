import { useAnnouncements } from '../hooks/useAnnouncements'
import { categorize, formatTimeRange, formatDate } from '../lib/announcements'
import { KIDS, THEME } from '../lib/constants'
import Icon from '../components/Icon'

export default function TodayPage({ kidId }) {
  const { items, loading, error } = useAnnouncements(kidId)

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: THEME.muted }}>Loading…</div>
  if (error)   return <ErrorState message={error} />

  const { standing, todayEvents, upcoming } = categorize(items)
  const nothing = standing.length + todayEvents.length + upcoming.length === 0

  if (nothing) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 20px', color: THEME.muted }}>
        <Icon name="calendar" size={40} color={THEME.border} />
        <p style={{ marginTop: 12, fontSize: 15 }}>Nothing on the schedule.</p>
        <p style={{ fontSize: 13, color: `${THEME.muted}99` }}>
          Check back when Mom or Dad adds something.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {standing.length > 0 && (
        <Section label="Announcements" icon="megaphone">
          {standing.map(it => <EventRow key={it.id} item={it} />)}
        </Section>
      )}

      {todayEvents.length > 0 && (
        <Section label="Today" icon="calendar">
          {todayEvents.map(it => <EventRow key={it.id} item={it} showTime />)}
        </Section>
      )}

      {upcoming.length > 0 && (
        <Section label="Coming Up" icon="clock">
          {upcoming.map(it => <EventRow key={it.id} item={it} showTime showDate />)}
        </Section>
      )}
    </div>
  )
}

// ─── Event / announcement row ────────────────────────────────────────────────
function EventRow({ item, showTime, showDate }) {
  const kid = item.kid_id ? KIDS.find(k => k.id === item.kid_id) : null

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '12px 14px',
      background: THEME.surface2,
      border: `1px solid ${THEME.border}`,
      borderRadius: 12,
    }}>
      <div style={{
        width: 4,
        alignSelf: 'stretch',
        borderRadius: 4,
        background: kid ? THEME.gold : THEME.purple,
        flexShrink: 0,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ color: THEME.text, fontSize: 15, fontWeight: 600 }}>{item.title}</span>
          {showDate && (
            <span style={{ color: THEME.gold, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 0.5 }}>
              {formatDate(item.date)}
            </span>
          )}
        </div>

        {item.body && (
          <p style={{ color: THEME.muted, fontSize: 13, margin: '4px 0 0' }}>{item.body}</p>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
          {showTime && (
            <Meta icon="clock" text={formatTimeRange(item.start_time, item.end_time)} />
          )}
          {kid ? (
            <Meta icon={kid.icon} text={kid.name} />
          ) : (
            <Meta icon="users" text="Everyone" />
          )}
        </div>
      </div>
    </div>
  )
}

function Meta({ icon, text }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: THEME.muted, fontSize: 12 }}>
      <Icon name={icon} size={13} color={THEME.muted} />
      {text}
    </span>
  )
}

// ─── Shared UI ───────────────────────────────────────────────────────────────
function Section({ label, icon, children }) {
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
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <Icon name={icon} size={15} color={THEME.gold} />
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </section>
  )
}

function ErrorState({ message }) {
  return (
    <div style={{ background: '#3D1515', border: '1px solid #7D2020', borderRadius: 12, padding: 16, color: '#FF8080', fontSize: 14 }}>
      <strong>Error:</strong> {message}
    </div>
  )
}
