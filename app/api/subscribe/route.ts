import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { pushSubscriptions } from "@/lib/db/schema"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const subscription = await request.json()
    await db
      .insert(pushSubscriptions)
      .values({
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      })
      .onConflictDoNothing()

    console.log("New subscription stored:", subscription.endpoint)

    return NextResponse.json({
      success: true,
      message: "Subscription saved",
    })
  } catch (error) {
    console.error("Failed to store subscription:", error)
    return NextResponse.json(
      { success: false, error: "Failed to store subscription" },
      { status: 500 },
    )
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const subs = await db.select().from(pushSubscriptions)

    const subscriptions = subs.map((sub) => ({
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    }))

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error)
    return NextResponse.json({ subscriptions: [] })
  }
}
