import { MarketReportSchema } from "../ai-service/schema"
import { AlpacaOrder, Response } from "../../types"
import { alpaca } from "../../alpaca"

export async function purchase(latestReport: MarketReportSchema): Promise<Response<AlpacaOrder[]>> {
  try {
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
