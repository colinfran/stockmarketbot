// get the latest report
import { NextResponse } from "next/server"
import { fetchPrices } from "./fetch"

export async function GET(): Promise<NextResponse> {
  console.log("Fetching reports")
  const report = await fetchPrices()
  if (!report.success) {
    return NextResponse.json({ success: false, error: report.error })
  }
  return NextResponse.json({ success: true, data: report.data })
}
