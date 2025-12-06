import { FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import TextWithLinks from "../text-with-link"
import { Separator } from "../ui/separator"
import { BarChart3 } from "lucide-react"

type SummaryType = {
  notification: string
  summary: {
    key_drivers: string[]
    market_sentiment: string
  }
  createdAt: string
}

const Summary: FC<SummaryType> = ({ summary, createdAt, notification }) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Executive Summary</CardTitle>
        </div>
        <CardDescription>{`Friday ${new Date(createdAt).toLocaleDateString()}`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Market Sentiment</p>
          <p className="text-sm leading-relaxed">
            <TextWithLinks text={summary.market_sentiment} />
          </p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">{notification}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Key Drivers</p>
          <ul className="space-y-2">
            {summary.key_drivers.map((driver, idx) => (
              <li className="flex items-start gap-2 text-sm leading-relaxed" key={idx}>
                <span className="text-primary mt-1">•</span>
                <span>
                  <TextWithLinks text={driver} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default Summary
