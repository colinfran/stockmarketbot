self.addEventListener("install", (event) => {
  console.log("[v0] Service Worker installing.")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[v0] Service Worker activating.")
  event.waitUntil(self.clients.claim())
})

self.addEventListener("push", (event) => {
  console.log("[v0] Push event received:", event)

  let data = {}
  if (event.data) {
    data = event.data.json()
  }

  const title = data.title || "New Notification"
  const options = {
    body: data.body || "You have a new notification!",
    icon: data.icon || "/icon.svg",
    badge: data.badge || "/icon.svg",
    vibrate: [200, 100, 200],
    data: data.data || {},
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  console.log("[v0] Notification clicked:", event)

  event.notification.close()

  event.waitUntil(clients.openWindow("/"))
})
