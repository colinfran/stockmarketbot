import { MarketReportSchema } from "./schema"
import { db } from "@/lib/db"
import { marketReports } from "@/lib/db/schema"
import { InferInsertModel } from "drizzle-orm"
import { Response, NoData } from "../../types"

type MarketReportInsert = InferInsertModel<typeof marketReports>

export const addToDb = async (report: MarketReportSchema): Promise<Response<NoData>> => {
  console.log("Adding report to database")
  try {
    await db.insert(marketReports).values(report as MarketReportInsert)
    console.log("Successfully added report to database")
    return { success: true }
  } catch (error) {
    console.error("Error adding report to database:", error)
    return { success: false, error: error as string }
  }
}
