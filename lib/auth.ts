export interface StaffTokenPayload {
  email: string
  role: 'admin' | 'manager' | 'staff'
  staffId: string
  iat?: number
}

export async function createToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const payloadB64 = btoa(JSON.stringify(payload))
  const encoder = new TextEncoder()

  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  )

  const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBytes)))

  return `${payloadB64}.${sigB64}`
}

export async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [payloadB64, sigB64] = token.split('.')
    if (!payloadB64 || !sigB64) return false

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify'],
    )

    const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0))
    const dataBytes = encoder.encode(payloadB64)

    return await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes)
  } catch {
    return false
  }
}

export async function verifyAndDecodeToken(token: string, secret: string): Promise<StaffTokenPayload | null> {
  try {
    const [payloadB64, sigB64] = token.split('.')
    if (!payloadB64 || !sigB64) return null

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify'],
    )

    const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0))
    const dataBytes = encoder.encode(payloadB64)

    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes)
    if (!valid) return null

    const payload = JSON.parse(atob(payloadB64))
    if (!payload.email || !payload.role) return null

    return payload as StaffTokenPayload
  } catch {
    return null
  }
}
