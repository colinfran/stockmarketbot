// get the latest report
import { NextResponse } from "next/server"
import { fetchAllReports } from "./fetch"

export async function GET(): Promise<NextResponse> {
  console.log("Fetching reports")
  const report = await fetchAllReports()
  if (!report.success) {
    return NextResponse.json({ success: false, data: report.data, error: report.error })
  }
  return NextResponse.json({ success: true, data: report.data })
}
