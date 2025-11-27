import { NextResponse } from "next/server"
import { generateWeeklyReport } from "./generate"
import { addToDb } from "./update"

/**
 * Cron route handler for generating and storing the weekly AI market report.
 * @description This GET endpoint is intended to be called by a scheduled cron job.
 * It validates a secret authorization header, generates a weekly market report using AI,
 * stores the report in the database, and returns a JSON response indicating success or failure.
 *
 * Steps:
 * 1. Validate the Authorization header against `process.env.CRON_SECRET`.
 * 2. Call `generateWeeklyReport` to generate the market report.
 * 3. If successful, call `addToDb` to insert the report into the database.
 * 4. Return a JSON response indicating the result.
 *
 * @function GET
 * @param {Request} request The incoming Next.js Request object.
 * @returns {Promise<NextResponse>} A Next.js Response object.
 * Returns 401 Unauthorized if the secret is invalid.
 * Returns `{ success: true }` if the report was generated and stored successfully.
 * Returns `{ success: false, error: string }` if any step fails.
 */

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }
  console.log("Running ai service cron")
  const report = await generateWeeklyReport()
  if (!report.success) {
    return NextResponse.json({ success: false, error: report.error })
  }
  const update = await addToDb(report.data!)
  if (!update.success) {
    return NextResponse.json({ success: false, error: update.error })
  }
  console.log("Finished ai service cron")
  return NextResponse.json({ success: true })
}
