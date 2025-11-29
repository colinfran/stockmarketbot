import { FC } from "react"
import { Card, CardContent } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Bar } from "@/providers/data-provider"

type StockChartType = {
  chartData: Bar[]
}

const StockChart: FC<StockChartType> = ({ chartData }) => {
  return (
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
                      formatter={(value) => [`$${Number(value).toLocaleString()}`]}
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
                  dataKey="close"
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
  )
}

export default StockChart
