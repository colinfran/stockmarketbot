"use client"
import { FC, useEffect, useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton"
import { useData } from "@/providers/data-provider"
import CountdownTimer from "@/components/countdown-timer"
import { nextMonday, nextFriday, set } from "date-fns"
import { fromZonedTime } from "date-fns-tz"
import Recommendations from "@/components/reports/recommendations"
import Sources from "@/components/reports/sources"
import Risk from "@/components/reports/risk"
import Sector from "@/components/reports/sector"
import Overview from "@/components/reports/overview"
import Summary from "@/components/reports/summary"

const Page: FC = () => {
  const { reports, loading } = useData()

  const [selectedReportId, setSelectedReportId] = useState<undefined | string>(undefined)

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

  useEffect(() => {
    if (reports.length) {
      setSelectedReportId(reports[0].id)
    }
  }, [reports])

  const selectedReport = useMemo(() => {
    return reports?.find((report) => report.id === selectedReportId)
  }, [reports, selectedReportId])

  if (!reports.length && !loading.reports) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No market reports available</p>
      </div>
    )
  }

  if (loading.reports || !selectedReport) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-[280px] py-6">
          <Select value={selectedReportId} onValueChange={setSelectedReportId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select report" />
            </SelectTrigger>
            <SelectContent>
              {reports.map((report) => (
                <SelectItem key={report.id} value={report.id}>
                  {"Friday "}
                  {new Date(report.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-6">
          {/* Executive Summary */}
          <Summary
            createdAt={selectedReport.created_at}
            summary={selectedReport.executive_summary}
          />

          {/* Market Overview */}
          <Overview overview={selectedReport.market_overview} />

          {/* Sector Analysis */}
          <Sector sector={selectedReport.sector_analysis} />

          {/* Risk Assessment */}
          <Risk risk={selectedReport.risk_assessment} />

          {/* Recommendations */}
          <Recommendations recommendations={selectedReport.recommendations} />

          {/* Sources */}
          <Sources sources={selectedReport.assessment_sources} />
        </div>
      </div>
    </div>
  )
}

export default Page
