import { useState } from 'react'
import { SPORTS } from '../../lib/sports'
import { THEME } from '../../lib/constants'

// Logs a basketball session (shot_type, makes, attempts) via the parent's addSession callback.
export default function BasketballForm({ onAdd, disabled }) {
  const shotTypes = SPORTS.basketball.shotTypes
  const [form, setForm] = useState({ shot_type: shotTypes[0], makes: '', attempts: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (disabled) return
    if (!form.makes || !form.attempts) return
    setSubmitting(true)
    await onAdd(form)
    setForm(f => ({ ...f, makes: '', attempts: '' }))
    setSubmitting(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
        {shotTypes.map(type => (
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

      <div style={{ display: 'flex', gap: 8 }}>
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
          disabled={submitting || disabled || !form.makes || !form.attempts}
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
    </div>
  )
}
