import { db } from "@/lib/db"
import { tradeOrders, priceCache } from "@/lib/db/schema"
import { AlpacaOrder, AlpacaPosition, Response } from "../types"
import { HistoricalHistoryResult } from "yahoo-finance2/modules/historical"
import { alpaca } from "../index"

type ActivityFill = {
  id: string
  activity_type: string
  transaction_time?: string
  symbol?: string
  side?: "buy" | "sell" | string
  qty?: string | number
  price?: string | number
}

type OpenLot = {
  qty: number
  price: number
}

type RealizedSpreadPnL = {
  totalRealizedPL: number
}

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

export const fetchOpenPositions = async (): Promise<Response<AlpacaPosition[]>> => {
  console.log("Fetch open positions from Alpaca")
  try {
    const positions = (await alpaca.getPositions()) as AlpacaPosition[]
    const data = positions.map((position) => ({
      symbol: position.symbol,
      side: position.side,
      qty: position.qty,
      market_value: position.market_value,
      avg_entry_price: position.avg_entry_price,
      cost_basis: position.cost_basis,
      unrealized_pl: position.unrealized_pl,
      unrealized_plpc: position.unrealized_plpc,
    }))
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching open positions from Alpaca:", error)
    return { success: false, error: (error as Error).message }
  }
}

const isOptionSymbol = (symbol?: string): boolean => {
  if (!symbol) return false
  return /^[A-Z]{1,6}\d{6}[CP]\d{8}$/.test(symbol)
}

const getOptionFills = async (): Promise<ActivityFill[]> => {
  const pageSize = 100
  let pageToken: string | undefined
  const fills: ActivityFill[] = []

  while (true) {
    const page = (await alpaca.getAccountActivities({
      activityTypes: "FILL",
      direction: "asc",
      pageSize,
      pageToken,
    })) as ActivityFill[]

    if (!Array.isArray(page) || page.length === 0) break

    fills.push(...page.filter((item) => isOptionSymbol(item.symbol)))

    if (page.length < pageSize) break
    pageToken = page[page.length - 1]?.id
    if (!pageToken) break
  }

  return fills.sort((a, b) => {
    const aTime = new Date(a.transaction_time || 0).getTime()
    const bTime = new Date(b.transaction_time || 0).getTime()
    return aTime - bTime
  })
}

const computeRealizedOptionPnL = (fills: ActivityFill[]): number => {
  const longLotsBySymbol = new Map<string, OpenLot[]>()
  const shortLotsBySymbol = new Map<string, OpenLot[]>()
  let realized = 0

  for (const fill of fills) {
    const symbol = fill.symbol
    if (!symbol) continue

    const side = String(fill.side || "").toLowerCase()
    const qty = Number(fill.qty || 0)
    const price = Number(fill.price || 0)

    if (!qty || !price || (side !== "buy" && side !== "sell")) continue

    const longLots = longLotsBySymbol.get(symbol) || []
    const shortLots = shortLotsBySymbol.get(symbol) || []

    if (side === "buy") {
      // Buy can close existing shorts first, then open longs.
      let remaining = qty
      while (remaining > 0 && shortLots.length > 0) {
        const lot = shortLots[0]
        const closeQty = Math.min(remaining, lot.qty)
        realized += (lot.price - price) * closeQty * 100
        lot.qty -= closeQty
        remaining -= closeQty
        if (lot.qty <= 1e-8) shortLots.shift()
      }
      if (remaining > 0) {
        longLots.push({ qty: remaining, price })
      }
    } else {
      // Sell can close existing longs first, then open shorts.
      let remaining = qty
      while (remaining > 0 && longLots.length > 0) {
        const lot = longLots[0]
        const closeQty = Math.min(remaining, lot.qty)
        realized += (price - lot.price) * closeQty * 100
        lot.qty -= closeQty
        remaining -= closeQty
        if (lot.qty <= 1e-8) longLots.shift()
      }
      if (remaining > 0) {
        shortLots.push({ qty: remaining, price })
      }
    }

    longLotsBySymbol.set(symbol, longLots)
    shortLotsBySymbol.set(symbol, shortLots)
  }

  return realized
}

export const fetchRealizedSpreadPnL = async (): Promise<Response<RealizedSpreadPnL>> => {
  try {
    console.log("Fetch realized spread P/L from Alpaca activities")
    const fills = await getOptionFills()
    const totalRealizedPL = computeRealizedOptionPnL(fills)
    return { success: true, data: { totalRealizedPL } }
  } catch (error) {
    console.error("Error fetching realized spread P/L:", error)
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
