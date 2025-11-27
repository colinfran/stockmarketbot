// get the latest report
import { NextResponse } from "next/server"
import { fetchAllTradeOrders } from "./fetch"

export async function GET(): Promise<NextResponse> {
  console.log("Fetching trade orders")
  const orders = await fetchAllTradeOrders()
  if (!orders.success) {
    return NextResponse.json({ success: false, error: orders.error })
  }
  return NextResponse.json({ success: true, data: orders.data })
}
