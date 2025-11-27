import { Target } from "lucide-react"
import TextWithLinks from "../text-with-link"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { FC } from "react"

type RecommendationsType = {
  recommendations: {
    allocation: number
    ticker: string
    rationale: string
  }[]
}

const Recommendations: FC<RecommendationsType> = ({ recommendations }) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>Stock Recommendations</CardTitle>
        </div>
        <CardDescription>Suggested portfolio allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div
              className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              key={idx}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{rec.ticker}</p>
                  <Badge className="text-xs" variant="secondary">
                    {rec.allocation}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <TextWithLinks text={rec.rationale} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Recommendations
