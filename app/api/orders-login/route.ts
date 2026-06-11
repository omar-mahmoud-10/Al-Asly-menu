import { NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'
import { getStaffFromRequest, setAuthCookie, clearAuthCookie } from '@/lib/auth-middleware'
import { getStaffByEmail } from '@/sanity/queries'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const staff = await getStaffByEmail(email.toLowerCase().trim())
    if (!staff) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير مصرح به' }, { status: 401 })
    }

    const secret = process.env.SITE_AUTH_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'الخادم غير مهيأ' }, { status: 500 })
    }

    const token = await createToken({
      email: staff.email,
      role: staff.role,
      staffId: staff._id,
      iat: Date.now(),
    }, secret)

    const response = NextResponse.json({
      success: true,
      staff: { email: staff.email, role: staff.role, id: staff._id },
    })

    setAuthCookie(response, token)

    return response
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const staff = await getStaffFromRequest(request)

  if (!staff) {
    const response = NextResponse.json({ valid: false }, { status: 401 })
    clearAuthCookie(response)
    return response
  }

  return NextResponse.json({ valid: true, staff })
}

export async function DELETE(_request: Request) {
  const response = NextResponse.json({ success: true })
  clearAuthCookie(response)
  return response
}
