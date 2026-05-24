import { useState } from 'react'
import { KIDS, THEME } from './lib/constants'
import DailyPage from './pages/DailyPage'
import ShotsPage from './pages/ShotsPage'
import StatsPage from './pages/StatsPage'

const TABS = [
  { id: 'daily', label: 'Daily'    },
  { id: 'shots', label: '🏀 Shots' },
  { id: 'stats', label: 'Stats'    },
]

export default function App() {
  const [activeKid, setActiveKid] = useState(KIDS[0].id)
  const [activeTab, setActiveTab] = useState('daily')

  const kid = KIDS.find(k => k.id === activeKid)

  return (
    <div style={{
      minHeight: '100dvh',
      background: THEME.dark,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 768, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        {/* ── Header ── */}
        <Header kid={kid} activeKid={activeKid} setActiveKid={setActiveKid} />

        {/* ── Tab Nav ── */}
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ── Page Content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 120px' }}>
          {activeTab === 'daily' && <DailyPage kidId={activeKid} />}
          {activeTab === 'shots' && <ShotsPage kidId={activeKid} kidName={kid.name} />}
          {activeTab === 'stats' && <StatsPage kidId={activeKid} kidName={kid.name} />}
        </main>

      </div>
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ kid, activeKid, setActiveKid }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  })

  return (
    <header style={{
      background: `linear-gradient(135deg, ${THEME.purple} 0%, #2D1B5C 100%)`,
      padding: '20px 20px 16px',
      borderBottom: `2px solid ${THEME.gold}33`,
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{
            color: THEME.gold,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            marginBottom: 2,
          }}>
            Dayton Christian
          </div>
          <div style={{
            color: THEME.text,
            fontSize: 28,
            fontWeight: 800,
            fontFamily: 'Barlow Condensed, sans-serif',
            letterSpacing: 1,
            lineHeight: 1,
          }}>
            Daily Tracker
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
            <span style={{ fontSize: 20 }}>{k.emoji}</span>
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
      top: 136, // height of header
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
