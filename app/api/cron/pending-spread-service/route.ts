import { NextResponse } from "next/server"
import { alpaca } from "../../index"
import { db } from "@/lib/db"
import { marketReports } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { addToDb } from "../purchase-service/update"
import { attemptVerticalSpread } from "../purchase-service/purchase"
import {
  deletePendingSpreadOrder,
  fetchPendingSpreadOrdersByReport,
  updatePendingSpreadOrder,
} from "../purchase-service/pending"

type SpreadRecommendation = Parameters<typeof attemptVerticalSpread>[0]

const OPTIONS_BUDGET = 100
const SPREAD_WAIT_MS = 30_000
const MAX_PENDING_PER_RUN = 5
const TIME_BUDGET_MS = 240_000

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

const isMondayAfter635Pt = (date: Date): boolean => {
  const { weekday, hour, minute } = getPtTimeParts(date)
  if (weekday !== "Mon") return false
  if (hour > 6) return true
  return hour === 6 && minute >= 35
}

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    })
  }
  console.log("Running pending spread retry cron")

  if (!isMondayAfter630Pt(new Date())) {
    return NextResponse.json({ success: true, skipped: true, reason: "Outside schedule" })
  }

  const clock = await alpaca.getClock()
  if (!clock.is_open) {
    const today = getNyDateString(new Date())
    const calendar = await alpaca.getCalendar({ start: today, end: today })
    if (!Array.isArray(calendar) || calendar.length === 0) {
      console.log("Market holiday detected; skipping pending spreads")
      return NextResponse.json({ success: true, skipped: true, reason: "Market holiday" })
    }
    console.log("Market closed; skipping pending spreads")
    return NextResponse.json({ success: true, skipped: true, reason: "Market closed" })
  }

  const latestReport = await db
    .select({ id: marketReports.id })
    .from(marketReports)
    .orderBy(desc(marketReports.created_at))
    .limit(1)

  if (!latestReport[0]?.id) {
    return NextResponse.json({ success: true, skipped: true, reason: "No market reports" })
  }

  const pending = await fetchPendingSpreadOrdersByReport(
    latestReport[0].id,
    MAX_PENDING_PER_RUN,
  )
  if (!pending.success) {
    return NextResponse.json({ success: false, error: pending.error })
  }

  const rows = pending.data ?? []
  if (rows.length === 0) {
    return NextResponse.json({ success: true, data: { processed: 0, filled: 0 } })
  }

  const started = Date.now()
  let filled = 0

  for (const row of rows) {
    if (Date.now() - started > TIME_BUDGET_MS) {
      console.warn("Time budget exceeded; stopping pending spread retries")
      break
    }

    const recommendation = row.recommendation as SpreadRecommendation
    if (!recommendation || recommendation.asset_type !== "option_vertical_spread") {
      await updatePendingSpreadOrder(row.id, {
        attempts: Number(row.attempts || 0) + 1,
        last_attempt_at: new Date(),
        last_error: "Invalid recommendation payload",
      })
      continue
    }

    const spreadBudget = OPTIONS_BUDGET * (Number(recommendation.allocation || 0) / 100)
    const attempt = await attemptVerticalSpread(recommendation, spreadBudget, SPREAD_WAIT_MS)

    if (attempt.status === "filled") {
      const saved = await addToDb([attempt.order], row.market_report_id)
      if (saved.success) {
        await deletePendingSpreadOrder(row.id)
        filled += 1
      } else {
        await updatePendingSpreadOrder(row.id, {
          attempts: Number(row.attempts || 0) + 1,
          last_attempt_at: new Date(),
          last_error: saved.error || "Failed to store filled order",
        })
      }
      continue
    }

    if (attempt.status === "pending") {
      await updatePendingSpreadOrder(row.id, {
        attempts: Number(row.attempts || 0) + 1,
        last_attempt_at: new Date(),
        last_order_id: attempt.orderId,
        last_status: attempt.orderStatus,
        last_error: attempt.reason,
      })
      continue
    }

    await updatePendingSpreadOrder(row.id, {
      attempts: Number(row.attempts || 0) + 1,
      last_attempt_at: new Date(),
      last_error: attempt.reason,
    })
  }

  console.log("Finished pending spread retry cron")
  return NextResponse.json({ success: true, data: { processed: rows.length, filled } })
}
