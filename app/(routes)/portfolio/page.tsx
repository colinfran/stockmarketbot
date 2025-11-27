"use client"

import { useEffect, useMemo, type FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react"
import { useData } from "@/providers/data-provider"
import PortfolioSkeleton from "@/components/skeletons/portfolio-skeleton"
import { calculatePositions } from "./calculatePositions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

const Page: FC = () => {
  const { portfolio, loading, fetchPortfolio, prices } = useData()

  useEffect(() => {
    if (!portfolio.length) fetchPortfolio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio])

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

  const totalPLPercent = calculations.totalCost > 0 ? (calculations.totalProfitLoss / calculations.totalCost) * 100 : 0

  return (
    <>
      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {calculations.totalValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cost basis: $
              {calculations.totalCost.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${calculations.totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {calculations.totalProfitLoss >= 0 ? "+" : ""}$
              {calculations.totalProfitLoss.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${calculations.totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {calculations.totalProfitLoss >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {totalPLPercent >= 0 ? "+" : ""}
              {totalPLPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculations.positions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active holdings</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
  <CardHeader>
    <CardTitle>Holdings</CardTitle>
    <CardDescription>Detailed breakdown of your stock positions</CardDescription>
  </CardHeader>

  {/* Scroll wrapper (shadcn recommended) */}
  <CardContent className="w-full overflow-x-auto">
    <ScrollArea className="min-screen-w">
    <Table className="min-w-max">
      <TableHeader>
        <TableRow className="border-b border-border">
          <TableHead className="text-left py-3 px-2 sm:px-4">
            Symbol
          </TableHead>
          <TableHead className="text-right py-3 px-2 sm:px-4">
            Shares
          </TableHead>
          <TableHead className="text-right py-3 px-2 sm:px-4">
            Avg Cost
          </TableHead>
          <TableHead className="text-right py-3 px-2 sm:px-4">
            Current Price
          </TableHead>
          <TableHead className="text-right py-3 px-2 sm:px-4">
            Total Value
          </TableHead>
          <TableHead className="text-right py-3 px-2 sm:px-4">
            P/L
          </TableHead>
          <TableHead className="text-right py-3 px-2 sm:px-4">
            P/L %
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {calculations.positions.map((position) => (
          <TableRow
            key={position.symbol}
            className="border-b border-border hover:bg-muted/50 transition-colors"
          >
            {/* Symbol should stay nowrap */}
            <TableCell className="py-3 px-2 sm:px-4 font-semibold whitespace-nowrap">
              {position.symbol}
            </TableCell>

            <TableCell className="text-right py-3 px-2 sm:px-4">
              {position.shares}
            </TableCell>

            <TableCell className="text-right py-3 px-2 sm:px-4">
              ${position.avgCost.toFixed(2)}
            </TableCell>

            <TableCell className="text-right py-3 px-2 sm:px-4">
              ${position.currentPrice.toFixed(2)}
            </TableCell>

            <TableCell className="text-right py-3 px-2 sm:px-4 font-medium">
              {position.totalValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>

            <TableCell
              className={`text-right py-3 px-2 sm:px-4 font-medium ${
                position.profitLoss >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {position.profitLoss >= 0 ? "+" : ""}
              ${position.profitLoss.toFixed(2)}
            </TableCell>

            <TableCell
              className={`text-right py-3 px-2 sm:px-4 font-medium ${
                position.profitLossPercent >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              <div className="flex items-center justify-end gap-1">
                {position.profitLossPercent >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {position.profitLossPercent >= 0 ? "+" : ""}
                {position.profitLossPercent.toFixed(2)}%
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </ScrollArea>
  </CardContent>
</Card>

    </>
  )
}

export default Page
