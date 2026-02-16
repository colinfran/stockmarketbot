import { NextResponse } from "next/server"
import { updatePriceHistoryCache } from "./fetch"
import { fetchAllTradeOrders } from "../../portfolio/fetch"

/**
 * Cron route handler for refreshing the price history cache.
 *
 * @description
 * - GET endpoint intended to be invoked by a scheduled cron job (e.g., once per day).
 * - Fetches all trade orders from the database, extracts unique tickers, and calls
 *   `updatePriceHistoryCache(tickers)` to refresh cached historical data for each ticker.
 * - Per-ticker errors are logged and do not prevent other tickers from being processed.
 *
 * Responses:
 * - 401 Unauthorized if the secret is invalid.
 * - `{ success: true }` if all updates completed successfully (or completed with per-ticker errors logged).
 * - `{ success: false, error: string }` if any step fails (e.g., failing to fetch trade orders or update the cache overall).
 *
 * @function GET
 * @param {Request} request - The incoming Next.js Request object.
 * @returns {Promise<NextResponse>} A Next.js Response object.
 */

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }
  console.log("Running price history service cron")
  console.log("Fetch all tradeOrders from database")
  const orders = await fetchAllTradeOrders()
  if (!orders.success) {
    return NextResponse.json({ success: false, error: orders.error })
  }
  console.log("Successfully fetched tradeOrders from database")
  const tickers = [
    ...new Set(
      orders.data!.map((o) => o.symbol).filter((symbol): symbol is string => symbol !== undefined),
    ),
  ]
  const report = await updatePriceHistoryCache(tickers)
  if (!report.success) {
    return NextResponse.json({ success: false, error: report.error })
  }
  console.log("Finished price history service cron")
  return NextResponse.json({ success: true })
}
