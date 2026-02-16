import { AlpacaOrder, AlpacaPosition, Prices } from "@/app/api/types"
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

type ParsedOptionSymbol = {
  underlying: string
  expiration: string
  optionType: "call" | "put"
  strike: number
}

type OpenOptionLeg = {
  symbol: string
  side: "LONG" | "SHORT"
  qty: number
  strike: number
  underlying: string
  expiration: string
  optionType: "call" | "put"
  unrealizedPLPerContract: number
  costBasisPerContract: number
  marketValuePerContract: number
}

export type OpenSpread = {
  key: string
  underlying: string
  expiration: string
  optionType: "call" | "put"
  contracts: number
  longStrike: number
  shortStrike: number
  longSymbol: string
  shortSymbol: string
  costBasis: number
  marketValue: number
  unrealizedPL: number
  unrealizedPLPct: number
}

const parseOccOptionSymbol = (symbol: string): ParsedOptionSymbol | null => {
  const match = /^([A-Z]{1,6})(\d{2})(\d{2})(\d{2})([CP])(\d{8})$/.exec(symbol.trim())
  if (!match) return null

  const [, underlying, yy, mm, dd, cpFlag, strikeRaw] = match
  return {
    underlying,
    expiration: `20${yy}-${mm}-${dd}`,
    optionType: cpFlag === "C" ? "call" : "put",
    strike: Number(strikeRaw) / 1000,
  }
}

export const buildOpenSpreads = (openPositions: AlpacaPosition[]): OpenSpread[] => {
  const optionSymbolRegex = /^[A-Z]{1,6}\d{6}[CP]\d{8}$/

  const optionLegs: OpenOptionLeg[] = openPositions
    .filter((position) => optionSymbolRegex.test(position.symbol))
    .map((position) => {
      const parsed = parseOccOptionSymbol(position.symbol)
      if (!parsed) return null

      const qty = Math.abs(Number(position.qty || 0))
      if (!Number.isFinite(qty) || qty <= 0) return null

      const unrealizedPL = Number(position.unrealized_pl || 0)
      const costBasis = Number(position.cost_basis || 0)
      const marketValue = Number(position.market_value || 0)

      return {
        symbol: position.symbol,
        side: position.side?.toLowerCase() === "short" ? "SHORT" : "LONG",
        qty,
        strike: parsed.strike,
        underlying: parsed.underlying,
        expiration: parsed.expiration,
        optionType: parsed.optionType,
        unrealizedPLPerContract: unrealizedPL / qty,
        costBasisPerContract: costBasis / qty,
        marketValuePerContract: marketValue / qty,
      } as OpenOptionLeg
    })
    .filter((leg): leg is OpenOptionLeg => Boolean(leg))

  const groups = new Map<string, OpenOptionLeg[]>()
  optionLegs.forEach((leg) => {
    const key = `${leg.underlying}|${leg.expiration}|${leg.optionType}`
    const existing = groups.get(key) || []
    existing.push(leg)
    groups.set(key, existing)
  })

  const spreads: OpenSpread[] = []

  for (const [groupKey, legs] of groups.entries()) {
    const longs = legs
      .filter((l) => l.side === "LONG")
      .map((l) => ({ ...l, remainingQty: l.qty }))
      .sort((a, b) => (a.optionType === "call" ? a.strike - b.strike : b.strike - a.strike))
    const shorts = legs
      .filter((l) => l.side === "SHORT")
      .map((l) => ({ ...l, remainingQty: l.qty }))
      .sort((a, b) => (a.optionType === "call" ? a.strike - b.strike : b.strike - a.strike))

    for (const longLeg of longs) {
      while (longLeg.remainingQty > 0) {
        const shortIdx = shorts.findIndex((shortLeg) => {
          if (shortLeg.remainingQty <= 0) return false
          if (longLeg.optionType === "call") {
            return shortLeg.strike > longLeg.strike
          }
          return shortLeg.strike < longLeg.strike
        })
        if (shortIdx < 0) break

        const shortLeg = shorts[shortIdx]
        const matchedQty = Math.min(longLeg.remainingQty, shortLeg.remainingQty)
        if (matchedQty <= 0) break

        const costBasis =
          matchedQty * (longLeg.costBasisPerContract + shortLeg.costBasisPerContract)
        const marketValue =
          matchedQty * (longLeg.marketValuePerContract + shortLeg.marketValuePerContract)
        const unrealizedPL =
          matchedQty * (longLeg.unrealizedPLPerContract + shortLeg.unrealizedPLPerContract)
        const unrealizedPLPct = costBasis !== 0 ? (unrealizedPL / Math.abs(costBasis)) * 100 : 0

        spreads.push({
          key: `${groupKey}|${longLeg.symbol}|${shortLeg.symbol}|${matchedQty}`,
          underlying: longLeg.underlying,
          expiration: longLeg.expiration,
          optionType: longLeg.optionType,
          contracts: matchedQty,
          longStrike: longLeg.strike,
          shortStrike: shortLeg.strike,
          longSymbol: longLeg.symbol,
          shortSymbol: shortLeg.symbol,
          costBasis,
          marketValue,
          unrealizedPL,
          unrealizedPLPct,
        })

        longLeg.remainingQty -= matchedQty
        shortLeg.remainingQty -= matchedQty
      }
    }
  }

  return spreads
}

export const calculatePositions = (ordersList: AlpacaOrder[], prices: Prices): CalculateType => {
  // Aggregate orders by symbol
  const positionMap = new Map<string, { shares: number; totalCost: number }>()

  ordersList.forEach((order) => {
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
