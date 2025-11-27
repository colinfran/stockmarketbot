"use client"

import { useMemo, type FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react"
import { useData } from "@/providers/data-provider"
import PortfolioSkeleton from "@/components/skeletons/portfolio-skeleton"
import { calculatePositions } from "./calculatePositions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

  const totalPLPercent =
    calculations.totalCost > 0 ? (calculations.totalProfitLoss / calculations.totalCost) * 100 : 0

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
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left py-3 px-2 sm:px-4 whitespace-nowrap">
                    Symbol
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    Shares
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    Avg Cost
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    Current Price
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    Total Value
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    P/L
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    P/L %
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {calculations.positions.map((position: any) => (
                  <TableRow
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    key={position.symbol}
                  >
                    <TableCell className="py-3 px-2 sm:px-4 font-semibold whitespace-nowrap">
                      {position.symbol}
                    </TableCell>

                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      {position.shares}
                    </TableCell>

                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      ${position.avgCost.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      ${position.currentPrice.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-right py-3 px-2 sm:px-4 font-medium whitespace-nowrap">
                      {position.totalValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    <TableCell
                      className={`text-right py-3 px-2 sm:px-4 font-medium whitespace-nowrap ${
                        position.profitLoss >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {position.profitLoss >= 0 ? "+" : ""}${position.profitLoss.toFixed(2)}
                    </TableCell>

                    <TableCell
                      className={`text-right py-3 px-2 sm:px-4 font-medium whitespace-nowrap ${
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
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Page
