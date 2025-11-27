import { NextResponse } from "next/server"
import { fetchLatestReport } from "./fetch"
import { purchase } from "./alpaca"
import { addToDb } from "./update"

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }
  console.log("Running purchase service cron")
  const latestReport = await fetchLatestReport()
  if (!latestReport.success) {
    return NextResponse.json({ success: false, error: latestReport.error })
  }
  const purchasedStocks = await purchase(latestReport.data!)
  if (!purchasedStocks.success) {
    return NextResponse.json({ success: false, error: latestReport.error })
  }
  const submitted = await addToDb(purchasedStocks.data!, latestReport!.data!.id!)
  if (!submitted.success) {
    return NextResponse.json({ success: false, error: latestReport.error })
  }
  console.log("Running successfully finished with no errors.")
  return NextResponse.json({ success: true })
}
