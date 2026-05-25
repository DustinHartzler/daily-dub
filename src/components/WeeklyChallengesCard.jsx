import { useWeeklyChallenges } from '../hooks/useWeeklyChallenges'
import { THEME } from '../lib/constants'
import Icon from './Icon'

export default function WeeklyChallengesCard() {
  const { verse, fun, loading } = useWeeklyChallenges()

  if (loading) return null
  if (!verse && fun.length === 0) return null  // hide entirely when no content for the week

  return (
    <div style={{
      background: `linear-gradient(135deg, ${THEME.surface} 0%, ${THEME.surface2} 100%)`,
      border: `1px solid ${THEME.gold}33`,
      borderRadius: 14,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{
        color: THEME.gold,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
      }}>This Week</div>

      {verse && (
        <div>
          <div style={{ fontSize: 15, color: THEME.text, lineHeight: 1.45 }}>
            "{verse.body}"
          </div>
          {verse.title && (
            <div style={{
              color: THEME.gold,
              fontSize: 12,
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: 1,
              marginTop: 6,
              fontWeight: 700,
            }}>— {verse.title}</div>
          )}
        </div>
      )}

      {fun.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {fun.map(c => (
            <div key={c.id} style={{
              padding: '8px 10px',
              background: THEME.dark,
              borderRadius: 8,
              border: `1px solid ${THEME.border}`,
              fontSize: 13,
              color: THEME.text,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Icon name="sparkles" size={14} color={THEME.gold} />
              <span><span style={{ fontWeight: 700 }}>{c.title ?? 'Challenge'}: </span>
                <span style={{ color: THEME.muted }}>{c.body}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
