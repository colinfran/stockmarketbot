import { getCollections } from "@/lib/db"
import { withRetry } from "@/lib/db/retry"
import { MarketReportSchema } from "../ai-service/schema"
import { Response } from "../../types"

type Report = MarketReportSchema & {
  id: string
}

/**
 * Fetches the most recent market report from the database.
 * @description Queries the `marketReports` table and returns the latest report
 * based on the `created_at` timestamp. Returns a Response object containing either
 * the most recent report or an error message.
 *
 * @function fetchLatestReport
 * @returns {Promise<Response<Report>>} A promise resolving to a Response object.
 * If successful, `success` is true and `data` contains the latest report.
 * If there is an error, `success` is false and `error` contains the error message.
 */

export const fetchLatestReport = async (): Promise<Response<Report>> => {
  try {
    console.log("Fetching latest market report from database")
    // get the most recent report
    const rows = await withRetry(async () => {
      const { marketReports } = await getCollections()
      return marketReports
        .find({}, { projection: { _id: 0 } })
        .sort({ created_at: -1 })
        .limit(1)
        .toArray()
    })

    return {
      success: true,
      data: rows[0] as unknown as Report,
    }
  } catch (err) {
    console.error("Error fetching latest market report:", err)
    return {
      success: false,
      error: err as string,
    }
  }
}
