import { db } from "@/lib/db"
import { marketReports } from "@/lib/db/schema"
import { MarketReport } from "@/providers/data-provider"
import { Response } from "../types"

export const fetchAllReports = async (): Promise<Response<MarketReport[]>> => {
  console.log("Get all reports from database")
  try {
    const data = await db.select().from(marketReports)
    console.log("Successfully fetched reports from database")
    return { success: true, data: data as unknown as MarketReport[] }
  } catch (error) {
    console.error("Error fetching reports from database:", error)
    return { success: false, error: (error as Error).message }
  }
}
