import { NextResponse } from 'next/server'
import { getStaffFromRequest } from '@/lib/auth-middleware'
import { getStaffByEmail } from '@/sanity/queries'

export async function GET(request: Request) {
  const staff = await getStaffFromRequest(request)

  if (!staff) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const fresh = await getStaffByEmail(staff.email)
  if (!fresh) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    staff: { email: fresh.email, role: fresh.role, id: fresh._id },
  })
}
