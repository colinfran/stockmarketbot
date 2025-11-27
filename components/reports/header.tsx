import { FC } from "react"
import CountdownTimer from "../countdown-timer"
import { nextFriday, nextMonday, set } from "date-fns"
import { fromZonedTime } from "date-fns-tz"

const Header: FC = () => {
  const friday8pmLocal = set(nextFriday(new Date()), {
    hours: 20,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })
  const friday8pmPST = fromZonedTime(friday8pmLocal, "America/Los_Angeles")

  const monday630amLocal = set(nextMonday(new Date()), {
    hours: 6,
    minutes: 30,
    seconds: 0,
    milliseconds: 0,
  })
  const monday630amPST = fromZonedTime(monday630amLocal, "America/Los_Angeles")
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
