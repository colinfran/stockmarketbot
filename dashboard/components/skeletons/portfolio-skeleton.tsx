import { FC } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

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

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton className="h-4 w-20" key={i} />
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div className="flex justify-between" key={i}>
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <Skeleton className="h-8 w-20" key={j} />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default PortfolioSkeleton
