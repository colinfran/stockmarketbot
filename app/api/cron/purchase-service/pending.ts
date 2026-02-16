import { db } from "@/lib/db"
import { pendingSpreadOrders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { MarketReportSchema } from "../ai-service/schema"
import { NoData, Response } from "../../types"

type Recommendation = Extract<
  MarketReportSchema["recommendations"][number],
  { asset_type: "option_vertical_spread" }
>

type PendingSpreadOrder = {
  id: string
  market_report_id: string
  recommendation: Recommendation
  attempts: number
  created_at: Date
  last_attempt_at?: Date | null
  last_order_id?: string | null
  last_status?: string | null
  last_error?: string | null
}

type PendingInsert = {
  marketReportId: string
  recommendation: Recommendation
  orderId?: string
  status?: string
  error?: string
}

export const addPendingSpreadOrder = async (insert: PendingInsert): Promise<Response<NoData>> => {
  try {
    await db.insert(pendingSpreadOrders).values({
      market_report_id: insert.marketReportId,
      recommendation: insert.recommendation,
      attempts: 1,
      last_attempt_at: new Date(),
      last_order_id: insert.orderId || null,
      last_status: insert.status || null,
      last_error: insert.error || null,
    })
    return { success: true }
  } catch (error) {
    console.error("Error adding pending spread order:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const fetchPendingSpreadOrders = async (
  limit: number,
): Promise<Response<PendingSpreadOrder[]>> => {
  try {
    const rows = await db.select().from(pendingSpreadOrders).limit(limit)
    return { success: true, data: rows as unknown as PendingSpreadOrder[] }
  } catch (error) {
    console.error("Error fetching pending spread orders:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const fetchPendingSpreadOrdersByReport = async (
  reportId: string,
  limit: number,
): Promise<Response<PendingSpreadOrder[]>> => {
  try {
    const rows = await db
      .select()
      .from(pendingSpreadOrders)
      .where(eq(pendingSpreadOrders.market_report_id, reportId))
      .limit(limit)
    return { success: true, data: rows as unknown as PendingSpreadOrder[] }
  } catch (error) {
    console.error("Error fetching pending spread orders by report:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const updatePendingSpreadOrder = async (
  id: string,
  patch: Partial<
    Pick<
      PendingSpreadOrder,
      "attempts" | "last_attempt_at" | "last_order_id" | "last_status" | "last_error"
    >
  >,
): Promise<Response<NoData>> => {
  try {
    await db.update(pendingSpreadOrders).set(patch).where(eq(pendingSpreadOrders.id, id))
    return { success: true }
  } catch (error) {
    console.error("Error updating pending spread order:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const deletePendingSpreadOrder = async (id: string): Promise<Response<NoData>> => {
  try {
    await db.delete(pendingSpreadOrders).where(eq(pendingSpreadOrders.id, id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting pending spread order:", error)
    return { success: false, error: (error as Error).message }
  }
}
