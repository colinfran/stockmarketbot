import { NextResponse } from "next/server"
import { fetchPrices } from "./fetch"

/**
 * Handles GET requests to the /api/prices route.
 * @description Fetches the latest stock or market prices using the fetchPrices helper.
 * Returns a JSON response containing either the prices data or an error message.
 * @function GET
 * @returns {NextResponse} A Next.js Response object with the fetched prices data if successful,
 * or an error message if the fetch fails.
 */

export async function GET(): Promise<NextResponse> {
  console.log("Fetching reports")
  const report = await fetchPrices()
  if (!report.success) {
    return NextResponse.json({ success: false, error: report.error })
  }
  return NextResponse.json({ success: true, data: report.data })
}
