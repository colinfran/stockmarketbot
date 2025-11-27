import { db } from "@/lib/db"
import { tradeOrders } from "@/lib/db/schema"
import { AlpacaOrder, Response } from "../types"

export const fetchAllTradeOrders = async (): Promise<Response<AlpacaOrder[]>> => {
  console.log("Get all tradeOrders from database")
  try {
    const data = await db.select().from(tradeOrders)
    console.log("Successfully fetched tradeOrders from database")
    return { success: true, data: data as unknown as AlpacaOrder[] }
  } catch (error) {
    console.error("Error fetching tradeOrders from database:", error)
    return { success: false, error: (error as Error).message }
  }
}
