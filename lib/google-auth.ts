export async function verifyGoogleToken(idToken: string): Promise<{ email: string; name?: string } | null> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.email) return null
    return { email: data.email.toLowerCase(), name: data.name }
  } catch {
    return null
  }
}

export function getGoogleClientId(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
}
