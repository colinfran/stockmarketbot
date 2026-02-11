import { FC, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { PortfolioPosition } from "@/lib/utils"
import Popup from "./popup"
import Info from "./info"

type TableType = {
  data: {
    totalCost: number
    totalProfitLoss: number
    totalValue: number
    positions: PortfolioPosition[]
  }
}

const HoldingsTable: FC<TableType> = ({ data }) => {
  const [selectedPosition, setSelectedPosition] = useState<undefined | PortfolioPosition>(undefined)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const totalPLPercent = data.totalCost > 0 ? (data.totalProfitLoss / data.totalCost) * 100 : 0

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Detailed breakdown of your stock positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 mb-6">
            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Total Value</p>
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mt-1">
                $
                {data.totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cost basis: $
                {data.totalCost.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Total P/L</p>
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p
                className={`text-xl font-semibold mt-1 ${data.totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {data.totalProfitLoss >= 0 ? "+" : ""}$
                {data.totalProfitLoss.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
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
            </div>

            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Positions</p>
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mt-1">{data.positions.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Active holdings</p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left whitespace-nowrap">Symbol</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Shares</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Total Value</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Avg Cost</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Current Price</TableHead>
                  <TableHead className="text-right whitespace-nowrap">P/L</TableHead>
                  <TableHead className="text-right whitespace-nowrap">P/L %</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.positions.map((position, index) => (
                  <TableRow
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    data-testid={`table-row-${index}`}
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
                      {Number(position.shares.toFixed(8))}
                    </TableCell>

                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {`$${position.totalValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      ${position.avgCost.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      ${position.currentPrice.toFixed(2)}
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
          position={selectedPosition!}
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
