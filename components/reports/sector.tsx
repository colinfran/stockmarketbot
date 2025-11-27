import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import TextWithLinks from "../text-with-link"

type SectorObject = {
  sector: string
  rationale: string
}

type SectorType = {
  sector: {
    promising_sectors: SectorObject[]
    weak_sectors: SectorObject[]
  }
}

const Sector: FC<SectorType> = ({ sector }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Promising Sectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sector.promising_sectors.map((sec, idx) => (
              <div className="space-y-1" key={idx}>
                <p className="font-medium text-sm text-emerald-500">{sec.sector}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <TextWithLinks text={sec.rationale} />
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Weak Sectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sector.weak_sectors.map((sec, idx) => (
              <div className="space-y-1" key={idx}>
                <p className="font-medium text-sm text-red-500">{sec.sector}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <TextWithLinks text={sec.rationale} />
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default Sector
