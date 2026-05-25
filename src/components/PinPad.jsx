import { useState } from 'react'
import { THEME } from '../lib/constants'
import { verifyPin } from '../lib/pin'
import Icon from './Icon'

// Props:
//   mode: 'create' | 'verify'
//   expectedHash: required when mode === 'verify'
//   onCreate: (pin) => void                  — fired after user types + confirms a 4-digit pin
//   onSuccess: () => void                    — fired after a successful verify
//   onCancel: () => void                     — optional, shows a Cancel button when present
export default function PinPad({ mode, expectedHash, onCreate, onSuccess, onCancel }) {
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState(null)   // null = entering first; string = waiting for confirm
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const stage = mode === 'create' && confirm !== null ? 'confirm' : 'enter'
  const heading = mode === 'verify'
    ? 'Enter parent PIN'
    : stage === 'enter' ? 'Set a parent PIN' : 'Confirm PIN'

  const press = async (digit) => {
    if (busy) return
    setError('')
    const next = (pin + digit).slice(0, 4)
    setPin(next)
    if (next.length === 4) await submit(next)
  }

  const submit = async (value) => {
    setBusy(true)
    try {
      if (mode === 'verify') {
        const ok = await verifyPin(value, expectedHash)
        if (ok) onSuccess?.()
        else { setError('Wrong PIN'); setPin('') }
      } else {
        if (confirm === null) { setConfirm(value); setPin('') }
        else if (confirm === value) onCreate?.(value)
        else { setError('PINs didn\'t match'); setConfirm(null); setPin('') }
      }
    } finally {
      setBusy(false)
    }
  }

  const backspace = () => { if (!busy) { setPin(p => p.slice(0, -1)); setError('') } }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: 24 }}>
      <div style={{ color: THEME.text, fontSize: 18, fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 1 }}>
        {heading}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 14 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: i < pin.length ? THEME.gold : 'transparent',
            border: `2px solid ${i < pin.length ? THEME.gold : THEME.border}`,
            transition: 'all 0.12s',
          }} />
        ))}
      </div>

      {error && <div style={{ color: '#FF8080', fontSize: 13 }}>{error}</div>}

      {/* Keypad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 64px)', gap: 10 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <KeyBtn key={d} onClick={() => press(String(d))}>{d}</KeyBtn>
        ))}
        <div />
        <KeyBtn onClick={() => press('0')}>0</KeyBtn>
        <KeyBtn onClick={backspace} muted><Icon name="backspace" size={20} /></KeyBtn>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: 4,
            background: 'transparent',
            border: 'none',
            color: THEME.muted,
            fontSize: 13,
            padding: '6px 12px',
          }}
        >Cancel</button>
      )}
    </div>
  )
}

function KeyBtn({ children, onClick, muted }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 64,
        height: 56,
        borderRadius: 12,
        background: THEME.surface2,
        border: `1px solid ${THEME.border}`,
        color: muted ? THEME.muted : THEME.text,
        fontSize: 22,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
      }}
    >{children}</button>
  )
}
