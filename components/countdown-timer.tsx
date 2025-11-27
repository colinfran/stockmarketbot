"use client"

import { FC, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"

type CountdownProps = {
  targetDate: Date
  label: string
  description: string
}

const CountdownTimer: FC<CountdownProps> = ({ targetDate, label, description }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const formattedDate = formatInTimeZone(
    targetDate,
    "America/Los_Angeles",
    "EEE M/d/yyyy 'at' h:mma 'PST'",
  ).replace(/AM|PM/, (m) => m.toLowerCase())

  useEffect(() => {
    const calculateTimeLeft = (): void => {
      const now = new Date()
      const target = new Date(targetDate)

      const difference = target.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) {
    return (
      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-8 w-full bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card/50">
      <CardContent className="flex flex-col p-6 gap-3">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">{label}</h3>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
              <div className="text-xs text-muted-foreground">hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
              <div className="text-xs text-muted-foreground">mins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
              <div className="text-xs text-muted-foreground">secs</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div>{formattedDate}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CountdownTimer
