import { NextResponse } from "next/server"
import {
  fetchAllTradeOrders,
  fetchOpenPositions,
  fetchPriceHistory,
  fetchRealizedSpreadPnL,
} from "./fetch"
import { updatePriceHistoryCache } from "../cron/price-history-service/fetch"

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
  const history = await fetchPriceHistory()
  if (!history.success) {
    return NextResponse.json({ success: false, error: history.error })
  }
  const currentPrices = Object.fromEntries(
    Object.entries(history.data!).map(([t, h]) => {
      const sorted = Array.isArray(h)
        ? [...h].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : []
      return [t, sorted.at(-1)?.close]
    }),
  )
  const orders = await fetchAllTradeOrders()
  if (!orders.success) {
    return NextResponse.json({ success: false, error: orders.error })
  }

  // For any tickers in orders that are missing from the price cache, fetch and store
  // their full history now so the chart and current price are available immediately.
  const orderedTickers = [
    ...new Set(orders.data!.map((o) => o.symbol).filter((s): s is string => !!s)),
  ]
  const missingTickers = orderedTickers.filter((t) => currentPrices[t] === undefined)
  if (missingTickers.length > 0) {
    console.log(`Fetching missing price history for: ${missingTickers.join(", ")}`)
    await updatePriceHistoryCache(missingTickers)
    // Re-read the cache so the new history is included in this response
    const updated = await fetchPriceHistory()
    if (updated.success && updated.data) {
      for (const ticker of missingTickers) {
        const bars = updated.data[ticker]
        if (Array.isArray(bars) && bars.length > 0) {
          history.data![ticker] = bars
          const sorted = [...bars].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          const latest = sorted.at(-1)?.close
          if (latest != null) currentPrices[ticker] = latest
        }
      }
    }
  }

  const openPositions = await fetchOpenPositions()
  if (!openPositions.success) {
    return NextResponse.json({ success: false, error: openPositions.error })
  }
  const realizedSpreadPnL = await fetchRealizedSpreadPnL()
  if (!realizedSpreadPnL.success) {
    return NextResponse.json({ success: false, error: realizedSpreadPnL.error })
  }
  return NextResponse.json({
    success: true,
    data: {
      tradeOrders: orders.data,
      openPositions: openPositions.data,
      realizedSpreadPnL: realizedSpreadPnL.data?.totalRealizedPL || 0,
      priceHistory: history.data,
      currentPrices: currentPrices,
    },
  })
}
