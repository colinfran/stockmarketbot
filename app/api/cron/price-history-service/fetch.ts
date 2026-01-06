import { db } from "@/lib/db"
import { yahooFinance } from "../.."
import { priceCache } from "@/lib/db/schema"
import { Response } from "../../types"
import { HistoricalHistoryResult } from "yahoo-finance2/modules/historical"

/**
 * Updates the `priceCache` table for a list of tickers by fetching historical daily bars
 * from Yahoo Finance and upserting them into the database.
 *
 * @description
 * - Deduplicates the provided `tickers` list before processing.
 * - For each ticker: fetches daily bars from 2025-11-21 up to now and upserts the result into `priceCache` (sets `fetched_at` to now).
 * - Fetches run in parallel and the function waits for all per-ticker operations to finish using `Promise.all`.
 * - Uses `fetchHistoricalWithRetry` to handle transient HTTP rate-limits (HTTP 429 / "Too Many Requests").
 *   Default retry policy: up to **5 attempts**, exponential backoff starting at **60s** (baseDelay * 2^retry)
 *   plus up to **2s** of random jitter. If retries are exhausted, the error is logged and that ticker's update is skipped.
 * - Intended to be executed by a cron job (e.g., once per day) to refresh cached historical data.
 * - Errors during fetch/upsert for individual tickers are logged and do not prevent other tickers from being processed.
 *
 * @function updatePriceHistoryCache
 * @param {string[]} tickers - Array of stock tickers to update in the cache.
 * @returns {Promise<Response<undefined>>} Returns `{ success: true }` when all per-ticker updates have completed.
 */

const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRateLimitError = (err: any): boolean => {
  return (
    err?.statusCode === 429 ||
    (typeof err?.message === "string" && err.message.includes("Too Many Requests")) ||
    (err?.name === "HTTPError" && err?.statusCode === 429)
  )
}

const fetchHistoricalWithRetry = async (
  ticker: string,
  attempts = 5,
  baseDelay = 60_000,
): Promise<HistoricalHistoryResult> => {
  for (let i = 0; i < attempts; i++) {
    try {
      console.log(`Fetching historical data for ${ticker} (attempt ${i + 1}/${attempts})`)
      return await yahooFinance.historical(ticker, {
        period1: new Date("2025-11-21"),
        period2: new Date(),
        interval: "1d",
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (isRateLimitError(err) && i < attempts - 1) {
        const delay = baseDelay * Math.pow(2, i) + Math.floor(Math.random() * 2000)
        console.warn(
          `Rate limited when fetching ${ticker}. Retrying in ${Math.round(delay / 1000)}s (attempt ${i + 1}/${attempts})`,
        )
        await sleep(delay)
        continue
      }
      throw err
    }
  }
  throw new Error(`Failed to fetch historical data for ${ticker} after ${attempts} attempts`)
}

export const updatePriceHistoryCache = async (tickers: string[]): Promise<Response<undefined>> => {
  const uniqueTickers = [...new Set(tickers)]
  // Ensure we wait for all per-ticker fetch/upsert operations to finish before returning
  await Promise.all(
    uniqueTickers.map(async (ticker) => {
      try {
        const fetched = await fetchHistoricalWithRetry(ticker)
        await db
          .insert(priceCache)
          .values({ ticker, data: fetched, fetched_at: new Date() })
          .onConflictDoUpdate({
            target: priceCache.ticker,
            set: { data: fetched, fetched_at: new Date() },
          })
        console.log(`Updated price cache for ${ticker} in db`)
      } catch (error) {
        console.error(`Failed to fetch or insert price for ${ticker}`)
        console.error(error)
      }
    }),
  )

  return { success: true }
}
