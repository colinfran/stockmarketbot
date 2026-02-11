import { FC } from "react"
import { AlpacaPosition } from "@/app/api/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type OpenSpreadPositionsProps = {
  openPositions: AlpacaPosition[]
  realizedSpreadPnL: number
}

const OpenSpreadPositions: FC<OpenSpreadPositionsProps> = ({
  openPositions,
  realizedSpreadPnL,
}) => {
  const optionSymbolRegex = /^[A-Z]{1,6}\d{6}[CP]\d{8}$/
  const openOptionPositions = openPositions.filter((position) =>
    optionSymbolRegex.test(position.symbol),
  )
  const openSpreadUnrealizedPl = openOptionPositions.reduce((sum, position) => {
    return sum + Number(position.unrealized_pl || 0)
  }, 0)

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Open Spread Positions</CardTitle>
        <CardDescription>Open option legs from recommended vertical spreads</CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm font-medium ${
            realizedSpreadPnL >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          Total Realized P/L (All Spreads): {realizedSpreadPnL >= 0 ? "+" : ""}$
          {realizedSpreadPnL.toFixed(2)}
        </p>
        {openOptionPositions.length > 0 && (
          <p
            className={`text-sm font-medium mt-2 ${
              openSpreadUnrealizedPl >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            Total Unrealized P/L: {openSpreadUnrealizedPl >= 0 ? "+" : ""}$
            {openSpreadUnrealizedPl.toFixed(2)}
          </p>
        )}
        {openOptionPositions.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-3">No open option spread positions.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6 mt-4">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left whitespace-nowrap">Symbol</TableHead>
                  <TableHead className="text-left whitespace-nowrap">Side</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Qty</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Cost Basis</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Market Value</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Unrealized P/L</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Unrealized P/L %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openOptionPositions.map((position) => {
                  const qty = Number(position.qty)
                  const costBasis = Number(position.cost_basis || 0)
                  const marketValue = Number(position.market_value || 0)
                  const unrealizedPL = Number(position.unrealized_pl || 0)
                  const unrealizedPLPct = Number(position.unrealized_plpc || 0) * 100
                  const side = position.side?.toLowerCase() === "short" ? "SHORT" : "LONG"

                  return (
                    <TableRow className="border-b border-border" key={position.symbol}>
                      <TableCell className="font-semibold whitespace-nowrap">
                        {position.symbol}
                      </TableCell>
                      <TableCell
                        className={`whitespace-nowrap ${
                          side === "LONG" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {side}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">{qty}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        ${costBasis.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        ${marketValue.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium whitespace-nowrap ${
                          unrealizedPL >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {unrealizedPL >= 0 ? "+" : ""}${unrealizedPL.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium whitespace-nowrap ${
                          unrealizedPLPct >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {unrealizedPLPct >= 0 ? "+" : ""}
                        {unrealizedPLPct.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OpenSpreadPositions
