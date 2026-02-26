import { getCollections } from "@/lib/db"
import { MarketReport } from "@/providers/data-provider"
import { Response } from "../types"

export const fetchAllReports = async (): Promise<Response<MarketReport[]>> => {
  // console.log("Fetch all reports from database")
  try {
    const { marketReports } = await getCollections()
    const data = await marketReports.find({}, { projection: { _id: 0 } }).toArray()
    // console.log("Successfully fetched reports from database")
    return { success: true, data: data as unknown as MarketReport[] }
  } catch (error) {
    console.error("Error fetching reports from database:", error)
    return { success: false, error: (error as Error).message }
  }
}
