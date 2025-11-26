"use client"
import { MarketReportSchema } from "@/app/api/cron/ai-service/schema"
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from "react"

export type MarketReport = MarketReportSchema & {
  id: string
  created_at: string
}

type ContextProps = {
  loading: boolean
  error: Error | null
  reports: MarketReport[]
}

const defaultContextValue: ContextProps = {
  loading: true,
  error: null,
  reports: [],
}

const ReportContext = createContext<ContextProps>(defaultContextValue)

export const ReportProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const url = "/api/report/get"
  const [reports, setReports] = useState<MarketReport[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchReports = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
      }
      const json = await res.json()
      // If API wraps data, use json.data, otherwise fallback to json
      const data = (json && json.data) || json
      console.log(data)
      // Normalize the payload to an array and ensure we never set undefined
      if (!data) {
        setReports([])
      } else if (Array.isArray(data)) {
        setReports(data as MarketReport[])
      } else {
        // If API returns a single report object, wrap it in an array
        setReports([data as MarketReport])
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Ignore abort error
      if (err?.name === "AbortError") return
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <ReportContext.Provider value={{ loading, reports, error }}>{children}</ReportContext.Provider>
  )
}

export const useReport = (): ContextProps => {
  return useContext(ReportContext)
}
