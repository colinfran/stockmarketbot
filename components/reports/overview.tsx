import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import TextWithLinks from "../text-with-link"
import { Separator } from "../ui/separator"
import { TrendingUp } from "lucide-react"

type OverviewType = {
  overview: {
    near_term_outlook: string
    risks: string
  }
}

const Overview: FC<OverviewType> = ({ overview }) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Market Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Near-Term Outlook</p>
          <p className="text-sm leading-relaxed">
            <TextWithLinks text={overview.near_term_outlook} />
          </p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Key Risks</p>
          <p className="text-sm leading-relaxed">
            <TextWithLinks text={overview.risks} />
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default Overview
