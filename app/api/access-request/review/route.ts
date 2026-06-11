import { NextResponse } from 'next/server'
import { requireStaff } from '@/lib/auth-middleware'
import { createStaffMember, getPendingAccessRequests, approveAccessRequest, denyAccessRequest } from '@/sanity/queries'

export async function GET(request: Request) {
  const auth = await requireStaff(request, 'admin')
  if (auth instanceof NextResponse) return auth

  try {
    const requests = await getPendingAccessRequests()
    return NextResponse.json(requests)
  } catch {
    return NextResponse.json({ error: 'فشل جلب الطلبات' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireStaff(request, 'admin')
  if (auth instanceof NextResponse) return auth

  try {
    const { id, action } = await request.json()

    if (!id || !action) {
      return NextResponse.json({ error: 'المعرف والإجراء مطلوبان' }, { status: 400 })
    }

    if (action === 'approve') {
      const { default: sanityClient } = await import('@sanity/client')

      const requestData = await getPendingAccessRequests()
      const req = requestData.find((r: any) => r._id === id)
      if (!req) {
        return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })
      }

      await createStaffMember({ email: req.email, role: 'staff' })
      await approveAccessRequest(id)

      return NextResponse.json({ success: true, message: `تم قبول ${req.email}` })
    }

    if (action === 'deny') {
      await denyAccessRequest(id)
      return NextResponse.json({ success: true, message: 'تم رفض الطلب' })
    }

    return NextResponse.json({ error: 'إجراء غير صالح' }, { status: 400 })
  } catch (error: any) {
    console.error('Failed to process request:', error)
    return NextResponse.json({ error: 'فشل معالجة الطلب' }, { status: 500 })
  }
}
