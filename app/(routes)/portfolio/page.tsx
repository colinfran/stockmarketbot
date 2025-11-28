"use client"

import { type FC } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { useData } from "@/providers/data-provider"
import PortfolioSkeleton from "@/components/skeletons/portfolio-skeleton"
import HoldingsTable from "@/components/portfolio/table"
import Summary from "@/components/portfolio/summary"

const Page: FC = () => {
  const { portfolio, loading, calculations } = useData()

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
      {/* Portfolio Summary */}
      <Summary data={calculations!} />

      {/* Holdings Table */}
      <HoldingsTable data={calculations!} />
    </>
  )
}

export default Page
