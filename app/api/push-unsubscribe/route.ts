import { NextRequest, NextResponse } from 'next/server'
import { requireStaff } from '@/lib/auth-middleware'
import { removePushSubscription } from '@/lib/push-notifications'

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 })
    }

    await removePushSubscription(endpoint)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to remove push subscription:', error)
    return NextResponse.json({ error: 'فشل إلغاء الاشتراك في الإشعارات' }, { status: 500 })
  }
}
