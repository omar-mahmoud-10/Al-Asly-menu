import { NextResponse } from 'next/server'
import { getStaffByEmail, createAccessRequest } from '@/sanity/queries'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    const existingStaff = await getStaffByEmail(cleanEmail)
    if (existingStaff) {
      return NextResponse.json({ error: 'هذا البريد لديه صلاحية بالفعل' }, { status: 409 })
    }

    await createAccessRequest(cleanEmail)

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الوصول إلى المدير',
    })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
