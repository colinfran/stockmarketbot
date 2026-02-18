import { FC } from "react"
import { TrendingDown, ChartCandlestick, TrendingUp } from "lucide-react"
import TextWithLinks from "../text-with-link"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

type StockRecommendation = {
  asset_type?: "stock"
  allocation: number
  ticker: string
  rationale: string
  action?: "buy" | "sell"
}

type OptionVerticalSpreadRecommendation = {
  asset_type: "option_vertical_spread"
  underlying_ticker: string
  option_type: "call" | "put"
  expiration_date: string
  contracts: number
  allocation: number
  rationale: string
}

type Recommendation = StockRecommendation | OptionVerticalSpreadRecommendation

type RecommendationsType = {
  recommendations: Recommendation[]
}

const isOptionRecommendation = (rec: Recommendation): rec is OptionVerticalSpreadRecommendation =>
  rec.asset_type === "option_vertical_spread"

const isStockRecommendation = (rec: Recommendation): rec is StockRecommendation =>
  rec.asset_type !== "option_vertical_spread"

const Recommendations: FC<RecommendationsType> = ({ recommendations }) => {
  const stockRecommendations = recommendations.filter(isStockRecommendation)
  const buyRecommendations = stockRecommendations.filter((rec) => rec.action !== "sell")
  const sellRecommendations = stockRecommendations.filter((rec) => rec.action === "sell")
  const optionRecommendations = recommendations.filter(isOptionRecommendation)
  const stockBuyTotal = buyRecommendations.reduce((sum, rec) => sum + rec.allocation, 0)
  const optionTotal = optionRecommendations.reduce((sum, rec) => sum + rec.allocation, 0)

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Recommended Stock Buys</CardTitle>
          </div>
          <CardDescription>
            Suggested buy allocation (dedicated $100 stock budget, total should be 100%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm font-medium">Stock buy total: {stockBuyTotal}%</p>
          <div className="space-y-4">
            {buyRecommendations.map((rec, idx) => (
              <div
                className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                key={`${rec.ticker}-${idx}`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{rec.ticker}</p>
                    <Badge className="text-xs" variant="secondary">
                      {rec.allocation}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <TextWithLinks text={rec.rationale} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {sellRecommendations.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              <CardTitle>Recommended Stock Sells</CardTitle>
            </div>
            <CardDescription>Suggested position reductions or exits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellRecommendations.map((rec, idx) => (
                <div
                  className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  key={`${rec.ticker}-sell-${idx}`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">{rec.ticker}</p>
                      <Badge className="text-xs" variant="secondary">
                        {rec.allocation}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <TextWithLinks text={rec.rationale} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* {optionRecommendations.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ChartCandlestick className="h-5 w-5" />
              <CardTitle>Vertical Spread Options</CardTitle>
            </div>
            <CardDescription>
              Additional options strategies (separate dedicated $100 options budget)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm font-medium">Options allocation total: {optionTotal}%</p>
            <div className="space-y-4">
              {optionRecommendations.map((rec, idx) => (
                <div
                  className="rounded-lg border border-border p-4"
                  key={`${rec.underlying_ticker}-option-${idx}`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-lg">{rec.underlying_ticker}</p>
                      <Badge className="text-xs" variant="secondary">
                        {rec.option_type.toUpperCase()} Vertical
                      </Badge>
                      <Badge className="text-xs" variant="outline">
                        {rec.allocation}%
                      </Badge>
                    </div>

                    <div className="grid gap-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">
                          {rec.option_type === "call" ? "Bull Call Spread" : "Bear Put Spread"}
                        </span>{" "}
                        - {rec.option_type === "call" ? "Bullish setup" : "Bearish setup"}
                      </p>
                      <p>Target expiration: {rec.expiration_date}</p>
                      <p>
                        Target contracts: {rec.contracts} | Allocation: {rec.allocation}% of options
                        budget
                      </p>
                    </div>

                    <div className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                      Exact strikes, option symbols, and entry debit are selected live at execution
                      time (market open) from the current option chain.
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <TextWithLinks text={rec.rationale} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}
    </>
  )
}

export default Recommendations
