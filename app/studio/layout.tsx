import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAndDecodeToken } from '@/lib/auth'
import { getAllStaff } from '@/sanity/queries'

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const staff = await getAllStaff()

  if (staff.length === 0) {
    return <>{children}</>
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('staff_token')?.value

  if (!token) {
    redirect('/orders')
  }

  const secret = process.env.SITE_AUTH_SECRET
  if (!secret) {
    redirect('/orders')
  }

  const payload = await verifyAndDecodeToken(token, secret)
  if (!payload || payload.role !== 'admin') {
    redirect('/orders')
  }

  return <>{children}</>
}
