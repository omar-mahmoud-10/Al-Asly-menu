import { NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'
import { getStaffFromRequest, setAuthCookie, clearAuthCookie } from '@/lib/auth-middleware'
import { getStaffByEmail } from '@/sanity/queries'
import { verifyGoogleToken } from '@/lib/google-auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let email: string

    if (body.googleToken) {
      const payload = await verifyGoogleToken(body.googleToken)
      if (!payload) {
        return NextResponse.json({ error: 'فشل التحقق من حساب Google' }, { status: 401 })
      }
      email = payload.email
    } else if (body.email) {
      email = body.email.toLowerCase().trim()
    } else {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const staff = await getStaffByEmail(email)
    if (!staff) {
      return NextResponse.json({ error: 'ليس لديك صلاحية الدخول', email }, { status: 401 })
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
  } catch (error: any) {
    console.error('Login error:', error?.message, error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم', details: error?.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const staff = await getStaffFromRequest(request)

  if (!staff) {
    const response = NextResponse.json({ valid: false }, { status: 401 })
    clearAuthCookie(response)
    return response
  }

  const fresh = await getStaffByEmail(staff.email)
  if (!fresh) {
    const response = NextResponse.json({ valid: false }, { status: 401 })
    clearAuthCookie(response)
    return response
  }

  return NextResponse.json({
    valid: true,
    staff: { email: fresh.email, role: fresh.role, id: fresh._id },
  })
}

export async function DELETE(_request: Request) {
  const response = NextResponse.json({ success: true })
  clearAuthCookie(response)
  return response
}
