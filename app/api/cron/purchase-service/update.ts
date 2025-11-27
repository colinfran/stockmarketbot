import { db } from "@/lib/db"
import { tradeOrders } from "@/lib/db/schema"
import { AlpacaOrder, NoData, Response } from "../../types"

/**
 * Inserts an array of Alpaca trade orders into the database.
 * @description Cleans and formats each AlpacaOrder object, converts numeric fields to strings,
 * converts date strings to Date objects, and associates each order with a `market_report_id`.
 * Inserts the array into the `tradeOrders` table using Drizzle ORM.
 *
 * @function addToDb
 * @param {AlpacaOrder[]} arr Array of AlpacaOrder objects to store in the database.
 * @param {string} id The market report ID to associate with these trade orders.
 * @returns {Promise<Response<NoData>>} A promise resolving to a Response object.
 * If successful, `success` is true and no data is returned.
 * If there is an error, `success` is false and `error` contains the error message.
 */

export const addToDb = async (arr: AlpacaOrder[], id: string): Promise<Response<NoData>> => {
  console.log("Adding purchase to database")
  try {
    const arrClean = arr.map((order) => ({
      ...order,
      id: order.id,
      symbol: order.symbol,
      side: order.side,
      status: order.status,
      notional: order.notional != null ? String(order.notional) : null,
      qty: order.qty != null ? String(order.qty) : null,
      filled_qty: order.filled_qty != null ? String(order.filled_qty) : null,
      filled_avg_price: order.filled_avg_price != null ? String(order.filled_avg_price) : null,
      created_at: new Date(order.created_at),
      submitted_at: new Date(order.submitted_at),
      filled_at: order.filled_at ? new Date(order.filled_at) : null,
      expires_at: order.expires_at ? new Date(order.expires_at) : null,
      market_report_id: id,
    }))
    await db.insert(tradeOrders).values(arrClean)
    console.log("Successfully added stock purchases to database")
    return { success: true }
  } catch (error) {
    console.error("Error adding stock purchases to database:", error)
    return { success: false, error: error as string }
  }
}
