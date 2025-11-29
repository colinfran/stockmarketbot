import { FC } from "react"
import CountdownTimer from "../countdown-timer"
import { getNextFriday8pm, getNextMonday630am } from "./time"

const Header: FC = () => {
  const friday8pmPST = getNextFriday8pm()
  const monday630amPST = getNextMonday630am()

  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Market Analysis</h1>
            <p className="text-muted-foreground mt-1">AI-powered weekly market insights</p>
          </div>
          {/* Countdown Timer */}
          <div className="grid gap-4 md:grid-cols-2">
            <CountdownTimer
              description="AI analysis runs after market close"
              label="Next Market Analysis"
              targetDate={friday8pmPST}
            />
            <CountdownTimer
              description="Automated purchase execution"
              label="Next Stock Purchase"
              targetDate={monday630amPST}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
