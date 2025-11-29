import { PortfolioPosition } from "@/lib/utils"
import { useData } from "@/providers/data-provider"
import { TrendingDown, TrendingUp } from "lucide-react"
import { FC } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Card, CardContent } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import StockChart from "./stock-chart"
import PurchaseHistory from "./purchase-history"

type InfoType = {
  position: PortfolioPosition
}

const Info: FC<InfoType> = ({ position }) => {
  const { priceHistory, portfolio } = useData()
  const chartData = priceHistory[position.symbol].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const priceChange = position.currentPrice - chartData[0].close
  const priceChangePercent = (priceChange / chartData[0].close) * 100
  const stockOrders = portfolio.filter((item) => item.symbol === position.symbol)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <ScrollArea
      className={`${isDesktop ? "h-[calc(90vh-8rem)]" : "h-[calc(90vh-12rem)] p-8"} w-full`}
    >
      {/* Current Price Section */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Current Price</p>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-bold">${position.currentPrice.toFixed(2)}</p>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {priceChange >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)} ({priceChange >= 0 ? "+" : ""}
            {priceChangePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Position Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Shares Owned</p>
          <p className="text-xl font-semibold">{position.shares}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Average Cost</p>
          <p className="text-xl font-semibold">${position.avgCost.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-xl font-semibold">
            $
            {position.totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total P/L</p>
          <p
            className={`text-xl font-semibold ${position.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {position.profitLoss >= 0 ? "+" : ""}${position.profitLoss.toFixed(2)}
          </p>
          <p
            className={`text-sm ${position.profitLossPercent >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {position.profitLossPercent >= 0 ? "+" : ""}
            {position.profitLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <StockChart chartData={chartData}/>
      {/* Purchase History */}
      <PurchaseHistory stockOrders={stockOrders} />
    </ScrollArea>
  )
}

export default Info
