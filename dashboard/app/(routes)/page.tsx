"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FC, useEffect, useMemo, useState } from "react"
import { AlertTriangle, BarChart3, BookOpen, Target, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton"
import TextWithLinks from "@/components/text-with-link"
import { useData } from "@/providers/data-provider"
import CountdownTimer from "@/components/countdown-timer"
import { nextMonday, nextFriday, set } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

const getRiskColor = (risk: string): string => {
  const lower = risk.toLowerCase()
  if (lower.includes("low")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  if (lower.includes("moderate")) return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  return "bg-red-500/10 text-red-500 border-red-500/20"
}

const Page: FC = () => {
  const { reports, loading, fetchReports } = useData()

  useEffect(() => {
    fetchReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedReportId, setSelectedReportId] = useState<undefined | string>(undefined)

  const friday8pm = set(nextFriday(new Date()), {
    hours: 20,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  })
  const friday8pmPST = formatInTimeZone(friday8pm, "America/Los_Angeles", "yyyy-MM-dd HH:mm:ss zzz")

  const monday630am = set(nextMonday(new Date()), {
    hours: 6,
    minutes: 30,
    seconds: 0,
    milliseconds: 0,
  })
  const monday630amPST = formatInTimeZone(
    monday630am,
    "America/Los_Angeles",
    "yyyy-MM-dd HH:mm:ss zzz",
  )

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
              <h1 className="text-3xl font-bold text-balance">Market Analysis Dashboard</h1>
              <p className="text-muted-foreground mt-1">AI-powered weekly market insights</p>
            </div>
            {/* Countdown Timer */}
            <div className="grid gap-4 md:grid-cols-2">
              <CountdownTimer
                description="AI analysis runs after market close"
                label="Next Market Analysis"
                targetDate={new Date(friday8pmPST)}
              />
              <CountdownTimer
                description="Automated purchase execution"
                label="Next Stock Purchase"
                targetDate={new Date(monday630amPST)}
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
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Executive Summary</CardTitle>
              </div>
              <CardDescription>
                {`Friday ${new Date(selectedReport.created_at).toLocaleDateString()}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Market Sentiment</p>
                <p className="text-sm leading-relaxed">
                  <TextWithLinks text={selectedReport.executive_summary.market_sentiment} />
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Key Drivers</p>
                <ul className="space-y-2">
                  {selectedReport.executive_summary.key_drivers.map((driver, idx) => (
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

          {/* Market Overview */}
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
                  <TextWithLinks text={selectedReport.market_overview.near_term_outlook} />
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Key Risks</p>
                <p className="text-sm leading-relaxed">
                  <TextWithLinks text={selectedReport.market_overview.risks} />
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sector Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Promising Sectors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedReport.sector_analysis.promising_sectors.map((sector, idx) => (
                    <div className="space-y-1" key={idx}>
                      <p className="font-medium text-sm text-emerald-500">{sector.sector}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <TextWithLinks text={sector.rationale} />
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
                  {selectedReport.sector_analysis.weak_sectors.map((sector, idx) => (
                    <div className="space-y-1" key={idx}>
                      <p className="font-medium text-sm text-red-500">{sector.sector}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <TextWithLinks text={sector.rationale} />
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
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
                <Badge
                  className={getRiskColor(selectedReport.risk_assessment.overall_risk)}
                  variant="outline"
                >
                  {selectedReport.risk_assessment.overall_risk}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Risk Notes</p>
                <ul className="space-y-2">
                  {selectedReport.risk_assessment.notes.map((note, idx) => (
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

          {/* Recommendations */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Stock Recommendations</CardTitle>
              </div>
              <CardDescription>Suggested portfolio allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedReport.recommendations.map((rec, idx) => (
                  <div
                    className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                    key={idx}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">{rec.ticker}</p>
                        <Badge className="text-xs" variant="secondary">
                          {rec.allocation}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <TextWithLinks text={rec.rationale} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sources */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Assessment Sources</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedReport.assessment_sources.map((source, idx) => (
                  <a
                    className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                    href={source.url}
                    key={idx}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>{source.title}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
