import { useState } from 'react'
import { useShotSessions } from '../hooks/useShotSessions'
import { SHOT_TYPES, THEME } from '../lib/constants'

export default function ShotsPage({ kidId, kidName }) {
  const { sessions, addSession, loading, error } = useShotSessions(kidId)
  const [form, setForm] = useState({ shot_type: 'Free Throws', makes: '', attempts: '' })
  const [submitting, setSubmitting] = useState(false)

  const totalMakes    = sessions.reduce((s, x) => s + x.makes, 0)
  const totalAttempts = sessions.reduce((s, x) => s + x.attempts, 0)
  const overallPct    = totalAttempts ? Math.round((totalMakes / totalAttempts) * 100) : null

  const byType = SHOT_TYPES.map(type => {
    const s = sessions.filter(x => x.shot_type === type)
    const m = s.reduce((a, x) => a + x.makes, 0)
    const a = s.reduce((a, x) => a + x.attempts, 0)
    return { type, makes: m, attempts: a, pct: a ? Math.round((m / a) * 100) : null }
  }).filter(x => x.attempts > 0)

  const handleSubmit = async () => {
    if (!form.makes || !form.attempts) return
    setSubmitting(true)
    await addSession(form)
    setForm(f => ({ ...f, makes: '', attempts: '' }))
    setSubmitting(false)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: THEME.muted }}>Loading...</div>
  if (error)   return <ErrorState message={error} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Today's summary */}
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
        <Section label="Today by Type">
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

      {/* Log form */}
      <Section label="Log Shots">
        {/* Shot type selector */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
          {SHOT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setForm(f => ({ ...f, shot_type: type }))}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: `1px solid ${form.shot_type === type ? THEME.gold : THEME.border}`,
                background: form.shot_type === type ? `${THEME.gold}22` : 'transparent',
                color: form.shot_type === type ? THEME.gold : THEME.muted,
                fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.15s',
              }}
            >{type}</button>
          ))}
        </div>

        {/* Makes / Attempts inputs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Makes"
            value={form.makes}
            onChange={e => setForm(f => ({ ...f, makes: e.target.value }))}
            style={{ flex: 1, padding: '10px 12px' }}
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Attempts"
            value={form.attempts}
            onChange={e => setForm(f => ({ ...f, attempts: e.target.value }))}
            style={{ flex: 1, padding: '10px 12px' }}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.makes || !form.attempts}
            style={{
              padding: '10px 18px',
              background: THEME.purple,
              border: 'none',
              borderRadius: 8,
              color: THEME.text,
              fontWeight: 700,
              fontSize: 18,
            }}
          >+</button>
        </div>
      </Section>

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
