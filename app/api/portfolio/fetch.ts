import { db } from "@/lib/db"
import { tradeOrders, priceCache } from "@/lib/db/schema"
import { AlpacaOrder, Response } from "../types"
import { HistoricalHistoryResult } from "yahoo-finance2/modules/historical"

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
 * Reads cached historical price data for all tickers from the database.
 *
 * @description
 * - Queries the `priceCache` table and returns a mapping of `ticker` → `HistoricalHistoryResult`.
 * - This function does **not** call the Yahoo Finance API; it returns cached results that were
 *   stored previously (cache writes/upserts are handled elsewhere and are limited to once per day).
 * - Returns an empty object if the cache query fails or there are no cached rows.
 *
 * @function getPricesSince
 * @returns {Promise<PriceHistoryType>} A map of ticker → historical data.
 */

const getPricesSince = async (): Promise<PriceHistoryType> => {
  try {
    const rows = await db.select().from(priceCache)
    const entries = rows.map((r) => [r.ticker, r.data] as [string, HistoricalHistoryResult])
    return Object.fromEntries(entries)
  } catch (error) {
    console.error("Error fetching price cache from database")
    console.error(error)
    return {}
  }
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
 * @returns {Promise<Response<PriceHistoryType>>} Wrapped success/error response.
 */
export const fetchPriceHistory = async (): Promise<Response<PriceHistoryType>> => {
  try {
    console.log("Fetch price history from database")
    const output = await getPricesSince()
    console.log("Successfully fetched price history from database")
    return { success: true, data: output }
  } catch (error) {
    console.error("Error fetching price history from database:", error)
    return { success: false, error: (error as Error).message }
  }
}
