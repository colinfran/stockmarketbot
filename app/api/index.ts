import Alpaca from "@alpacahq/alpaca-trade-api"
import YahooFinance from "yahoo-finance2"

/**
 * The LLM model used for all AI requests.
 *
 * `xai/grok-4-fast-reasoning`:
 * - High-speed variant of Grok-4 with enhanced reasoning ability
 * - Supports long context windows (up to ~2M tokens)
 * - Good for multi-step reasoning, analysis, and structured output
 * - More cost-efficient than the full Grok-4 reasoning model
 */

export const currentModel = "xai/grok-4-fast-reasoning"

/**
 * Yahoo Finance client instance.
 * @description Configured to suppress specific warnings (e.g., "ripHistorical") while fetching data.
 */
export const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] })

/**
 * Configured Alpaca client instance for trading operations.
 * @description This client is used to interact with the Alpaca API for
 * placing fractional stock orders, retrieving account information, and other
 * trading-related operations. It is configured to use a paper trading account
 * for testing purposes (`paper: true`) and does not use Polygon data (`usePolygon: false`).
 *
 * API keys are read from environment variables:
 * - `ALPACA_API_KEY`
 * - `ALPACA_SECRET_KEY`
 *
 * @constant {Alpaca} alpaca
 */

export const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_SECRET_KEY,
  paper: true,
  usePolygon: false,
})
