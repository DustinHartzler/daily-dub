import { useState } from 'react'
import { KIDS, THEME } from '../lib/constants'
import { useDeviceRole } from '../context/DeviceRoleContext'
import PinPad from '../components/PinPad'

// First-launch flow. Pick Kenley, Kellen, or Parent (Parent requires PIN).
export default function SetupPage() {
  const { assignRole, parentPinHash, verifyParentPin } = useDeviceRole()
  const [chosen, setChosen] = useState(null) // 'kenley' | 'kellen' | 'parent' | null

  // Kid role: one-tap.
  const pickKid = async (kidId) => { await assignRole(kidId) }

  // Parent: if a PIN hash already exists, verify; else create.
  const handleParent = async (pin) => { await assignRole('parent', pin) }
  const handleParentVerify = async () => { await assignRole('parent') }

  if (chosen === 'parent') {
    return (
      <Shell>
        <PinPad
          mode={parentPinHash ? 'verify' : 'create'}
          expectedHash={parentPinHash}
          onCreate={handleParent}
          onSuccess={handleParentVerify}
          onCancel={() => setChosen(null)}
        />
        <Footer />
      </Shell>
    )
  }

  return (
    <Shell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 24, maxWidth: 360, width: '100%' }}>
        <h1 style={{
          color: THEME.text,
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 1,
          textAlign: 'center',
          marginBottom: 4,
        }}>Whose device?</h1>
        <p style={{ color: THEME.muted, fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
          Pick once — long-press the header later to change.
        </p>

        {KIDS.map(k => (
          <RoleButton key={k.id} onClick={() => pickKid(k.id)}>
            <span style={{ fontSize: 24 }}>{k.emoji}</span>
            <span>{k.name}</span>
          </RoleButton>
        ))}
        <RoleButton onClick={() => setChosen('parent')} accent>
          <span style={{ fontSize: 22 }}>👤</span>
          <span>Parent</span>
        </RoleButton>
      </div>
      <Footer />
    </Shell>
  )
}

function Shell({ children }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: THEME.dark,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>{children}</div>
  )
}

function RoleButton({ children, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 20px',
        borderRadius: 12,
        border: `2px solid ${accent ? THEME.gold : THEME.border}`,
        background: accent ? `${THEME.gold}11` : THEME.surface2,
        color: accent ? THEME.gold : THEME.text,
        fontSize: 18,
        fontWeight: 700,
        fontFamily: 'Barlow Condensed, sans-serif',
        letterSpacing: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'center',
      }}
    >{children}</button>
  )
}

function Footer() {
  return (
    <p style={{
      color: THEME.muted,
      fontSize: 11,
      textAlign: 'center',
      padding: '20px 24px',
      maxWidth: 320,
    }}>
      Forgot the parent PIN? Clear this site's data in your browser settings to reset.
    </p>
  )
}
