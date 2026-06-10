self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  self.clients.claim()
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
