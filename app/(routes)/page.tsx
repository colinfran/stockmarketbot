"use client"
import { FC, useEffect, useMemo, useState } from "react"

import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton"
import { useData } from "@/providers/data-provider"
import Recommendations from "@/components/reports/recommendations"
import Sources from "@/components/reports/sources"
import Risk from "@/components/reports/risk"
import Sector from "@/components/reports/sector"
import Overview from "@/components/reports/overview"
import Summary from "@/components/reports/summary"
import Picker from "@/components/reports/picker"
import Header from "@/components/reports/header"
import Model from "@/components/reports/model"
import { Separator } from "@/components/ui/separator"

const Page: FC = () => {
  const { reports, loading } = useData()

  const [selectedReportId, setSelectedReportId] = useState<undefined | string>(undefined)

  useEffect(() => {
    if (reports.length) {
      const loadedReport = reports.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      console.log("loadedreports", loadedReport)
      setSelectedReportId(loadedReport[0].id)
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
      <Header />

      <div className="container mx-auto px-4 py-4">
        <Separator className="container mx-auto" />
        {/* Report Picker */}
        <Picker selectedReportId={selectedReportId} setSelectedReportId={setSelectedReportId} />
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

          {/* Model */}
          <Model model={selectedReport.ai_model} />
        </div>
      </div>
    </div>
  )
}

export default Page
