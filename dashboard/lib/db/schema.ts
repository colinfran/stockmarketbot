import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const marketReports = pgTable("market_reports", {
  id: text("id").primaryKey(),
  executive_summary: jsonb("executive_summary").notNull(), // store as JSON
  market_overview: jsonb("market_overview").notNull(),
  sector_analysis: jsonb("sector_analysis").notNull(),
  risk_assessment: jsonb("risk_assessment").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  assessment_sources: jsonb("assessment_sources").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})
