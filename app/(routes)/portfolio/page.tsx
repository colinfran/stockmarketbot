"use client"

import { type FC } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { useData } from "@/providers/data-provider"
import PortfolioSkeleton from "@/components/skeletons/portfolio-skeleton"
import HoldingsTable from "@/components/portfolio/table"
import RecentTrades from "@/components/portfolio/recent-trades"
import OpenSpreadPositions from "@/components/portfolio/open-spread-positions"

const Page: FC = () => {
  const { portfolio, openPositions, realizedSpreadPnL, loading, calculations } = useData()

  if (loading.portfolio && calculations) {
    return <PortfolioSkeleton />
  }

  if (portfolio.length === 0 && !loading.portfolio) {
    return (
      <Card>
        <CardHeader className="text-center">No Holdings. Check back later.</CardHeader>
      </Card>
    )
  }

  return (
    <>
      {/* Holdings Table */}
      <HoldingsTable data={calculations!} />

      {/* Recent Buys/Sells */}
      <RecentTrades orders={portfolio} />

      {/* Open Spread Positions */}
      <OpenSpreadPositions openPositions={openPositions} realizedSpreadPnL={realizedSpreadPnL} />
    </>
  )
}

export default Page
