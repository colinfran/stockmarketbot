import { NextResponse } from "next/server"
import { generateWeeklyReport } from "./generate"
import { addToDb } from "./update"

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
  return NextResponse.json({ success: true })
}
