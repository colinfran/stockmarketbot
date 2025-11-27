import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Link from "next/link"
import { BookOpen } from "lucide-react"

type SourcesType = {
  sources: {
    url: string
    title: string
  }[]
}

const Sources: FC<SourcesType> = ({ sources }) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle>Assessment Sources</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sources.map((source, idx) => (
            <Link
              className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
              href={source.url}
              key={idx}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>{source.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Sources
