import { Prices, Response } from "../types"

/**
 * Parse a localized price string into a numeric value.
 *
 * This helper removes common currency formatting characters (dollar sign and thousands separators)
 * and converts the remaining string to a number.
 *
 * Example:
 * - "$180.26" -> 180.26
 *
 * @param value - A price string which may include a currency symbol (e.g. "$") and commas.
 * @returns The numeric value parsed from the string. If the input cannot be parsed as a valid number,
 *          Number(...) returns NaN.
 */
function parsePrice(value: string): number {
  // "$180.26" → 180.26
  return Number(value.replace(/[$,]/g, ""))
}
 
/**
 * Build a price lookup map from an array of rows returned by the screener API.
 *
 * The function:
 * - Iterates through the provided rows,
 * - Extracts `symbol` and `lastsale` from each row,
 * - Skips rows that are missing either `symbol` or `lastsale`,
 * - Converts `lastsale` to a numeric value via parsePrice and assigns it to the output map keyed by `symbol`.
 *
 * Notes:
 * - Rows missing a `symbol` or `lastsale` are ignored.
 * - If `lastsale` cannot be parsed into a valid number, the resulting value in the map will be NaN.
 *
 * @param rows - The raw array of row objects returned by the screener API. Each row is expected to contain at least `symbol` and `lastsale`.
 * @returns A Prices object mapping stock symbols to numeric last-sale prices.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 * Fetch stock prices for NASDAQ and NYSE and return a combined price mapping.
 *
 * The function:
 * 1. Fetches listings for NASDAQ and NYSE from the Nasdaq screener endpoints.
 * 2. Parses responses as JSON and extracts rows from `data.table.rows`.
 * 3. Concatenates both exchanges' rows and converts them into a Prices map using buildPriceMap.
 * 4. Returns a Response<Prices> object indicating success and the resulting price map, or failure and an error message.
 *
 * Behavior & notes:
 * - Network errors, non-JSON responses, or other runtime errors are caught; the function returns a failure Response with the error message.
 * - The function logs a starting message and logs any caught errors to the console.
 * - The resulting map may include NaN values for symbols whose `lastsale` strings could not be parsed as numbers.
 *
 * @returns A Promise resolving to Response<Prices>. On success, `data` contains the symbol → price mapping. On failure, `error` contains the error message.
 */
export const fetchPrices = async (): Promise<Response<Prices>> => {
  try {
    console.log("Fetching prices from ")
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
    console.error("Error fetching reports from database:", error)
    return { success: false, error: (error as Error).message }
  }
}
