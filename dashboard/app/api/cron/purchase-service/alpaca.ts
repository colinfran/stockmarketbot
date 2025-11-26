import Alpaca from "@alpacahq/alpaca-trade-api"
import { MarketReportSchema } from "../ai-service/schema"

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_SECRET_KEY,
  paper: true,
  usePolygon: false,
})

type Response = {
  success: boolean
  data?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: string
}

export async function purchase(latestReport: MarketReportSchema): Promise<Response> {
  try {
    // STEP 1 — get account info
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
      const order = await alpaca.createOrder({
        symbol: ticker,
        notional: allocationAmount, // 👈 fractional trade
        side: "buy",
        type: "market",
        time_in_force: "day",
      })

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
