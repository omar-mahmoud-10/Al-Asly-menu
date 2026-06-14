self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'show-notification') {
    const { title, body } = event.data
    self.registration.showNotification(title, {
      body,
      icon: '/logo_metaTitle.jpg',
      tag: 'new-order',
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
      silent: false,
    })
  }
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  try {
    const data = event.data.json()
    const title = data.title || 'طلب جديد'
    const body = data.body || ''
    const orderId = data.orderId || ''
    self.registration.showNotification(title, {
      body,
      icon: '/logo_metaTitle.jpg',
      tag: `new-order-${orderId}`,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
      silent: false,
      data: { orderId, url: '/orders' },
    })
  } catch {
    self.registration.showNotification('طلب جديد', {
      body: 'يوجد طلب جديد بانتظار التأكيد',
      icon: '/logo_metaTitle.jpg',
      tag: 'new-order',
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
    })
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = new URL('/orders', self.location.origin)
  const promise = clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  }).then((windowClients) => {
    const matchingClient = windowClients.find((c) => c.url.includes('/orders'))
    if (matchingClient) {
      return matchingClient.focus()
    }
    return clients.openWindow(urlToOpen.toString())
  })
  event.waitUntil(promise)
})
