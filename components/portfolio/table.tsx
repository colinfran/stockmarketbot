import { FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { TrendingDown, TrendingUp } from "lucide-react"
import { PortfolioPosition } from "@/app/(routes)/portfolio/calculatePositions"

type TableType = {
  data: {
    positions: PortfolioPosition[]
  }
}

const HoldingsTable: FC<TableType> = ({ data }) => {
  return (
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
              {data.positions.map((position) => (
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
  )
}

export default HoldingsTable
