"use client"

import PortfolioChart from "@/components/portfolio/chart"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { useData } from "@/providers/data-provider"
import { FC } from "react"

type PortfolioChartData = {
  data: { date: string; value: number }[]
  currentValue: number
  changePercent: number
}

const Page: FC = () => {
  const { loading, calculations, currentPrices, priceHistory } = useData()

  if (loading.portfolio || !calculations) {
    return <ChartSkeleton />
  }

  const symbols = calculations.positions.map((pos) => pos.symbol)

  const chartData = symbols.map((symbol) => {
    const position = calculations.positions.find((pos) => pos.symbol === symbol)
    const currentPrice = position?.currentPrice || currentPrices[symbol] || 100
    const historicalData = priceHistory[symbol] //(symbol, currentPrice, 30)
    const firstPrice = historicalData[0].close
    const changePercent = ((currentPrice - firstPrice) / firstPrice) * 100

    return {
      symbol,
      data: historicalData,
      currentPrice,
      changePercent,
    }
  })

  const portfolioValueData: { date: string; value: number }[] = []
  const dates = chartData[0]?.data.map((d) => d.date) || []

  dates.forEach((date, index) => {
    let totalValue = 0
    chartData.forEach((stock) => {
      const position = calculations.positions.find((pos) => pos.symbol === stock.symbol)
      if (position) {
        const priceAtDate = stock.data[index]?.close || stock.currentPrice
        totalValue += priceAtDate * position.shares
      }
    })
    portfolioValueData.push({ date, value: Number(totalValue.toFixed(2)) })
  })

  const firstValue = portfolioValueData[0]?.value || 0
  const currentValue = calculations.totalValue
  const portfolioChangePercent =
    firstValue > 0 ? ((currentValue - firstValue) / firstValue) * 100 : 0

  const portfolioData: PortfolioChartData = {
    data: portfolioValueData,
    currentValue,
    changePercent: portfolioChangePercent,
  }

  if (!portfolioData) {
    return null
  }

  return (
    <PortfolioChart
      changePercent={portfolioData.changePercent}
      currentValue={portfolioData.currentValue}
      data={portfolioData.data}
    />
  )
}

export default Page
