import { AlpacaOrder } from "@/app/api/types"
import { MarketReportSchema } from "@/app/api/cron/ai-service/schema"
import { Collection, Db, MongoClient } from "mongodb"

type MarketReportDocument = MarketReportSchema & {
  id: string
  ai_model?: string | null
  created_at: Date
}

type PendingSpreadRecommendation = Extract<
  MarketReportSchema["recommendations"][number],
  { asset_type: "option_vertical_spread" }
>

type PendingSpreadOrderDocument = {
  id: string
  market_report_id: string
  recommendation: PendingSpreadRecommendation
  attempts: number
  created_at: Date
  last_attempt_at?: Date | null
  last_order_id?: string | null
  last_status?: string | null
  last_error?: string | null
}

type TradeOrderDocument = Omit<
  AlpacaOrder,
  "created_at" | "submitted_at" | "filled_at" | "expires_at" | "order_type"
> & {
  id: string
  market_report_id: string
  symbol: string
  side: string
  status: string
  notional?: string | null
  filled_qty?: string | null
  filled_avg_price?: string | null
  created_at?: string | Date | null
  submitted_at?: string | Date | null
  filled_at?: string | Date | null
  expires_at?: string | Date | null
  order_type?: string | null
}

type PushSubscriptionDocument = {
  id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: Date
}

type PriceCacheDocument = {
  ticker: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  fetched_at: Date
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI is not set")
}

const client = new MongoClient(uri)
const clientPromise = global._mongoClientPromise ?? client.connect()

if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise = clientPromise
}

const getDbName = (): string => process.env.MONGODB_DB_NAME || "stockmarketbot"

let indexesReadyPromise: Promise<void> | null = null

const ensureIndexes = async (db: Db): Promise<void> => {
  await Promise.all([
    db.collection("market_reports").createIndex({ id: 1 }, { unique: true }),
    db.collection("market_reports").createIndex({ created_at: -1 }),
    db.collection("trade_orders").createIndex({ id: 1 }, { unique: true }),
    db.collection("trade_orders").createIndex({ market_report_id: 1 }),
    db.collection("pending_spread_orders").createIndex({ id: 1 }, { unique: true }),
    db.collection("pending_spread_orders").createIndex({ market_report_id: 1 }),
    db.collection("push_subscriptions").createIndex({ id: 1 }, { unique: true }),
    db.collection("push_subscriptions").createIndex({ endpoint: 1 }, { unique: true }),
    db.collection("price_cache").createIndex({ ticker: 1 }, { unique: true }),
  ])
}

export const getDb = async (): Promise<Db> => {
  const connectedClient = await clientPromise
  const db = connectedClient.db(getDbName())
  if (!indexesReadyPromise) {
    indexesReadyPromise = ensureIndexes(db)
  }
  await indexesReadyPromise
  return db
}

export const getCollections = async (): Promise<{
  marketReports: Collection<MarketReportDocument>
  tradeOrders: Collection<TradeOrderDocument>
  pendingSpreadOrders: Collection<PendingSpreadOrderDocument>
  pushSubscriptions: Collection<PushSubscriptionDocument>
  priceCache: Collection<PriceCacheDocument>
}> => {
  const db = await getDb()
  return {
    marketReports: db.collection<MarketReportDocument>("market_reports"),
    tradeOrders: db.collection<TradeOrderDocument>("trade_orders"),
    pendingSpreadOrders: db.collection<PendingSpreadOrderDocument>("pending_spread_orders"),
    pushSubscriptions: db.collection<PushSubscriptionDocument>("push_subscriptions"),
    priceCache: db.collection<PriceCacheDocument>("price_cache"),
  }
}
