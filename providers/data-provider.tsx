"use client"
import { MarketReportSchema } from "@/app/api/cron/ai-service/schema"
import { AlpacaOrder, Prices } from "@/app/api/types"
import { calculatePositions, CalculateType } from "@/lib/utils"
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type MarketReport = MarketReportSchema & {
  id: string
  created_at: string
  ai_model: string
}

type ContextProps = {
  loading: {
    portfolio: boolean
    reports: boolean
    prices: boolean
  }
  error: Error | null
  reports: MarketReport[]
  portfolio: AlpacaOrder[]
  prices: Prices
  calculations?: CalculateType
}

const defaultContextValue: ContextProps = {
  loading: {
    portfolio: true,
    reports: true,
    prices: true,
  },
  error: null,
  reports: [],
  portfolio: [],
  prices: {},
}

const DataContext = createContext<ContextProps>(defaultContextValue)

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const reportsUrl = "/api/reports"
  const portfolioUrl = "/api/portfolio"
  const pricesUrl = "/api/prices"
  const [reports, setReports] = useState<MarketReport[]>([])
  const [portfolio, setPortfolio] = useState<AlpacaOrder[]>([])
  const [prices, setPrices] = useState<Prices>({})
  const [loading, setLoading] = useState<{
    reports: boolean
    portfolio: boolean
    prices: boolean
  }>({ reports: true, portfolio: true, prices: true })
  const [error, setError] = useState<Error | null>(null)

  const fetchReports = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, reports: true }))
    setError(null)
    try {
      const res = await fetch(reportsUrl)
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
      }
      const json = await res.json()
      // If API wraps data, use json.data, otherwise fallback to json
      const data = (json && json.data) || json
      console.log("reports", data)
      // Normalize the payload to an array and ensure we never set undefined
      if (!data) {
        setReports([])
      } else if (Array.isArray(data)) {
        setReports(data.reverse() as MarketReport[])
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Ignore abort error
      if (err?.name === "AbortError") return
      setError(err)
    } finally {
      setLoading((prev) => ({ ...prev, reports: false }))
    }
  }

  const fetchPortfolio = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, portfolio: true }))
    setError(null)
    try {
      const res = await fetch(portfolioUrl)
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
      }
      const json = await res.json()
      const data = (json && json.data) || json
      console.log("portfolio", data)
      if (!data) {
        setPortfolio([])
      } else if (Array.isArray(data)) {
        setPortfolio(data)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Ignore abort error
      if (err?.name === "AbortError") return
      setError(err)
    } finally {
      setLoading((prev) => ({ ...prev, portfolio: false }))
    }
  }

  const fetchPrices = async (): Promise<void> => {
    try {
      setLoading((prev) => ({ ...prev, prices: true }))
      const res = await fetch(pricesUrl)
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
      }
      const json = await res.json()
      // If API wraps data, use json.data, otherwise fallback to json
      const data = (json && json.data) || json
      console.log("prices", data)
      // Normalize the payload to an array and ensure we never set undefined
      setPrices(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Ignore abort error
      if (err?.name === "AbortError") return
      setError(err)
    } finally {
      setLoading((prev) => ({ ...prev, prices: false }))
    }
  }

  useEffect(() => {
    fetchReports()
    fetchPrices()
    fetchPortfolio()
  }, [])

  const calculations = useMemo(() => {
    const val = calculatePositions(portfolio, prices)
    // console.log("calcuations", val)
    return val
  }, [portfolio, prices])

  return (
    <DataContext.Provider value={{ loading, reports, portfolio, prices, calculations, error }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = (): ContextProps => {
  return useContext(DataContext)
}
