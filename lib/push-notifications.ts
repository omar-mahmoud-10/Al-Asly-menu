import webpush from 'web-push'
import { client, writeClient } from '@/sanity/lib/client'

function ensureVapidSetup() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@elsaly.com'

  if (!publicKey || !privateKey) {
    console.warn('VAPID keys not configured. Push notifications disabled.')
    return false
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  return true
}

export async function getPushSubscriptions() {
  try {
    const subs = await client.fetch(
      `*[_type == "pushSubscription"] { _id, email, subscription, createdAt }`
    )
    return subs
  } catch (e) {
    console.error('Failed to fetch push subscriptions:', e)
    return []
  }
}

export async function savePushSubscription(email: string, subscription: { endpoint: string; keys: { p256dh: string; auth: string } }) {
  try {
    const existing = await client.fetch(
      `*[_type == "pushSubscription" && email == $email && subscription.endpoint == $endpoint][0]`,
      { email, endpoint: subscription.endpoint }
    )
    if (existing) return existing._id

    const doc = await writeClient.create({
      _type: 'pushSubscription',
      email,
      subscription,
      createdAt: new Date().toISOString(),
    })
    return doc._id
  } catch (e) {
    console.error('Failed to save push subscription:', e)
    throw e
  }
}

export async function removePushSubscription(endpoint: string) {
  try {
    const existing = await client.fetch(
      `*[_type == "pushSubscription" && subscription.endpoint == $endpoint][0]`,
      { endpoint }
    )
    if (existing) {
      await writeClient.delete(existing._id)
    }
  } catch (e) {
    console.error('Failed to remove push subscription:', e)
    throw e
  }
}

export async function notifyNewOrder(order: {
  id: string
  customerName: string
  branch: string
  orderType: string
  totalPrice: number
  items: { name: string; quantity: number }[]
}) {
  if (!ensureVapidSetup()) return

  const subs = await getPushSubscriptions()
  if (subs.length === 0) return

  const itemsStr = order.items.map(i => `${i.name} ×${i.quantity}`).join('، ')
  const title = `طلب جديد من ${order.customerName || order.branch}`
  const body = `${order.branch} - ${order.orderType}\n${itemsStr}\nالإجمالي: ${order.totalPrice} جنيه`

  const payload = JSON.stringify({
    title,
    body,
    orderId: order.id,
  })

  const results = await Promise.allSettled(
    subs.map(async (sub: { subscription: webpush.PushSubscription }) => {
      try {
        await webpush.sendNotification(sub.subscription, payload, {
          TTL: 86400,
        })
      } catch (e: any) {
        if (e.statusCode === 410 || e.statusCode === 404) {
          await removePushSubscription(sub.subscription.endpoint).catch(() => {})
        }
        throw e
      }
    })
  )

  const failed = results.filter(r => r.status === 'rejected').length
  if (failed > 0) {
    console.warn(`${failed} push notification(s) failed (subscriptions may have been cleaned up)`)
  }
}
