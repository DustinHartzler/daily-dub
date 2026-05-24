import { useStreaks } from '../hooks/useStreaks'
import { badgesEarned } from '../lib/badges'
import { THEME } from '../lib/constants'

export default function BadgeRow({ kidId }) {
  const { maxCurrent, loading } = useStreaks(kidId)
  if (loading) return null

  const badges = badgesEarned(maxCurrent)
  const anyEarned = badges.some(b => b.earned)

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
      }}>Badges</div>

      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
      }}>
        {badges.map(b => (
          <Badge key={b.days} badge={b} />
        ))}
      </div>

      {!anyEarned && (
        <p style={{ color: THEME.muted, fontSize: 12, marginTop: 8, textAlign: 'center' }}>
          Keep your streak going to unlock these.
        </p>
      )}
    </section>
  )
}

function Badge({ badge }) {
  return (
    <div style={{
      flex: '0 0 auto',
      minWidth: 76,
      padding: '10px 8px',
      borderRadius: 12,
      background: badge.earned ? `${THEME.gold}1A` : THEME.surface2,
      border: `1px solid ${badge.earned ? THEME.gold : THEME.border}`,
      textAlign: 'center',
      opacity: badge.earned ? 1 : 0.55,
      filter: badge.earned ? 'none' : 'grayscale(1)',
    }}>
      <div style={{ fontSize: 26, lineHeight: 1.1 }}>{badge.emoji}</div>
      <div style={{
        color: badge.earned ? THEME.gold : THEME.muted,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
      }}>
        {badge.label}
      </div>
      <div style={{ color: THEME.muted, fontSize: 10, marginTop: 2 }}>
        {badge.days}d
      </div>
    </div>
  )
}
