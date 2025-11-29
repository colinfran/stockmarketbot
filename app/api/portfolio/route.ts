import { NextResponse } from "next/server"
import { fetchAllTradeOrders, fetchPriceHistory } from "./fetch"

/**
 * Handles GET requests to the /api/portfolio route.
 *
 * @description
 * Fetches all trade orders and their related market data.
 * - Retrieves all stored trade orders via `fetchAllTradeOrders`.
 * - Extracts the unique list of tickers from the orders.
 * - Fetches historical price data for each ticker via `fetchPriceHistory`.
 * - Computes the current price for each ticker using the latest bar in the history.
 *
 * Returns a structured JSON response containing:
 * - `tradeOrders`: the list of fetched trade orders
 * - `priceHistory`: historical bars for each ticker
 * - `currentPrices`: a map of each ticker to its latest closing price
 *
 * If any step fails, an error response is returned instead.
 *
 * @function GET
 * @returns {NextResponse} A Next.js Response with portfolio data or an error payload.
 */

export async function GET(): Promise<NextResponse> {
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
    Object.entries(history.data!).map(([t, h]) => {
      const sorted = [...h].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return [t, sorted.at(-1)!.close];
    })
  );
  return NextResponse.json({
    success: true,
    data: {
      tradeOrders: orders.data,
      priceHistory: history.data,
      currentPrices: currentPrices,
    },
  })
}
