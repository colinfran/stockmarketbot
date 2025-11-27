import Alpaca from "@alpacahq/alpaca-trade-api"

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
