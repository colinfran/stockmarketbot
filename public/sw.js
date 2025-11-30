self.addEventListener("install", (event) => {
  console.log("Service Worker installing.")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.")
  event.waitUntil(self.clients.claim())
})

self.addEventListener("push", (event) => {
  console.log("Push event received:", event)

  let data = {}
  if (event.data) {
    data = event.data.json()
  }

  const title = data.title || "New Notification"
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: data.data || {},
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event)

  event.notification.close()

  event.waitUntil(clients.openWindow("/"))
})
