import { FC } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Brain } from "lucide-react"

type ModelType = {
  model: string
}

const Model: FC<ModelType> = ({ model }) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>AI Model</CardTitle>
        </div>
        <CardDescription>{model}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default Model
