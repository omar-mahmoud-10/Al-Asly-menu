import { NextResponse } from 'next/server'
import { getAllStaff, createStaffMember } from '@/sanity/queries'

export async function POST(request: Request) {
  try {
    const existing = await getAllStaff()
    if (existing.length > 0) {
      return NextResponse.json({ error: 'يوجد أعضاء بالفعل - استخدم صفحة الإدارة لإضافة المزيد' }, { status: 400 })
    }

    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const doc = await createStaffMember({
      email: email.toLowerCase().trim(),
      role: 'admin',
    })

    return NextResponse.json({
      success: true,
      message: `تم إنشاء حساب المدير: ${email}`,
      id: doc._id,
    })
  } catch (error: any) {
    console.error('Setup failed:', error)
    return NextResponse.json({ error: 'فشل الإعداد' }, { status: 500 })
  }
}
