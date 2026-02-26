import { MarketReportSchema } from "./schema"
import { getCollections } from "@/lib/db"
import { Response, NoData } from "../../types"
import { currentModel } from "../../index"

/**
 * Inserts a generated market report into the database.
 * @description Converts a MarketReportSchema object into the database format
 * and inserts it into the `marketReports` table using Drizzle ORM. Returns a
 * Response object indicating success or failure.
 *
 * @function addToDb
 * @param {MarketReportSchema} report The market report object to insert.
 * @returns {Promise<Response<NoData>>} A promise resolving to a Response object.
 * If successful, `success` is true and no data is returned.
 * If there is an error, `success` is false and `error` contains the error message.
 */

export const addToDb = async (report: MarketReportSchema): Promise<Response<NoData>> => {
  console.log("Adding report to database")
  try {
    const { marketReports } = await getCollections()
    await marketReports.insertOne({
      ...report,
      id: crypto.randomUUID(),
      ai_model: currentModel,
      created_at: new Date(),
    })
    console.log("Successfully added report to database")
    return { success: true }
  } catch (error) {
    console.error("Error adding report to database:", error)
    return { success: false, error: error as string }
  }
}
