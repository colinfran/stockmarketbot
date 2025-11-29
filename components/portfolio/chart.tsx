"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { FC } from "react"

type PortfolioChartProps = {
  data: { date: string; value: number }[]
  currentValue: number
  changePercent: number
}

const PortfolioChart: FC<PortfolioChartProps> = ({ data, currentValue, changePercent }) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Total Portfolio Value</CardTitle>
            <CardDescription>Combined value of all positions over 30 days</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${currentValue.toFixed(2)}</div>
            <div
              className={`text-sm flex items-center justify-end gap-1 ${changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              <TrendingUp className="h-4 w-4" />
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[400px] w-full"
          config={{
            value: {
              label: "Portfolio Value",
              color: "red",
            },
          }}
        >
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={sortedData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
  )
}

export default PortfolioChart
