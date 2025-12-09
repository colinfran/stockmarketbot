import { jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const marketReports = pgTable("market_reports", {
  id: text("id").primaryKey(),
  executive_summary: jsonb("executive_summary").notNull(), // store as JSON
  market_overview: jsonb("market_overview").notNull(),
  sector_analysis: jsonb("sector_analysis").notNull(),
  risk_assessment: jsonb("risk_assessment").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  assessment_sources: jsonb("assessment_sources").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  ai_model: text("ai_model"),
  notification: text("notification"),
})

export const tradeOrders = pgTable("trade_orders", {
  id: uuid("id").primaryKey(),
  market_report_id: text("market_report_id")
    .notNull()
    .references(() => marketReports.id), // foreign key to market_reports
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // "buy" or "sell"
  notional: numeric("notional"),
  filled_qty: numeric("filled_qty"),
  filled_avg_price: numeric("filled_avg_price"),
  status: text("status").notNull(), // e.g. "accepted", "filled"
  order_type: text("order_type"),
  created_at: timestamp("created_at"),
  submitted_at: timestamp("submitted_at"),
  filled_at: timestamp("filled_at"),
  expires_at: timestamp("expires_at"),
})

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
