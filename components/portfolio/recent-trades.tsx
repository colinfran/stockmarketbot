import { FC } from "react"
import { AlpacaOrder } from "@/app/api/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type RecentTradesProps = {
  orders: AlpacaOrder[]
  limit?: number
}

const RecentTrades: FC<RecentTradesProps> = ({ orders, limit = 10 }) => {
  const recentOrders = [...orders]
    .sort((a, b) => {
      const aTime = new Date(a.filled_at || a.created_at).getTime()
      const bTime = new Date(b.filled_at || b.created_at).getTime()
      return bTime - aTime
    })
    .slice(0, limit)

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Recent Buys/Sells</CardTitle>
        <CardDescription>Most recent executed trades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left whitespace-nowrap">Symbol</TableHead>
                <TableHead className="text-left whitespace-nowrap">Side</TableHead>
                <TableHead className="text-left whitespace-nowrap">Date</TableHead>
                <TableHead className="text-right whitespace-nowrap">Shares</TableHead>
                <TableHead className="text-right whitespace-nowrap">Price</TableHead>
                <TableHead className="text-right whitespace-nowrap">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => {
                const shares =
                  typeof order.filled_qty === "string"
                    ? Number.parseFloat(order.filled_qty)
                    : Number(order.filled_qty)
                const price =
                  typeof order.filled_avg_price === "string"
                    ? Number.parseFloat(order.filled_avg_price)
                    : Number(order.filled_avg_price)
                const total = shares * price
                const date = new Date(order.filled_at || order.created_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )

                return (
                  <TableRow className="border-b border-border" key={order.id}>
                    <TableCell className="font-semibold whitespace-nowrap">
                      {order.symbol}
                    </TableCell>
                    <TableCell
                      className={`whitespace-nowrap ${
                        order.side === "buy" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {order.side.toUpperCase()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{date}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">{shares}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      ${price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      ${total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentTrades
