import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FC } from "react"

export const ChartSkeleton: FC = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="">
            <CardTitle className="text-2xl">Total Portfolio Value</CardTitle>
            <CardDescription>Combined value of all positions over 30 days</CardDescription>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  )
}
