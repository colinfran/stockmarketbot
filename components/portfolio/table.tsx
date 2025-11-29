import { FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { PortfolioPosition } from "@/app/(routes)/portfolio/calculatePositions"

type TableType = {
  data: {
    positions: PortfolioPosition[]
  }
}

const HoldingsTable: FC<TableType> = ({ data }) => {
  return (
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
              {data.positions.map((row) => (
                <TableRow
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                  key={row}
                >
                  {/* Symbol */}
                  <TableCell className="py-3 px-2 sm:px-4 font-semibold whitespace-nowrap">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  {/* Shares */}
                  <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-10 ml-auto" />
                  </TableCell>

                  {/* Avg Cost */}
                  <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>

                  {/* Current Price */}
                  <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>

                  {/* Total Value */}
                  <TableCell className="text-right py-3 px-2 sm:px-4 font-medium whitespace-nowrap">
                    <Skeleton className="h-4 w-14 ml-auto" />
                  </TableCell>

                  {/* P/L */}
                  <TableCell className="text-right py-3 px-2 sm:px-4 font-medium whitespace-nowrap">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>

                  {/* P/L % */}
                  <TableCell className="text-right py-3 px-2 sm:px-4 font-medium whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-10" />
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
