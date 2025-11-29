import { NextResponse } from "next/server"
import { fetchAllTradeOrders, fetchPriceHistory } from "./fetch"

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
  const tickers = [...new Set(orders.data!.map((o) => o.symbol))]
  const history = await fetchPriceHistory(tickers)
  if (!history.success) {
    return NextResponse.json({ success: false, error: orders.error })
  }
  const currentPrices = Object.fromEntries(
    Object.entries(history.data!).map(([t, h]) => [t, h.at(-1)!.close]),
  )
  return NextResponse.json({
    success: true,
    data: {
      tradeOrders: orders.data,
      priceHistory: history.data,
      currentPrices: currentPrices,
    },
  })
}
