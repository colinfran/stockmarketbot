/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db"
import { tradeOrders } from "@/lib/db/schema"
import { AlpacaOrder, Prices, Response } from "../types"

/**
 * Converts a string price into a number.
 * @description Takes a string like "$180.26" and removes symbols/commas, returning it as a numeric value.
 * @function parsePrice
 * @param {string} value The price string to parse.
 * @returns {number} The numeric representation of the price.
 */
function parsePrice(value: string): number {
  return Number(value.replace(/[$,]/g, ""))
}

/**
 * Builds a mapping of stock symbols to numeric prices from raw API rows.
 * @description Iterates over an array of stock rows, parses the last sale price, and creates a Prices object.
 * Skips any row missing the `symbol` or `lastsale`.
 * @function buildPriceMap
 * @param {any[]} rows Array of stock row objects from the API.
 * @returns {Prices} An object mapping stock symbols to their numeric last sale prices.
 */
function buildPriceMap(rows: any[]): Prices {
  const prices: Prices = {}
  for (const row of rows) {
    const symbol = row.symbol
    const lastsale = row.lastsale
    if (!symbol || !lastsale) continue
    prices[symbol] = parsePrice(lastsale)
  }
  return prices
}

/**
 * Fetches the latest stock prices from NASDAQ and NYSE.
 * @description Makes HTTP requests to the NASDAQ API to retrieve stock listings from both NASDAQ and NYSE,
 * parses the last sale prices, and returns a mapping of stock symbols to numeric prices.
 * Returns a Response object containing either the prices data or an error message.
 * @function fetchPrices
 * @returns {Promise<Response<Prices>>} A promise resolving to a Response object.
 * If successful, `success` is true and `data` contains a Prices object mapping symbols to their numeric prices.
 * If there is an error, `success` is false and `error` contains the error message.
 */
export const fetchPrices = async (): Promise<Response<Prices>> => {
  try {
    console.log("Fetching prices from NASDAQ and NYSE")
    const nasdaq = await fetch("https://api.nasdaq.com/api/screener/stocks?exchange=NASDAQ").then(
      (r) => r.json(),
    )
    const nyse = await fetch("https://api.nasdaq.com/api/screener/stocks?exchange=NYSE").then((r) =>
      r.json(),
    )
    const nasdaqRows = nasdaq.data.table.rows
    const nyseRows = nyse.data.table.rows
    const allRows = [...nasdaqRows, ...nyseRows]
    const prices = buildPriceMap(allRows)
    return { success: true, data: prices }
  } catch (error) {
    console.error("Error fetching stock prices:", error)
    return { success: false, error: (error as Error).message }
  }
}

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
  console.log("Getting all trade orders from the database")
  try {
    const data = await db.select().from(tradeOrders)
    console.log("Successfully fetched trade orders from the database")
    return { success: true, data: data as unknown as AlpacaOrder[] }
  } catch (error) {
    console.error("Error fetching trade orders from the database:", error)
    return { success: false, error: (error as Error).message }
  }
}
