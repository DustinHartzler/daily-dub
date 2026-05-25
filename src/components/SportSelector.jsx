import { SPORTS } from '../lib/sports'
import { THEME } from '../lib/constants'
import Icon from './Icon'

// Segmented control. Only renders when there's more than one sport to choose.
export default function SportSelector({ sports, value, onChange }) {
  if (!sports || sports.length <= 1) return null
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      background: THEME.surface,
      border: `1px solid ${THEME.border}`,
      borderRadius: 10,
      padding: 4,
    }}>
      {sports.map(id => {
        const sport = SPORTS[id]
        const active = value === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 7,
              border: 'none',
              background: active ? `${THEME.gold}22` : 'transparent',
              color: active ? THEME.gold : THEME.muted,
              fontWeight: 700,
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: 1,
              fontSize: 14,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Icon name={sport.icon} size={16} />
            {sport.label}
          </button>
        )
      })}
    </div>
  )
}
