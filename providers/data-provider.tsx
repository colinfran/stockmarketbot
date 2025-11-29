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

type PriceHistory = {
  [ticker: string]: Bar[]
}

export type Bar = {
  date: string
  high: number
  volume: number
  open: number
  low: number
  close: number
  adjClose: number
}

type ContextProps = {
  loading: {
    portfolio: boolean
    reports: boolean
  }
  error: Error | null
  reports: MarketReport[]
  portfolio: AlpacaOrder[]
  currentPrices: Prices
  calculations?: CalculateType
  priceHistory: PriceHistory
}

const defaultContextValue: ContextProps = {
  loading: {
    portfolio: true,
    reports: true,
  },
  error: null,
  reports: [],
  portfolio: [],
  currentPrices: {},
  priceHistory: {},
}

const DataContext = createContext<ContextProps>(defaultContextValue)

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const reportsUrl = "/api/reports"
  const portfolioUrl = "/api/portfolio"
  const [reports, setReports] = useState<MarketReport[]>([])
  const [portfolio, setPortfolio] = useState<AlpacaOrder[]>([])
  const [currentPrices, setCurrentPrices] = useState<Prices>({})
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({})
  const [loading, setLoading] = useState<{
    reports: boolean
    portfolio: boolean
  }>({ reports: true, portfolio: true })
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
        setReports(data as MarketReport[])
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
      console.log("portfolio data", data)
      setPortfolio(data.tradeOrders)
      setPriceHistory(data.priceHistory)
      setCurrentPrices(data.currentPrices)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Ignore abort error
      if (err?.name === "AbortError") return
      setError(err)
    } finally {
      setLoading((prev) => ({ ...prev, portfolio: false }))
    }
  }

  useEffect(() => {
    fetchReports()
    fetchPortfolio()
  }, [])

  const calculations = useMemo(() => {
    const val = calculatePositions(portfolio, currentPrices)
    return val
  }, [portfolio, currentPrices])

  return (
    <DataContext.Provider
      value={{ loading, reports, portfolio, currentPrices, priceHistory, calculations, error }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = (): ContextProps => {
  return useContext(DataContext)
}
