export type Response<T> = {
  success: boolean
  data?: T
  error?: string
}

export type NoData = undefined

export type AlpacaOrder = {
  id: string
  symbol?: string
  side?: string
  notional?: string | number | null
  filled_qty?: number | string | null
  filled_avg_price?: number | string | null
  status: string
  order_type?: string
  created_at: string
  submitted_at: string
  filled_at?: string | null
  expires_at?: string | null
  legs?: { symbol?: string; side?: string; ratio_qty?: string | number }[]
}

export type AlpacaPosition = {
  symbol: string
  side: "long" | "short" | string
  qty: string | number
  market_value?: string | number | null
  avg_entry_price?: string | number | null
  cost_basis?: string | number | null
  unrealized_pl?: string | number | null
  unrealized_plpc?: string | number | null
}

export type Prices = Record<string, number>
