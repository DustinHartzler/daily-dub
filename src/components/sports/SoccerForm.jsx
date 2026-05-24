import { THEME } from '../../lib/constants'

export default function SoccerForm() {
  return (
    <div style={{
      background: THEME.surface,
      border: `1px dashed ${THEME.border}`,
      borderRadius: 12,
      padding: '24px 16px',
      textAlign: 'center',
      color: THEME.muted,
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>⚽</div>
      <div style={{
        color: THEME.gold,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        letterSpacing: 1,
        marginBottom: 4,
      }}>Soccer — coming soon</div>
      <div style={{ fontSize: 12 }}>
        We'll wire up the tracker (shots on goal, saves, minutes) shortly.
      </div>
    </div>
  )
}
