import { useEffect } from 'react'
import { useEasterEggs } from '../hooks/useEasterEggs'
import { THEME } from '../lib/constants'
import Icon from './Icon'

const AUTO_DISMISS_MS = 4000

export default function RewardToast({ kidId }) {
  const { reward, markSeen } = useEasterEggs(kidId)

  useEffect(() => {
    if (!reward) return
    const t = setTimeout(markSeen, AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [reward])

  if (!reward) return null

  return (
    <div
      onClick={markSeen}
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 24,
        transform: 'translateX(-50%)',
        background: `linear-gradient(135deg, ${THEME.purple} 0%, #2D1B5C 100%)`,
        border: `1px solid ${THEME.gold}`,
        borderRadius: 14,
        padding: '12px 18px',
        color: THEME.text,
        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 'calc(100% - 32px)',
        zIndex: 200,
        cursor: 'pointer',
      }}
    >
      <Icon name={reward.icon} size={28} color={THEME.gold} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          color: THEME.gold,
          fontSize: 12,
          fontFamily: 'Barlow Condensed, sans-serif',
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontWeight: 700,
        }}>{reward.label}</span>
        <span style={{ fontSize: 13 }}>{reward.message}</span>
      </div>
    </div>
  )
}
