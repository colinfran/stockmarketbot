import { FC, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { TrendingDown, TrendingUp } from "lucide-react"
import { PortfolioPosition } from "@/lib/utils"
import Popup from "./popup"
import Info from "./info"

type TableType = {
  data: {
    positions: PortfolioPosition[]
  }
}

const HoldingsTable: FC<TableType> = ({ data }) => {
  const [selectedPosition, setSelectedPosition] = useState<undefined | PortfolioPosition>(undefined)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  console.log(data)
  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Detailed breakdown of your stock positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left whitespace-nowrap">Symbol</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Shares</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Avg Cost</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Current Price</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Total Value</TableHead>
                  <TableHead className="text-right whitespace-nowrap">P/L</TableHead>
                  <TableHead className="text-right whitespace-nowrap">P/L %</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.positions.map((position) => (
                  <TableRow
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    key={position.symbol}
                    onClick={() => {
                      setIsOpen(true)
                      setSelectedPosition(position)
                    }}
                  >
                    <TableCell className="text-left font-semibold whitespace-nowrap">
                      {position.symbol}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      {position.shares}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      ${position.avgCost.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      ${position.currentPrice.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-right font-medium whitespace-nowrap">
                      $
                      {position.totalValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    <TableCell
                      className={`text-right font-medium whitespace-nowrap ${
                        position.profitLoss >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {position.profitLoss >= 0 ? "+" : ""}${position.profitLoss.toFixed(2)}
                    </TableCell>

                    <TableCell
                      className={`text-right font-medium whitespace-nowrap ${
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
      <div className="relative">
        <Popup
          open={isOpen}
          setOpen={(open) => {
            setIsOpen(open)
            setSelectedPosition(undefined)
          }}
        >
          {selectedPosition ? <Info position={selectedPosition!} /> : <div />}
        </Popup>
      </div>
    </>
  )
}

export default HoldingsTable
