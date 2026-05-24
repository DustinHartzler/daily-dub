import { THEME } from '../../lib/constants'

export default function BaseballForm() {
  return <ComingSoon icon="⚾" label="Baseball" />
}

function ComingSoon({ icon, label }) {
  return (
    <div style={{
      background: THEME.surface,
      border: `1px dashed ${THEME.border}`,
      borderRadius: 12,
      padding: '24px 16px',
      textAlign: 'center',
      color: THEME.muted,
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{
        color: THEME.gold,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        letterSpacing: 1,
        marginBottom: 4,
      }}>{label} — coming soon</div>
      <div style={{ fontSize: 12 }}>
        We'll wire up the tracker (at-bats, hits, minutes practiced) shortly.
      </div>
    </div>
  )
}
