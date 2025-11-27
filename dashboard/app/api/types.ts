export type Response<T> = {
  success: boolean
  data?: T
  error?: string
}

export type NoData = undefined

export type AlpacaOrder = {
  id: string
  symbol: string
  side: string
  notional: string
  qty: number
  filled_qty: number
  filled_avg_price: number
  status: string
  order_type: string
  created_at: string
  submitted_at: string
  filled_at: string
  expires_at: string
}

export type Prices = Record<string, number>
