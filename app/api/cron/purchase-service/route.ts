import { NextResponse } from "next/server"
import { fetchLatestReport } from "./fetch"
import { purchase } from "./purchase"
import { addToDb } from "./update"
import { sendNotification } from "../push"
import { alpaca } from "../../index"

const getNyDateString = (date: Date): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

/**
 * Cron route handler for executing trades based on the latest AI-generated market report.
 * @description This GET endpoint is intended to be called by a scheduled cron job.
 * It validates a secret authorization header, fetches the latest market report, executes
 * buy/sell orders via the Alpaca API, stores the executed orders in the database,
 * and returns a JSON response indicating success or failure.
 *
 * Steps:
 * 1. Validate the Authorization header against `process.env.CRON_SECRET`.
 * 2. Fetch the latest market report using `fetchLatestReport`.
 * 3. Execute trade orders for each recommendation using `purchase`.
 * 4. Insert submitted orders into the database via `addToDb`.
 * 5. Return a JSON response indicating the result.
 *
 * @function GET
 * @param {Request} request The incoming Next.js Request object.
 * @returns {Promise<NextResponse>} A Next.js Response object.
 * Returns 401 Unauthorized if the secret is invalid.
 * Returns `{ success: true }` if all orders were successfully executed and stored.
 * Returns `{ success: false, error: string }` if any step fails.
 */

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }
  console.log("Running purchase service cron")
  const clock = await alpaca.getClock()
  if (!clock.is_open) {
    const today = getNyDateString(new Date())
    const calendar = await alpaca.getCalendar({ start: today, end: today })
    if (!Array.isArray(calendar) || calendar.length === 0) {
      console.log("Market holiday detected; skipping execution")
      return NextResponse.json({ success: false, error: "Market holiday" })
    }
    console.log("Market closed; skipping execution")
    return NextResponse.json({ success: false, error: "Market closed" })
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
  const title = `Trade execution completed - ${formattedDate}`
  const description = executedOrders
    .map(
      (o) =>
        `${(o.side || "buy").toUpperCase()} ${o.symbol || "MULTILEG"}: ${o.filled_qty} @ $${o.filled_avg_price}`,
    )
    .join("; ")
  await sendNotification(title, description)
  console.log("Finished purchase service cron")
  return NextResponse.json({ success: true })
}
