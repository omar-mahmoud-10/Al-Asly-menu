import { NextResponse } from 'next/server'
import { getStaffFromRequest } from '@/lib/auth-middleware'
import { getStaffByEmail } from '@/sanity/queries'

async function getCurrentStaff(staff: { email: string; role: string; staffId: string; iat?: number }) {
  const fiveMin = 5 * 60 * 1000
  if (staff.iat && Date.now() - staff.iat < fiveMin) {
    return { email: staff.email, role: staff.role, _id: staff.staffId }
  }
  return await getStaffByEmail(staff.email)
}

export async function GET(request: Request) {
  const staff = await getStaffFromRequest(request)

  if (!staff) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const current = await getCurrentStaff(staff)
  if (!current) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    staff: { email: current.email, role: current.role, id: current._id },
  })
}
