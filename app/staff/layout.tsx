import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAndDecodeToken } from '@/lib/auth'

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('staff_token')?.value

  if (!token) {
    redirect('/staff-login')
  }

  const secret = process.env.SITE_AUTH_SECRET
  if (!secret) {
    redirect('/staff-login')
  }

  const payload = await verifyAndDecodeToken(token, secret)
  if (!payload) {
    redirect('/staff-login')
  }

  if (payload.role !== 'admin') {
    redirect('/unauthorized')
  }

  return <>{children}</>
}
