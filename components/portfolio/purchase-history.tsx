import { FC } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { AlpacaOrder } from "@/app/api/types"

type PurchaseHistoryType = {
  stockOrders: AlpacaOrder[]
}

const PurchaseHistory: FC<PurchaseHistoryType> = ({ stockOrders }) => {
  return (
    <div className="pt-4">
      <p className="text-sm text-muted-foreground mb-3">Purchase History</p>
      <div className="border border-border rounded-lg overflow-hidden mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Date</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockOrders.map((order) => {
              const filledQty =
                typeof order.filled_qty === "string"
                  ? Number.parseFloat(order.filled_qty)
                  : order.filled_qty
              const price = Number(order.filled_avg_price) || 0
              const total = filledQty * price
              const date = new Date(order.filled_at || order.created_at).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )

              return (
                <TableRow key={order.id}>
                  <TableCell>{date}</TableCell>
                  <TableCell className="text-right">{filledQty}</TableCell>
                  <TableCell className="text-right">${price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${total.toFixed(2)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PurchaseHistory
