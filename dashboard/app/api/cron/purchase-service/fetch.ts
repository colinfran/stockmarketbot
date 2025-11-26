import { db } from "@/lib/db"
import { marketReports } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { MarketReportSchema } from "../ai-service/schema"

type Report = MarketReportSchema & {
  id: string
}

type Response = {
  success: boolean
  data?: Report
  error?: string
}

export const fetchLatestReport = async (): Promise<Response> => {
  try {
    // get the most recent report
    const rows = await db
      .select()
      .from(marketReports)
      .orderBy(desc(marketReports.created_at))
      .limit(1)

    return {
      success: true,
      data: rows[0] as unknown as Report,
    }
  } catch (err) {
    console.error("Error placing orders:", err)
    return {
      success: false,
      error: err as string,
    }
  }
}
