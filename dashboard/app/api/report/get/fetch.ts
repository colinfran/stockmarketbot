import { db } from "@/lib/db"
import { marketReports } from "@/lib/db/schema"
import { MarketReport } from "@/providers/report-provider"

type Response = {
  success: boolean
  data?: MarketReport[]
  error?: string
}

export const fetchAllReports = async (): Promise<Response> => {
  console.log("Get all reports from database")
  try {
    const data = await db.select().from(marketReports)
    console.log("Successfully fetched reports from database")
    return { success: true, data: data }
  } catch (error) {
    console.error("Error fetching reports from database:", error)
    return { success: false, error: (error as Error).message }
  }
}
