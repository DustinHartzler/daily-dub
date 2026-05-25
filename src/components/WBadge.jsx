import { THEME } from '../lib/constants'

// Celebratory badge shown on the Daily page once all three pillars hit.
export default function WBadge({ currentStreak, weeklyCount }) {
  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${THEME.purple} 0%, #2D1B5C 60%, #0F0C17 100%)`,
      border: `2px solid ${THEME.gold}`,
      borderRadius: 16,
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      overflow: 'hidden',
    }}>
      {/* Big W */}
      <div style={{
        fontSize: 64,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 800,
        color: THEME.gold,
        lineHeight: 0.9,
        letterSpacing: -2,
        textShadow: `0 0 24px ${THEME.gold}55`,
      }}>W</div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{
          color: THEME.gold,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
        }}>Daily Dub earned</span>
        <span style={{
          color: THEME.text,
          fontSize: 17,
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          letterSpacing: 0.5,
        }}>
          Mind · Body · Character ✓
        </span>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, color: THEME.muted, fontSize: 12 }}>
          {currentStreak > 0 && (
            <span>🔥 {currentStreak}-day streak</span>
          )}
          {weeklyCount > 0 && (
            <span>📅 {weeklyCount} this week</span>
          )}
        </div>
      </div>
    </div>
  )
}
