"use client"

import { useMemo, type FC } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { useData } from "@/providers/data-provider"
import PortfolioSkeleton from "@/components/skeletons/portfolio-skeleton"
import { calculatePositions } from "./calculatePositions"
import HoldingsTable from "@/components/portfolio/table"
import Summary from "@/components/portfolio/summary"

const Page: FC = () => {
  const { portfolio, loading, prices } = useData()

  const calculations = useMemo(() => {
    const val = calculatePositions(portfolio, prices)
    console.log("calcuations", val)
    return val
  }, [portfolio, prices])

  if (loading.portfolio) {
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
      {/* Portfolio Summary */}
      <Summary data={calculations} />

      {/* Holdings Table */}
      <HoldingsTable data={calculations} />
    </>
  )
}

export default Page
