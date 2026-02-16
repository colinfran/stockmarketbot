import { FC } from "react"
import { AlpacaPosition } from "@/app/api/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { buildOpenSpreads } from "@/lib/utils"

type OpenSpreadPositionsProps = {
  openPositions: AlpacaPosition[]
  realizedSpreadPnL: number
}

const OpenSpreadPositions: FC<OpenSpreadPositionsProps> = ({
  openPositions,
  realizedSpreadPnL,
}) => {
  const openSpreads = buildOpenSpreads(openPositions)
  const openSpreadUnrealizedPl = openSpreads.reduce((sum, spread) => sum + spread.unrealizedPL, 0)

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
        {openSpreads.length > 0 && (
          <p
            className={`text-sm font-medium mt-2 ${
              openSpreadUnrealizedPl >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            Total Unrealized P/L: {openSpreadUnrealizedPl >= 0 ? "+" : ""}$
            {openSpreadUnrealizedPl.toFixed(2)}
          </p>
        )}
        {openSpreads.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-3">No open option spread positions.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6 mt-4">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left whitespace-nowrap">Underlying</TableHead>
                  <TableHead className="text-left whitespace-nowrap">Type</TableHead>
                  <TableHead className="text-left whitespace-nowrap">Strikes (L/S)</TableHead>
                  <TableHead className="text-left whitespace-nowrap">Expiration</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Contracts</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Cost Basis</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Market Value</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Unrealized P/L</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Unrealized P/L %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openSpreads.map((spread) => {
                  return (
                    <TableRow className="border-b border-border" key={spread.key}>
                      <TableCell className="font-semibold whitespace-nowrap">
                        {spread.underlying}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {spread.optionType.toUpperCase()} Vertical
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {spread.longStrike}/{spread.shortStrike}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{spread.expiration}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {spread.contracts}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        ${spread.costBasis.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        ${spread.marketValue.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium whitespace-nowrap ${
                          spread.unrealizedPL >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {spread.unrealizedPL >= 0 ? "+" : ""}${spread.unrealizedPL.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium whitespace-nowrap ${
                          spread.unrealizedPLPct >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {spread.unrealizedPLPct >= 0 ? "+" : ""}
                        {spread.unrealizedPLPct.toFixed(2)}%
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
