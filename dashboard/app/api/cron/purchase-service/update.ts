import { db } from "@/lib/db"
import { tradeOrders } from "@/lib/db/schema"

type Response = {
  success: boolean
  error?: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addToDb = async (arr: any, id: string): Promise<Response> => {
  console.log("Adding purchase to database")
  try {
    const arrClean = arr.map((order) => ({
      ...order,
      notional: order.notional ?? null,
      qty: order.qty ?? null,
      filled_qty: order.filled_qty ?? null,
      filled_avg_price: order.filled_avg_price ?? null,
      created_at: order.created_at instanceof Date ? order.created_at : new Date(order.created_at),
      submitted_at:
        order.submitted_at instanceof Date ? order.submitted_at : new Date(order.submitted_at),
      filled_at: order.filled_at instanceof Date ? order.filled_at : null, // can be null if not filled yet
      expires_at: order.expires_at instanceof Date ? order.expires_at : new Date(order.expires_at),
      market_report_id: id,
    }))
    await db.insert(tradeOrders).values(arrClean)
    console.log("Successfully added stock purchases to database")
    return { success: true }
  } catch (error) {
    console.error("Error adding stock purchases to database:", error)
    return { success: false, error: (error as Error).message }
  }
}
