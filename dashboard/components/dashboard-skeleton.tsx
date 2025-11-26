import { FC } from "react"
import { Skeleton } from "./ui/skeleton"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Separator } from "./ui/separator"
import { Clock } from "lucide-react"

const DashboardSkeleton: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Market Analysis Dashboard</h1>
              <p className="text-muted-foreground mt-1">AI-powered weekly market insights</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  label: "Next Market Analysis",
                  description: "AI analysis runs after market close",
                },
                { label: "Next Stock Purchase", description: "Automated purchase execution" },
              ].map(({ label, description }, i) => (
                <Card className="border-border bg-card/50" key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{label}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{description}</p>
                        <Skeleton className="h-[48px] w-[408px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-[280px] py-6">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="grid gap-6">
          {/* Executive Summary Skeleton */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-[180px]" />
              </div>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Overview Skeleton */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[130px] mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Separator />
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Sector Analysis Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card className="border-border" key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-[140px]" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div className="space-y-2" key={j}>
                        <Skeleton className="h-4 w-[180px]" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk Assessment Skeleton */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[140px] mb-2" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Skeleton */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-[200px]" />
              </div>
              <Skeleton className="h-4 w-[180px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    className="flex items-start justify-between gap-4 pb-4 border-b border-border"
                    key={i}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-[60px]" />
                        <Skeleton className="h-5 w-[50px]" />
                      </div>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sources Skeleton */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-[180px]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton className="h-4 w-full" key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton
