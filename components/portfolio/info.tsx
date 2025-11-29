import { PortfolioPosition } from "@/lib/utils"
import { useData } from "@/providers/data-provider"
import { TrendingDown, TrendingUp } from "lucide-react"
import { FC } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Card, CardContent } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"

type InfoType = {
  position: PortfolioPosition
}

const Info: FC<InfoType> = ({ position }) => {
  const { priceHistory } = useData()
  const chartData = priceHistory[position.symbol]
  const priceChange = position.currentPrice - chartData[0].close
  const priceChangePercent = (priceChange / chartData[0].close) * 100
  return (
    <ScrollArea className="h-[calc(90vh-8rem)]">
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
      <div className="pt-4">
        <Card className="border-2 w-full">
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">30-Day Price History</p>
            <ChartContainer
              className="h-[300px] w-full"
              config={{
                value: {
                  label: "Portfolio Value",
                  color: "red",
                },
              }}
            >
              <ResponsiveContainer height={300} width="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
                  <XAxis
                    className="text-xs"
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    }}
                  />
                  <YAxis
                    className="text-xs"
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]}
                        labelFormatter={(value) => {
                          const date = new Date(value)
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        }}
                      />
                    }
                  />
                  <Line
                    activeDot={{ r: 4 }}
                    dataKey="value"
                    dot={false}
                    stroke="currentColor"
                    strokeWidth={3}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

export default Info
