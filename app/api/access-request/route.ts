import { NextResponse } from 'next/server'
import { getStaffByEmail, createAccessRequest } from '@/sanity/queries'
import { verifyGoogleToken } from '@/lib/google-auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let email: string
    let googleToken: string | undefined

    if (body.googleToken) {
      const payload = await verifyGoogleToken(body.googleToken)
      if (!payload) {
        return NextResponse.json({ error: 'رمز Google غير صالح' }, { status: 400 })
      }
      email = payload.email
      googleToken = body.googleToken
    } else if (body.email) {
      email = body.email.toLowerCase().trim()
    } else {
      return NextResponse.json({ error: 'البريد الإلكتروني أو رمز Google مطلوب' }, { status: 400 })
    }

    const existingStaff = await getStaffByEmail(email)
    if (existingStaff) {
      return NextResponse.json({ error: 'هذا البريد لديه صلاحية بالفعل' }, { status: 409 })
    }

    await createAccessRequest(email, googleToken)

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الوصول إلى المدير',
    })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
