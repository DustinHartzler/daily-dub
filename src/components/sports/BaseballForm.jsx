import { THEME } from '../../lib/constants'
import Icon from '../Icon'

export default function BaseballForm() {
  return (
    <div style={{
      background: THEME.surface,
      border: `1px dashed ${THEME.border}`,
      borderRadius: 12,
      padding: '24px 16px',
      textAlign: 'center',
      color: THEME.muted,
    }}>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
        <Icon name="baseball" size={36} color={THEME.muted} />
      </div>
      <div style={{
        color: THEME.gold,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        letterSpacing: 1,
        marginBottom: 4,
      }}>Baseball — coming soon</div>
      <div style={{ fontSize: 12 }}>
        We'll wire up the tracker (at-bats, hits, minutes practiced) shortly.
      </div>
    </div>
  )
}
