/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db"
import { pushSubscriptions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import webpush from "web-push"

export const sendNotification = async (title: string, body: string): Promise<void> => {
  try {
    const subs = await db.select().from(pushSubscriptions)
    if (subs.length === 0) {
      throw new Error("No subscriptions found")
    }

    webpush.setVapidDetails(
      "mailto:hello@colinfran.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    )

    const promises = subs.map(async (sub) => {
      const subscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      }

      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title,
            body,
          }),
        )
      } catch (error: any) {
        const statusCode = error?.statusCode
        if (statusCode === 410 || statusCode === 404) {
          console.log(`Deleting invalid subscription ${sub.id} (status: ${statusCode})`)
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id))
        }
      }
    })

    await Promise.all(promises)
  } catch (error: any) {
    console.error("Failed to send push:", error)
    throw error
  }
}
