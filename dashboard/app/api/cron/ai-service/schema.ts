import { z } from "zod"

export const marketReportSchema = z.object({
  executive_summary: z.object({
    market_sentiment: z.string(),
    key_drivers: z.array(z.string()),
  }),
  market_overview: z.object({
    near_term_outlook: z.string(),
    risks: z.string(),
  }),
  sector_analysis: z.object({
    promising_sectors: z.array(z.object({ sector: z.string(), rationale: z.string() })),
    weak_sectors: z.array(z.object({ sector: z.string(), rationale: z.string() })),
  }),
  risk_assessment: z.object({
    overall_risk: z.string(),
    notes: z.array(z.string()),
  }),
  recommendations: z.array(
    z.object({
      ticker: z.string(),
      rationale: z.string(),
      allocation: z.number(),
    }),
  ),
  assessment_sources: z.array(z.object({ url: z.string(), title: z.string() })),
})

export type MarketReportSchema = z.infer<typeof marketReportSchema>
