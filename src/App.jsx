import { useRef, useState } from 'react'
import { KIDS, THEME } from './lib/constants'
import { DeviceRoleProvider, useDeviceRole } from './context/DeviceRoleContext'
import SetupPage from './pages/SetupPage'
import ParentDashboard from './pages/ParentDashboard'
import PinPad from './components/PinPad'
import RewardToast from './components/RewardToast'
import Icon from './components/Icon'
import DailyPage from './pages/DailyPage'
import ShotsPage from './pages/ShotsPage'
import StatsPage from './pages/StatsPage'

const TABS = [
  { id: 'daily', label: 'Daily' },
  { id: 'shots', label: 'Shots' },
  { id: 'stats', label: 'Stats' },
]

export default function App() {
  return (
    <DeviceRoleProvider>
      <AppShell />
    </DeviceRoleProvider>
  )
}

function AppShell() {
  const { role } = useDeviceRole()
  if (role == null)      return <SetupPage />
  if (role === 'parent') return <ParentDashboard />
  return <KidShell />
}

function KidShell() {
  const { viewingKidId, setViewingKidId, parentPinHash, clearRole } = useDeviceRole()
  const [activeTab, setActiveTab] = useState('daily')
  const [showResetPad, setShowResetPad] = useState(false)

  const kid = KIDS.find(k => k.id === viewingKidId) ?? KIDS[0]

  const handleReset = () => {
    // No PIN ever set → just clear (shouldn't happen normally, but safe fallback)
    if (!parentPinHash) { clearRole(); return }
    setShowResetPad(true)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: THEME.dark,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 768, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        <Header
          kid={kid}
          activeKid={viewingKidId}
          setActiveKid={setViewingKidId}
          onLongPress={handleReset}
        />

        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 120px' }}>
          {activeTab === 'daily' && <DailyPage kidId={viewingKidId} />}
          {activeTab === 'shots' && <ShotsPage kidId={viewingKidId} kidName={kid.name} />}
          {activeTab === 'stats' && <StatsPage kidId={viewingKidId} kidName={kid.name} />}
        </main>

        {showResetPad && (
          <ResetOverlay
            expectedHash={parentPinHash}
            onCancel={() => setShowResetPad(false)}
            onSuccess={() => { setShowResetPad(false); clearRole() }}
          />
        )}

      </div>

      <RewardToast kidId={viewingKidId} />
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ kid, activeKid, setActiveKid, onLongPress }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  })
  const longPress = useLongPress(onLongPress, 800)

  return (
    <header style={{
      background: `linear-gradient(135deg, ${THEME.purple} 0%, #2D1B5C 100%)`,
      padding: '20px 20px 16px',
      borderBottom: `2px solid ${THEME.gold}33`,
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div {...longPress} style={{ touchAction: 'manipulation', cursor: 'pointer', userSelect: 'none' }}>
          <div style={{
            color: THEME.gold,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            marginBottom: 2,
          }}>
            Mind • Body • Character
          </div>
          <div style={{
            color: THEME.text,
            fontSize: 32,
            fontWeight: 800,
            fontFamily: 'Barlow Condensed, sans-serif',
            letterSpacing: 1,
            lineHeight: 1,
          }}>
            Daily <span style={{ color: THEME.gold }}>Dub</span>
          </div>
          <div style={{ color: `${THEME.text}55`, fontSize: 12, marginTop: 4 }}>{today}</div>
        </div>
      </div>

      {/* Kid switcher */}
      <div style={{ display: 'flex', gap: 8 }}>
        {KIDS.map(k => (
          <button
            key={k.id}
            onClick={() => setActiveKid(k.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 10,
              border: `2px solid ${activeKid === k.id ? THEME.gold : 'transparent'}`,
              background: activeKid === k.id ? `${THEME.gold}22` : `${THEME.dark}55`,
              color: activeKid === k.id ? THEME.gold : THEME.muted,
              fontWeight: 700,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: 1,
              transition: 'all 0.15s',
            }}
          >
            <Icon name={k.icon} size={20} />
            {k.name}
          </button>
        ))}
      </div>
    </header>
  )
}

// ─── Tab Nav ─────────────────────────────────────────────────────────────────
function TabNav({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      display: 'flex',
      background: THEME.surface,
      borderBottom: `1px solid ${THEME.border}`,
      position: 'sticky',
      top: 136,
      zIndex: 19,
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${activeTab === tab.id ? THEME.gold : 'transparent'}`,
            color: activeTab === tab.id ? THEME.gold : THEME.muted,
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontFamily: 'Barlow Condensed, sans-serif',
            transition: 'all 0.15s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

// ─── Reset overlay ────────────────────────────────────────────────────────────
function ResetOverlay({ expectedHash, onCancel, onSuccess }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: THEME.surface,
        borderRadius: 16,
        border: `1px solid ${THEME.border}`,
        maxWidth: 320,
        width: '90%',
      }}>
        <PinPad
          mode="verify"
          expectedHash={expectedHash}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  )
}

// ─── Long-press hook (pointer-based, mobile-safe) ────────────────────────────
function useLongPress(handler, ms = 800) {
  const timerRef = useRef(null)
  const startedAtRef = useRef(0)

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return {
    onPointerDown: () => {
      startedAtRef.current = Date.now()
      cancel()
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        handler?.()
      }, ms)
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onPointerMove: (e) => {
      // Cancel if the user appears to be scrolling
      if (Math.abs(e.movementX) + Math.abs(e.movementY) > 6) cancel()
    },
  }
}
