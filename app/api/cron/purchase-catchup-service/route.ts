import { NextResponse } from "next/server"
import { alpaca } from "../../index"
import { db } from "@/lib/db"
import { marketReports, tradeOrders } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { withRetry } from "@/lib/db/retry"
import { fetchLatestReport } from "../purchase-service/fetch"
import { purchase } from "../purchase-service/purchase"
import { addToDb } from "../purchase-service/update"
import { sendNotification } from "../push"

const getNyDateString = (date: Date): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

const getPtTimeParts = (date: Date): { weekday: string; hour: number; minute: number } => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return {
    weekday: lookup.weekday || "",
    hour: Number(lookup.hour || 0),
    minute: Number(lookup.minute || 0),
  }
}

const isWeekdayAfter630Pt = (date: Date): boolean => {
  const { weekday, hour, minute } = getPtTimeParts(date)
  const isWeekday = weekday !== "Sat" && weekday !== "Sun" && weekday !== "Mon"
  if (!isWeekday) return false
  if (hour > 6) return true
  return hour === 6 && minute >= 30
}

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }
  console.log("Running purchase catch-up cron")

  // skips monday as the main purchase cron runs at 6:30am PT on mondays
  if (!isWeekdayAfter630Pt(new Date())) {
    return NextResponse.json({ success: true, skipped: true, reason: "Outside schedule" })
  }

  const clock = await alpaca.getClock()
  if (!clock.is_open) {
    const today = getNyDateString(new Date())
    const calendar = await alpaca.getCalendar({ start: today, end: today })
    if (!Array.isArray(calendar) || calendar.length === 0) {
      console.log("Market holiday detected; skipping catch-up")
      return NextResponse.json({ success: true, skipped: true, reason: "Market holiday" })
    }
    console.log("Market closed; skipping catch-up")
    return NextResponse.json({ success: true, skipped: true, reason: "Market closed" })
  }

  const latestReportMeta = await withRetry(() =>
    db
      .select({ id: marketReports.id })
      .from(marketReports)
      .orderBy(desc(marketReports.created_at))
      .limit(1),
  )

  if (!latestReportMeta[0]?.id) {
    return NextResponse.json({ success: true, skipped: true, reason: "No market reports" })
  }

  const existingOrder = await withRetry(() =>
    db
      .select({ id: tradeOrders.id })
      .from(tradeOrders)
      .where(eq(tradeOrders.market_report_id, latestReportMeta[0].id))
      .limit(1),
  )

  if (existingOrder.length > 0) {
    return NextResponse.json({ success: true, skipped: true, reason: "Already purchased" })
  }

  const latestReport = await fetchLatestReport()
  if (!latestReport.success || !latestReport.data) {
    return NextResponse.json({ success: false, error: latestReport.error })
  }

  const purchasedStocks = await purchase(latestReport.data, latestReport.data.id)
  if (!purchasedStocks.success) {
    return NextResponse.json({ success: false, error: purchasedStocks.error })
  }

  const executedOrders = purchasedStocks.data ?? []
  const submitted = await addToDb(executedOrders, latestReport.data.id)
  if (!submitted.success) {
    return NextResponse.json({ success: false, error: submitted.error })
  }

  console.log("Sending notifications")
  const date = new Date()
  const pstDate = new Date(date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
  const formattedDate = `${pstDate.getMonth() + 1}/${pstDate.getDate()}/${pstDate
    .getFullYear()
    .toString()
    .slice(-2)}`
  const title = `Trade execution completed (catch-up) - ${formattedDate}`
  const description = executedOrders
    .map(
      (o) =>
        `${(o.side || "buy").toUpperCase()} ${o.symbol || "MULTILEG"}: ${o.filled_qty} @ $${o.filled_avg_price}`,
    )
    .join("; ")
  await sendNotification(title, description)

  console.log("Finished purchase catch-up cron")
  return NextResponse.json({ success: true })
}
