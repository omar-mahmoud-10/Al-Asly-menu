import { NextRequest, NextResponse } from 'next/server'
import { requireStaff } from '@/lib/auth-middleware'
import { savePushSubscription } from '@/lib/push-notifications'

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { email, subscription } = await request.json()

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 })
    }

    await savePushSubscription(email, subscription)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to save push subscription:', error)
    return NextResponse.json({ error: 'فشل حفظ الاشتراك في الإشعارات' }, { status: 500 })
  }
}
