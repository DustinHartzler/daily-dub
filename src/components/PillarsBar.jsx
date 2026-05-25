import { PILLAR_ORDER, PILLARS } from '../lib/pillars'
import { THEME } from '../lib/constants'

// Three small pillar meters at top of the Daily page.
export default function PillarsBar({ pillars }) {
  if (!pillars) return null
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
    }}>
      {PILLAR_ORDER.map(id => (
        <PillarTile key={id} pillar={PILLARS[id]} state={pillars[id]} />
      ))}
    </div>
  )
}

function PillarTile({ pillar, state }) {
  const pct = Math.round((state?.progress ?? 0) * 100)
  const done = state?.done
  return (
    <div style={{
      background: THEME.surface,
      border: `1px solid ${done ? pillar.color : THEME.border}`,
      borderRadius: 10,
      padding: '10px 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      transition: 'border-color 0.2s',
    }}>
      <span style={{ fontSize: 22, lineHeight: 1 }}>{pillar.icon}</span>
      <span style={{
        color: done ? pillar.color : THEME.muted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
      }}>{pillar.label}</span>
      <div style={{
        width: '100%',
        height: 4,
        background: THEME.border,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: pillar.color,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{
        color: done ? pillar.color : THEME.muted,
        fontSize: 11,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
      }}>
        {state?.completed ?? 0}/{state?.total ?? 0}{done && ' ✓'}
      </span>
    </div>
  )
}
