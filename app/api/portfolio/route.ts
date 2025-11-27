import { NextResponse } from "next/server"
import { fetchAllTradeOrders } from "./fetch"

/**
 * Handles GET requests to the /api/portfolio route.
 * @description Fetches all trade orders using the fetchAllTradeOrders helper.
 * Returns a JSON response containing either the list of trade orders or an error message.
 * @function GET
 * @returns {NextResponse} A Next.js Response object with the fetched trade orders data if successful,
 * or an error message if the fetch fails.
 */

export async function GET(): Promise<NextResponse> {
  console.log("Fetching trade orders")
  const orders = await fetchAllTradeOrders()
  if (!orders.success) {
    return NextResponse.json({ success: false, error: orders.error })
  }
  return NextResponse.json({ success: true, data: orders.data })
}
