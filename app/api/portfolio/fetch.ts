import { db } from "@/lib/db"
import { tradeOrders } from "@/lib/db/schema"
import { AlpacaOrder, Response } from "../types"

/**
 * Fetches all trade orders from the database.
 * @description Uses the database client to select all entries from the tradeOrders table.
 * Returns a Response object containing either the list of trade orders or an error message.
 * @function fetchAllTradeOrders
 * @returns {Promise<Response<AlpacaOrder[]>>} A promise resolving to a Response object.
 * If successful, `success` is true and `data` contains an array of AlpacaOrder objects.
 * If there is an error, `success` is false and `error` contains the error message.
 */

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
