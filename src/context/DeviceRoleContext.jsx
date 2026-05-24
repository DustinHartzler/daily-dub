import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { hashPin, verifyPin } from '../lib/pin'

const STORAGE_KEY = 'dc-tracker:device-role'

// role: 'kenley' | 'kellen' | 'parent' | null
// viewingKidId: which kid the UI is showing; defaults to role when role is a kid

const DeviceRoleContext = createContext(null)

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStored(value) {
  if (value == null) localStorage.removeItem(STORAGE_KEY)
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function DeviceRoleProvider({ children }) {
  const [stored, setStored] = useState(() => readStored())
  const [viewingKidId, setViewingKidIdState] = useState(() => {
    const s = readStored()
    if (!s) return 'kenley'
    return s.role === 'parent' ? 'kenley' : s.role
  })

  const role = stored?.role ?? null

  // Keep viewing kid pinned to own kid when a kid role is active and they haven't manually switched
  useEffect(() => {
    if (role === 'kenley' || role === 'kellen') {
      setViewingKidIdState(prev => prev ?? role)
    }
  }, [role])

  const assignRole = useCallback(async (nextRole, pin) => {
    const next = { role: nextRole }
    if (nextRole === 'parent') {
      if (!pin) throw new Error('Parent role requires a PIN')
      next.parentPinHash = await hashPin(pin)
    } else {
      // preserve existing parent PIN hash if present, so re-assigning to parent later doesn't need re-entry
      if (stored?.parentPinHash) next.parentPinHash = stored.parentPinHash
    }
    writeStored(next)
    setStored(next)
    if (nextRole !== 'parent') setViewingKidIdState(nextRole)
  }, [stored])

  const clearRole = useCallback(() => {
    // Keep the PIN hash so a returning parent doesn't have to re-set it
    const next = stored?.parentPinHash ? { role: null, parentPinHash: stored.parentPinHash } : null
    writeStored(next)
    setStored(next)
  }, [stored])

  const verifyParentPin = useCallback(async (pin) => {
    return verifyPin(pin, stored?.parentPinHash)
  }, [stored])

  const setViewingKidId = useCallback((kidId) => {
    setViewingKidIdState(kidId)
  }, [])

  const canEdit = useCallback((targetKidId) => {
    if (role === 'parent') return false  // parent dashboard is view-only for now
    if (role === 'kenley' || role === 'kellen') return role === targetKidId
    return false
  }, [role])

  const value = useMemo(() => ({
    role,
    parentPinHash: stored?.parentPinHash ?? null,
    viewingKidId,
    setViewingKidId,
    canEdit,
    assignRole,
    clearRole,
    verifyParentPin,
  }), [role, stored, viewingKidId, setViewingKidId, canEdit, assignRole, clearRole, verifyParentPin])

  return <DeviceRoleContext.Provider value={value}>{children}</DeviceRoleContext.Provider>
}

export function useDeviceRole() {
  const ctx = useContext(DeviceRoleContext)
  if (!ctx) throw new Error('useDeviceRole must be used inside <DeviceRoleProvider>')
  return ctx
}
