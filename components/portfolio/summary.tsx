import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { PortfolioPosition } from "@/app/(routes)/portfolio/calculatePositions"

type SummaryType = {
  data: {
    totalCost: number
    totalProfitLoss: number
    totalValue: number
    positions: PortfolioPosition[]
  }
}

const Summary: FC<SummaryType> = ({ data }) => {
  const totalPLPercent = data.totalCost > 0 ? (data.totalProfitLoss / data.totalCost) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {data.totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cost basis: $
            {data.totalCost.toLocaleString("en-US", {
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
            className={`text-2xl font-bold ${data.totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {data.totalProfitLoss >= 0 ? "+" : ""}$
            {data.totalProfitLoss.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${data.totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {data.totalProfitLoss >= 0 ? (
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
          <div className="text-2xl font-bold">{data.positions.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Active holdings</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Summary
