import { Prices, Response } from "../types"

function parsePrice(value: string): number {
  // "$180.26" → 180.26
  return Number(value.replace(/[$,]/g, ""))
}

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
