import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { AlertTriangle } from "lucide-react"
import { Badge } from "../ui/badge"
import TextWithLinks from "../text-with-link"

type RiskType = {
  risk: {
    overall_risk: string
    notes: string[]
  }
}

const getRiskColor = (risk: string): string => {
  const lower = risk.toLowerCase()
  if (lower.includes("low")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  if (lower.includes("moderate")) return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  return "bg-red-500/10 text-red-500 border-red-500/20"
}

const Risk: FC<RiskType> = ({ risk }) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle>Risk Assessment</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Overall Risk Level</p>
          <Badge className={getRiskColor(risk.overall_risk)} variant="outline">
            {risk.overall_risk}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Risk Notes</p>
          <ul className="space-y-2">
            {risk.notes.map((note, idx) => (
              <li className="flex items-start gap-2 text-sm leading-relaxed" key={idx}>
                <span className="text-primary mt-1">•</span>
                <span>
                  <TextWithLinks text={note} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default Risk
