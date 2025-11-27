import { NextResponse } from "next/server"
import { fetchAllReports } from "./fetch"

/**
 * Handles GET requests to the /api/reports route.
 * @description Fetches all market reports using the fetchAllReports helper.
 * Returns a JSON response containing either the list of reports or an error message.
 * @function GET
 * @returns {NextResponse} A Next.js Response object with the fetched reports data if successful,
 * or an error message if the fetch fails.
 */

export async function GET(): Promise<NextResponse> {
  console.log("Fetching reports")
  const report = await fetchAllReports()
  if (!report.success) {
    return NextResponse.json({ success: false, error: report.error })
  }
  return NextResponse.json({ success: true, data: report.data })
}
