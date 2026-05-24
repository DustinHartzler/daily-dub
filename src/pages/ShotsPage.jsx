import { useState } from 'react'
import { useShotSessions } from '../hooks/useShotSessions'
import { useDeviceRole } from '../context/DeviceRoleContext'
import { SPORTS, getSportsForKid } from '../lib/sports'
import { THEME } from '../lib/constants'
import SportSelector from '../components/SportSelector'
import BasketballForm from '../components/sports/BasketballForm'
import BaseballForm from '../components/sports/BaseballForm'
import SoccerForm from '../components/sports/SoccerForm'

const FORMS = {
  basketball: BasketballForm,
  baseball:   BaseballForm,
  soccer:     SoccerForm,
}

export default function ShotsPage({ kidId }) {
  const sportsAvailable = getSportsForKid(kidId)
  const [sport, setSport] = useState(sportsAvailable[0])

  const { sessions, addSession, loading, error } = useShotSessions(kidId, sport)
  const { canEdit } = useDeviceRole()
  const editable = canEdit(kidId)

  const sportCfg = SPORTS[sport]
  const Form = FORMS[sport]

  const totalMakes    = sessions.reduce((s, x) => s + x.makes, 0)
  const totalAttempts = sessions.reduce((s, x) => s + x.attempts, 0)
  const overallPct    = totalAttempts ? Math.round((totalMakes / totalAttempts) * 100) : null

  const byType = sportCfg.shotTypes.map(type => {
    const s = sessions.filter(x => x.shot_type === type)
    const m = s.reduce((a, x) => a + x.makes, 0)
    const a = s.reduce((a, x) => a + x.attempts, 0)
    return { type, makes: m, attempts: a, pct: a ? Math.round((m / a) * 100) : null }
  }).filter(x => x.attempts > 0)

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: THEME.muted }}>Loading...</div>
  if (error)   return <ErrorState message={error} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {!editable && (
        <div style={{
          padding: '8px 12px',
          borderRadius: 8,
          background: `${THEME.gold}11`,
          border: `1px solid ${THEME.gold}44`,
          color: THEME.gold,
          fontSize: 12,
          textAlign: 'center',
        }}>
          👀 Viewing only — switch back to your own tab to log shots.
        </div>
      )}

      <SportSelector sports={sportsAvailable} value={sport} onChange={setSport} />

      {/* Today's summary — only shown when there's data to summarize */}
      {totalAttempts > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <StatPill label="Makes"    value={totalMakes} />
          <StatPill label="Attempts" value={totalAttempts} />
          <StatPill label="Overall %" value={overallPct !== null ? `${overallPct}%` : '—'} gold />
          <StatPill label="Sessions"  value={sessions.length} />
        </div>
      )}

      {/* By type breakdown */}
      {byType.length > 0 && (
        <Section label={`Today by Type`}>
          {byType.map(t => (
            <div key={t.type} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: THEME.surface2,
              border: `1px solid ${THEME.border}`,
              borderRadius: 10,
            }}>
              <span style={{ color: THEME.muted, fontSize: 14 }}>{t.type}</span>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, color: THEME.text }}>
                {t.makes}/{t.attempts}{' '}
                <span style={{ color: THEME.gold }}>{t.pct}%</span>
              </span>
            </div>
          ))}
        </Section>
      )}

      {/* Log form (sport-specific) */}
      {editable && (
        <Section label={`Log ${sportCfg.label}`}>
          <Form onAdd={addSession} disabled={!editable} />
        </Section>
      )}

      {/* Session history */}
      {sessions.length > 0 && (
        <Section label="Today's Sessions">
          {sessions.map((s, i) => (
            <div key={s.id ?? i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: THEME.surface2,
              border: `1px solid ${THEME.border}`,
              borderRadius: 10,
            }}>
              <span style={{ color: THEME.text, fontSize: 14 }}>{s.shot_type}</span>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, color: THEME.text }}>
                {s.makes}/{s.attempts}{' '}
                <span style={{ color: THEME.gold }}>
                  {s.attempts ? `${Math.round((s.makes / s.attempts) * 100)}%` : '—'}
                </span>
              </span>
            </div>
          ))}
        </Section>
      )}

    </div>
  )
}

function Section({ label, children }) {
  return (
    <section>
      <div style={{
        color: THEME.gold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </section>
  )
}

function StatPill({ label, value, gold }) {
  return (
    <div style={{
      background: gold ? `${THEME.gold}22` : `${THEME.purple}44`,
      border: `1px solid ${gold ? THEME.gold + '55' : THEME.purple + '88'}`,
      borderRadius: 8,
      padding: '8px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 70,
    }}>
      <span style={{ color: gold ? THEME.gold : THEME.text, fontWeight: 700, fontSize: 22, fontFamily: 'Barlow Condensed, sans-serif' }}>{value}</span>
      <span style={{ color: THEME.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div style={{ background: '#3D1515', border: '1px solid #7D2020', borderRadius: 12, padding: 16, color: '#FF8080', fontSize: 14 }}>
      <strong>Error:</strong> {message}
    </div>
  )
}
