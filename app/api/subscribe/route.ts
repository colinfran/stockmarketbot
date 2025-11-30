import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { pushSubscriptions } from "@/lib/db/schema"

/**
 * Handles POST requests to the /api/subscribe route.
 * @description Saves a new push subscription to the `pushSubscriptions` table.
 * If the subscription already exists, the insert is ignored. Returns a JSON
 * response indicating whether the subscription was successfully stored.
 *
 * @function POST
 * @param {Request} request - The incoming HTTP request containing the subscription object.
 * @returns {Promise<NextResponse>} A Next.js Response object indicating success or failure.
 */

export const POST = async (request: Request): Promise<NextResponse> => {
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
