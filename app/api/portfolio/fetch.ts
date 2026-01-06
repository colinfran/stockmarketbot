import { db } from "@/lib/db"
import { tradeOrders, priceCache } from "@/lib/db/schema"
import { AlpacaOrder, Response } from "../types"
import { HistoricalHistoryResult } from "yahoo-finance2/modules/historical"
import { yahooFinance } from "../index"
import { eq } from "drizzle-orm"

/**
 * Fetches all trade orders from the database.
 *
 * @description
 * - Queries the `tradeOrders` table using the database client.
 * - Returns all stored trade orders, cast into `AlpacaOrder` objects.
 *
 * Response Structure:
 * - On success: `{ success: true, data: AlpacaOrder[] }`
 * - On failure: `{ success: false, error: string }`
 *
 * @function fetchAllTradeOrders
 * @returns {Promise<Response<AlpacaOrder[]>>} A wrapped success/error response.
 */
export const fetchAllTradeOrders = async (): Promise<Response<AlpacaOrder[]>> => {
  console.log("Fetch all tradeOrders from database")
  try {
    const data = await db.select().from(tradeOrders)
    console.log("Successfully fetched tradeOrders from database")
    return { success: true, data: data as unknown as AlpacaOrder[] }
  } catch (error) {
    console.error("Error fetching tradeOrders from database:", error)
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Represents a mapping of tickers to their historical price data.
 * @typedef PriceHistoryType
 * @property {HistoricalHistoryResult | null} [ticker] - The Yahoo Finance historical price array for a ticker, or null if fetch failed.
 */
export type PriceHistoryType = {
  [k: string]: HistoricalHistoryResult | null
}

/**
 * Fetches historical price data for a list of tickers.
 *
 * @description
 * - Deduplicates the provided list of tickers.
 * - Sends all Yahoo Finance historical requests in parallel for performance.
 * - Fetches daily bars from a fixed start date (2025-11-25) up to now.
 * - Shapes the result as an object: `{ TICKER: HistoricalHistoryResult }`
 *
 * @function getPricesSince
 * @param {string[]} tickers - List of stock tickers.
 * @returns {Promise<PriceHistoryType>} A map of ticker → historical data.
 */

const getPricesSince = async (tickers: string[]): Promise<PriceHistoryType> => {
  const uniqueTickers = [...new Set(tickers)]

  const entries = await Promise.all(
    uniqueTickers.map(async (ticker) => {
      try {
        // throw new Error("Testing error handling for ticker " + ticker)
        const fetched = await yahooFinance.historical(ticker, {
          // for testing, use 11/21/2025, after we get the first purchases, we can use 11/25/2025
          period1: new Date("2025-11-21"),
          //period1: new Date("2025-11-25"),
          period2: new Date(),
          interval: "1d",
        })

        // Upsert cached value, but only once per day to avoid redundant writes
        try {
          const rows = await db.select().from(priceCache).where(eq(priceCache.ticker, ticker))
          const existing = rows[0]
          const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
          const fetchedDate = existing?.fetched_at
            ? new Date(existing.fetched_at).toISOString().slice(0, 10)
            : null

          if (!existing || fetchedDate !== today) {
            await db
              .insert(priceCache)
              .values({ ticker, data: fetched, fetched_at: new Date() })
              .onConflictDoUpdate({
                target: priceCache.ticker,
                set: { data: fetched, fetched_at: new Date() },
              })
          } else {
            console.log(
              `Skipping DB update for ${ticker}; already fetched from yahoo finance api today (${today})`,
            )
          }
        } catch (e) {
          console.error(`Failed to upsert price cache for ${ticker}:`, e)
        }

        return [ticker, fetched] as const
      } catch (error) {
        console.error(`Failed to fetch price for ${ticker}`)
        console.error(error)
        console.error("Reading from db cache")
        try {
          const rows = await db.select().from(priceCache).where(eq(priceCache.ticker, ticker))
          return [ticker, rows[0].data]
        } catch (e) {
          console.error(`Failed to read price cache for ${ticker} from the DB`)
          console.error(e)
        }
        return [ticker, null] as const
      }
    }),
  )

  return Object.fromEntries(entries)
}

/**
 * Retrieves historical price data for a list of tickers and wraps the result.
 *
 * @description
 * - Delegates work to `getPricesSince` to fetch and shape the data.
 * - Returns a standardized Response object.
 *
 * Response Structure:
 * - On success: `{ success: true, data: PriceHistoryType }`
 * - On failure: `{ success: false, error: string }`
 *
 * @function fetchPriceHistory
 * @param {string[]} list - The list of tickers to fetch history for.
 * @returns {Promise<Response<PriceHistoryType>>} Wrapped success/error response.
 */
export const fetchPriceHistory = async (list: string[]): Promise<Response<PriceHistoryType>> => {
  try {
    console.log("Fetch price history from yahoo")
    const output = await getPricesSince(list)
    console.log("Successfully fetched price history from yahoo")
    return { success: true, data: output }
  } catch (error) {
    console.error("Error fetching price history from yahoo:", error)
    return { success: false, error: (error as Error).message }
  }
}
