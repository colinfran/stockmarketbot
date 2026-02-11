import Alpaca from "@alpacahq/alpaca-trade-api"
import YahooFinance from "yahoo-finance2"

/**
 * The LLM model used for all AI requests.
 *
 * `xai/grok-4.1-fast-reasoning`:
 * - Latest high-speed variant in the Grok 4.1 series (released early 2026)
 * - Improved reasoning depth, tool usage, and agentic behavior over Grok-4
 * - Maintains fast inference while supporting very long context windows (~2M tokens)
 * - Strong multi-step analysis, structured JSON output, and real-time tool chaining
 * - More accurate on complex financial/market reasoning and sentiment synthesis
 *   compared to previous fast variants
 * - Still significantly more cost-efficient than the full non-fast Grok 4.1 reasoning model
 * - Recommended upgrade for scripts that need deeper thinking without large latency increase
 */

export const currentModel = "xai/grok-4.1-fast-reasoning"

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
