import type { FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DollarSign, Wallet } from "lucide-react"

const PortfolioSkeleton: FC = () => {
  return (
    <>
      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table Skeleton */}
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
                {[1, 2, 3, 4, 5].map((row) => (
                  <TableRow
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    key={row}
                  >
                    {/* Symbol */}
                    <TableCell className="text-left font-semibold whitespace-nowrap w-[85px]">
                      <div className="flex items-center justify-start">
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </TableCell>

                    {/* Shares */}
                    <TableCell className="text-right whitespace-nowrap w-[151px]">
                      <div className="flex items-center justify-end">
                        <Skeleton className="h-4 w-18" />
                      </div>
                    </TableCell>

                    {/* Avg Cost */}
                    <TableCell className="text-right whitespace-nowrap w-[98px]">
                      <div className="flex items-center justify-end">
                        <Skeleton className="h-4 w-14" />
                      </div>
                    </TableCell>

                    {/* Current Price */}
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end w-[134px]">
                        <Skeleton className="h-4 w-14" />
                      </div>
                    </TableCell>

                    {/* Total Value */}
                    <TableCell className="text-right whitespace-nowrap w-[115px]">
                      <div className="flex items-center justify-end">
                        <Skeleton className="h-4 w-14" />
                      </div>
                    </TableCell>

                    {/* P/L */}
                    <TableCell className="text-right whitespace-nowra w-[83px]p">
                      <div className="flex items-center justify-end">
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </TableCell>

                    {/* P/L % */}
                    <TableCell className="text-right whitespace-nowrap w-[107px]">
                      <div className="flex items-center justify-end gap-1">
                        <div className="flex items-center justify-end">
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default PortfolioSkeleton
