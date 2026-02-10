"use client"

import PortfolioChart from "@/components/portfolio/chart"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { useData } from "@/providers/data-provider"
import { FC, useMemo } from "react"

type PortfolioChartData = {
  data: { date: string; value: number; invested: number }[]
  currentValue: number
  totalInvested: number
  changePercent: number
}

/**
 * Calculates shares held for a given symbol on a specific date
 * by summing up all filled orders on or before that date.
 */
const getSharesOnDate = (
  orders: { symbol: string; side: string; filled_qty: number; filled_at: string }[],
  symbol: string,
  date: Date,
): number => {
  let shares = 0
  for (const order of orders) {
    if (order.symbol !== symbol) continue
    const filledDate = new Date(order.filled_at)
    if (filledDate <= date) {
      const qty = Number(order.filled_qty)
      if (order.side === "buy") {
        shares += qty
      } else if (order.side === "sell") {
        shares -= qty
      }
    }
  }
  return shares
}

/**
 * Calculates total money invested (cost basis) on or before a specific date.
 * Buy orders add to the cost basis, sell orders subtract.
 */
const getInvestedOnDate = (
  orders: { side: string; filled_qty: number; filled_avg_price: number; filled_at: string }[],
  date: Date,
): number => {
  let invested = 0
  for (const order of orders) {
    const filledDate = new Date(order.filled_at)
    if (filledDate <= date) {
      const cost = Number(order.filled_qty) * Number(order.filled_avg_price)
      if (order.side === "buy") {
        invested += cost
      } else if (order.side === "sell") {
        invested -= cost
      }
    }
  }
  return invested
}

const Page: FC = () => {
  const { loading, calculations, currentPrices, priceHistory, portfolio } = useData()

  const portfolioData = useMemo<PortfolioChartData | null>(() => {
    if (!calculations) return null

    const symbols = calculations.positions.map((pos) => pos.symbol)

    // Build a map of symbol -> sorted historical price bars
    const symbolPriceData = symbols.reduce(
      (acc, symbol) => {
        const history = priceHistory[symbol]
        if (Array.isArray(history) && history.length > 0) {
          acc[symbol] = history
        }
        return acc
      },
      {} as Record<string, typeof priceHistory[string]>,
    )

    // Get all unique dates from the first symbol that has data
    const firstSymbolWithData = symbols.find((s) => symbolPriceData[s])
    if (!firstSymbolWithData) return null

    const dates = symbolPriceData[firstSymbolWithData].map((d) => d.date)

    const portfolioValueData: { date: string; value: number; invested: number }[] = []

    dates.forEach((date, index) => {
      const dateObj = new Date(date)
      // Set to end of day to include orders filled on this date
      dateObj.setHours(23, 59, 59, 999)

      let totalValue = 0

      symbols.forEach((symbol) => {
        // Calculate how many shares were held on this specific date
        const sharesOnDate = getSharesOnDate(portfolio, symbol, dateObj)

        if (sharesOnDate > 0) {
          const priceData = symbolPriceData[symbol]
          const priceAtDate = priceData?.[index]?.close || currentPrices[symbol] || 0
          totalValue += priceAtDate * sharesOnDate
        }
      })

      // Calculate total money invested up to this date
      const invested = getInvestedOnDate(portfolio, dateObj)

      portfolioValueData.push({
        date,
        value: Number(totalValue.toFixed(2)),
        invested: Number(invested.toFixed(2)),
      })
    })

    // Append today's data point using the live current value so the chart
    // line connects all the way to the displayed current value.
    const currentValue = calculations.totalValue
    const today = new Date()
    const todayInvested = getInvestedOnDate(portfolio, today)
    const lastDataPoint = portfolioValueData[portfolioValueData.length - 1]
    if (!lastDataPoint || Math.abs(lastDataPoint.value - currentValue) > 0.01) {
      portfolioValueData.push({
        date: today.toISOString(),
        value: Number(currentValue.toFixed(2)),
        invested: Number(todayInvested.toFixed(2)),
      })
    }

    const firstValue = portfolioValueData[0]?.value || 0
    const portfolioChangePercent =
      firstValue > 0 ? ((currentValue - firstValue) / firstValue) * 100 : 0

    return {
      data: portfolioValueData,
      currentValue,
      totalInvested: todayInvested,
      changePercent: portfolioChangePercent,
    }
  }, [calculations, priceHistory, currentPrices, portfolio])

  if (loading.portfolio || !calculations || !portfolioData) {
    return <ChartSkeleton />
  }

  return (
    <PortfolioChart
      changePercent={portfolioData.changePercent}
      currentValue={portfolioData.currentValue}
      totalInvested={portfolioData.totalInvested}
      data={portfolioData.data}
    />
  )
}

export default Page
