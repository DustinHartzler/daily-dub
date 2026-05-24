import { useWeeklyChallenges } from '../hooks/useWeeklyChallenges'
import { THEME } from '../lib/constants'

// Placeholder editor — shows what's currently set for the week, with a "coming soon"
// note in place of the real CRUD form. Parent can edit rows directly in Supabase for now.
export default function WeeklyChallengesEditor() {
  const { verse, fun, weekStart, loading } = useWeeklyChallenges()

  return (
    <div style={{
      background: THEME.surface,
      border: `1px dashed ${THEME.border}`,
      borderRadius: 14,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{
        color: THEME.gold,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: 700,
      }}>
        Weekly Challenges — week of {weekStart}
      </div>

      {loading ? (
        <p style={{ color: THEME.muted, fontSize: 13 }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row label="Bible verse" value={verse ? `${verse.title ?? ''} — ${verse.body.slice(0, 80)}${verse.body.length > 80 ? '…' : ''}` : '(none set)'} />
          {fun.length === 0
            ? <Row label="Fun challenges" value="(none set)" />
            : fun.map(c => <Row key={c.id} label="Fun challenge" value={`${c.title ?? ''}: ${c.body}`} />)
          }
        </div>
      )}

      <p style={{ color: THEME.muted, fontSize: 12, marginTop: 4 }}>
        Coming soon: add and edit these directly here. For now, insert rows in the
        Supabase <code style={{ color: THEME.gold }}>weekly_challenges</code> table.
      </p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{
      padding: '8px 10px',
      background: THEME.surface2,
      border: `1px solid ${THEME.border}`,
      borderRadius: 8,
      fontSize: 12,
    }}>
      <div style={{ color: THEME.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ color: THEME.text }}>{value}</div>
    </div>
  )
}
