import { NextResponse } from 'next/server'
import { verifyAndDecodeToken, type StaffTokenPayload } from './auth'
import { getStaffByEmail } from '@/sanity/queries'

export interface StaffInfo {
  email: string
  role: 'admin' | 'manager' | 'staff'
  staffId: string
  iat?: number
}

export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)staff_token=([^;]+)/)
  if (match) return decodeURIComponent(match[1])

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}

export async function getStaffFromRequest(request: Request): Promise<StaffInfo | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null

  const secret = process.env.SITE_AUTH_SECRET
  if (!secret) return null

  const payload = await verifyAndDecodeToken(token, secret)
  if (!payload) return null

  return {
    email: payload.email,
    role: payload.role,
    staffId: payload.staffId,
    iat: payload.iat,
  }
}

async function getCurrentStaff(staff: StaffInfo): Promise<{ email: string; role: string; _id: string } | null> {
  const fiveMin = 5 * 60 * 1000
  if (staff.iat && Date.now() - staff.iat < fiveMin) {
    return { email: staff.email, role: staff.role, _id: staff.staffId }
  }
  return await getStaffByEmail(staff.email)
}

export async function requireStaff(
  request: Request,
  minimumRole?: 'admin' | 'manager' | 'staff'
): Promise<{ staff: StaffInfo } | NextResponse> {
  const staff = await getStaffFromRequest(request)

  if (!staff) {
    return NextResponse.json({ error: 'غير مصرح به', message: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
  }

  const current = await getCurrentStaff(staff)
  if (!current) {
    return NextResponse.json({ error: 'غير مصرح به', message: 'الحساب غير موجود' }, { status: 401 })
  }

  if (minimumRole) {
    const roleHierarchy: Record<string, number> = { staff: 0, manager: 1, admin: 2 }
    if ((roleHierarchy[current.role] ?? -1) < (roleHierarchy[minimumRole] ?? 0)) {
      return NextResponse.json({ error: 'غير مصرح به', message: 'لا تملك الصلاحية المطلوبة' }, { status: 403 })
    }
  }

  return { staff: { email: current.email, role: current.role as StaffInfo['role'], staffId: current._id } }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set('staff_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set('staff_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
