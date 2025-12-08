import { MarketReportSchema } from "../ai-service/schema"
import { AlpacaOrder, Response } from "../../types"
import { alpaca } from "../../index"

/**
 * Executes purchase orders based on the latest AI-generated market report.
 * @description Takes a MarketReportSchema object containing stock recommendations,
 * validates that allocations sum to 100%, and places fractional buy orders through the Alpaca API.
 * Logs progress at each step and returns a Response object with all submitted orders or an error.
 *
 * Steps:
 * 1. Set test equity amount (currently $100 for simulation purposes).
 * 2. Validate that allocation percentages total 100.
 * 3. Loop through each recommendation and calculate the dollar allocation.
 * 4. Place fractional buy orders via Alpaca for each ticker.
 *
 * @function purchase
 * @param {MarketReportSchema} latestReport The latest market report containing stock recommendations.
 * @returns {Promise<Response<AlpacaOrder[]>>} A promise resolving to a Response object.
 * If successful, `success` is true and `data` contains an array of submitted AlpacaOrder objects.
 * If there is an error, `success` is false and `error` contains the error message.
 */

export async function purchase(latestReport: MarketReportSchema): Promise<Response<AlpacaOrder[]>> {
  try {
    // Precheck step to verify that the alpaca trading environment is warm
    // dont purchase any stocks until market is warm, otherwise will get incorrect order status and values.
    let ready = false
    while (!ready) {
      const clock = await alpaca.getClock()
      if (clock.is_open) {
        ready = true
      } else {
        await new Promise((r) => setTimeout(r, 1000))
      }
    }

    // STEP 1 — set equity amount
    // we are only ever testing with $100
    const equity = 100
    console.log("Account equity:", equity)
    const allocations = latestReport.recommendations.map((item) => ({
      ticker: item.ticker,
      percent: item.allocation,
    }))
    // STEP 2 — validate input
    const totalPercent = allocations.reduce((sum, x) => sum + x.percent, 0)
    if (totalPercent !== 100) {
      throw new Error("Allocation percentages must total 100")
    }
    // STEP 3 — loop through allocations
    const purchases = []
    for (const item of allocations) {
      const { ticker, percent } = item
      // Convert percent → dollar amount
      const allocationAmount = equity * (percent / 100)
      console.log(`Buying ~$${allocationAmount.toFixed(2)} of ${ticker}`)
      // STEP 4 — fractional (notional) buy order
      const order = (await alpaca.createOrder({
        symbol: ticker,
        notional: allocationAmount,
        side: "buy",
        type: "market",
        time_in_force: "day",
      })) as AlpacaOrder
      console.log("Order submitted:", order.id)
      purchases.push(order)
    }
    return {
      success: true,
      data: purchases,
    }
  } catch (err) {
    console.error("Error placing orders:", err)
    return {
      success: false,
      error: `${err}`,
    }
  }
}
