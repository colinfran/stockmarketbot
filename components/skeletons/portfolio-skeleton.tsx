import type { FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

const PortfolioSkeleton: FC = () => {
  return (
    <>
      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Holdings Table Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-left py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-14 ml-auto" />
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-18 ml-auto" />
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-10 ml-auto" />
                  </TableHead>
                  <TableHead className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow className="border-b border-border" key={i}>
                    <TableCell className="py-3 px-2 sm:px-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-12 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right py-3 px-2 sm:px-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20 ml-auto" />
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
