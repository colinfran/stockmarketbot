import { AlpacaOrder, Prices } from "../../api/types"

export type PortfolioPosition = {
  symbol: string
  shares: number
  avgCost: number
  currentPrice: number
  totalValue: number
  totalCost: number
  profitLoss: number
  profitLossPercent: number
}

export type CalculateType = {
  positions: PortfolioPosition[],
  totalValue: number,
  totalCost: number,
  totalProfitLoss: number,
}

export const calculatePositions = (ordersList: AlpacaOrder[], prices: Prices): CalculateType => {
  // Aggregate orders by symbol
  const positionMap = new Map<string, { shares: number; totalCost: number }>()

  ordersList
    .filter((order) => order.status === "filled")
    .forEach((order) => {
      const existing = positionMap.get(order.symbol) || { shares: 0, totalCost: 0 }

      if (order.side === "buy") {
        positionMap.set(order.symbol, {
          shares: existing.shares + order.filled_qty,
          totalCost: existing.totalCost + order.filled_qty * order.filled_avg_price,
        })
      } else if (order.side === "sell") {
        positionMap.set(order.symbol, {
          shares: existing.shares - order.filled_qty,
          totalCost: existing.totalCost - order.filled_qty * order.filled_avg_price,
        })
      }
    })

  // Calculate position metrics
  const calculatedPositions: PortfolioPosition[] = []
  let portfolioValue = 0
  let portfolioCost = 0
  let portfolioPL = 0

  positionMap.forEach((position, symbol) => {
    if (position.shares > 0) {
      const avgCost = position.totalCost / position.shares
      const currentPrice = prices[symbol] || avgCost
      const totalValue = position.shares * currentPrice
      const totalCost = position.totalCost
      const profitLoss = totalValue - totalCost
      const profitLossPercent = (profitLoss / totalCost) * 100

      calculatedPositions.push({
        symbol,
        shares: position.shares,
        avgCost,
        currentPrice,
        totalValue,
        totalCost,
        profitLoss,
        profitLossPercent,
      })

      portfolioValue += totalValue
      portfolioCost += totalCost
      portfolioPL += profitLoss
    }
  })
  return {
    positions: calculatedPositions.sort((a, b) => b.totalValue - a.totalValue),
    totalValue: portfolioValue,
    totalCost: portfolioCost,
    totalProfitLoss: portfolioPL,
  }
}
