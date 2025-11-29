import { AlpacaOrder, Prices } from "@/app/api/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

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
  positions: PortfolioPosition[]
  totalValue: number
  totalCost: number
  totalProfitLoss: number
}

export const calculatePositions = (ordersList: AlpacaOrder[], prices: Prices): CalculateType => {
  // Aggregate orders by symbol
  const positionMap = new Map<string, { shares: number; totalCost: number }>()

  ordersList
    .forEach((order) => {
      const existing = positionMap.get(order.symbol) || { shares: 0, totalCost: 0 }

      const filledQty = Number(order.filled_qty)
      const filledAvg = Number(order.filled_avg_price)

      if (order.side === "buy") {
        positionMap.set(order.symbol, {
          shares: existing.shares + filledQty,
          totalCost: existing.totalCost + filledQty * filledAvg,
        })
      } else if (order.side === "sell") {
        positionMap.set(order.symbol, {
          shares: existing.shares - filledQty,
          totalCost: existing.totalCost - filledQty * filledAvg,
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
