// Family-app PIN gating. NOT real auth — Supabase RLS is the security boundary.
// This is just UX so Kellen can't tap "Parent" and start editing things.

export async function hashPin(plain) {
  const bytes = new TextEncoder().encode(String(plain))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPin(plain, hash) {
  if (!hash) return false
  const computed = await hashPin(plain)
  return computed === hash
}
