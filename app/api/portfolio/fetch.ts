import { db } from "@/lib/db"
import { tradeOrders } from "@/lib/db/schema"
import { AlpacaOrder, Response } from "../types"
import YahooFinance from "yahoo-finance2"
import { HistoricalHistoryResult } from "yahoo-finance2/modules/historical"

/**
 * Fetches all trade orders from the database.
 * @description Uses the database client to select all entries from the tradeOrders table.
 * Returns a Response object containing either the list of trade orders or an error message.
 * @function fetchAllTradeOrders
 * @returns {Promise<Response<AlpacaOrder[]>>} A promise resolving to a Response object.
 * If successful, `success` is true and `data` contains an array of AlpacaOrder objects.
 * If there is an error, `success` is false and `error` contains the error message.
 */

export const fetchAllTradeOrders = async (): Promise<Response<AlpacaOrder[]>> => {
  console.log("Get all tradeOrders from database")
  try {
    const data = await db.select().from(tradeOrders)
    console.log("Successfully fetched tradeOrders from database")
    return { success: true, data: data as unknown as AlpacaOrder[] }
  } catch (error) {
    console.error("Error fetching tradeOrders from database:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] })

export type PriceHistoryType = {
  [k: string]: HistoricalHistoryResult
}

const getPricesSince = async (tickers: string[]): Promise<PriceHistoryType> => {
  // remove duplicates
  const uniqueTickers = [...new Set(tickers)]
  // create requests in parallel
  const requests = uniqueTickers.map((ticker) =>
    yahooFinance.historical(ticker, {
      period1: new Date("2025-11-25"),
      period2: new Date(),
      interval: "1d",
    }),
  )
  const results = await Promise.all(requests)
  // shape the result as: { TICKER: historicalBars[] }
  return Object.fromEntries(uniqueTickers.map((ticker, index) => [ticker, results[index]]))
}

export const fetchPriceHistory = async (list: string[]): Promise<Response<PriceHistoryType>> => {
  try {
    const output = await getPricesSince(list)
    return { success: true, data: output }
  } catch (error) {
    console.error("Error fetching stock prices:", error)
    return { success: false, error: (error as Error).message }
  }
}
