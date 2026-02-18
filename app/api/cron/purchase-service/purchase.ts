import { MarketReportSchema } from "../ai-service/schema"
import { AlpacaOrder, Response } from "../../types"
import { alpaca } from "../../index"
import { addPendingSpreadOrder } from "./pending"

/**
 * Executes trade orders based on the latest AI-generated market report.
 * @description Takes a MarketReportSchema object containing stock and option recommendations,
 * validates allocation constraints, then places stock and options orders via Alpaca.
 *
 * Order of execution:
 * 1. Stock buys/sells using the $100 stock budget.
 * 2. Vertical spread options using a separate $100 options budget.
 */

type PositionSnapshot = {
  symbol: string
  qty: string
}

type Recommendation = MarketReportSchema["recommendations"][number]
type StockRecommendation = Extract<Recommendation, { asset_type: "stock" }>
type OptionVerticalSpreadRecommendation = Extract<
  Recommendation,
  { asset_type: "option_vertical_spread" }
>

type ParsedOptionSymbol = {
  underlying: string
  expirationYYMMDD: string
  optionType: "call" | "put"
  strike: number
}

type OptionSnapshotLike = {
  Symbol?: string
  LatestQuote?: {
    BidPrice?: number
    AskPrice?: number
  }
}

type OptionCandidate = {
  symbol: string
  expirationYYMMDD: string
  strike: number
  optionType: "call" | "put"
  bid: number
  ask: number
  mid: number
}

type VerticalSelection = {
  longLeg: OptionCandidate
  shortLeg: OptionCandidate
  limitDebit: number
}

type SpreadAttemptResult =
  | { status: "filled"; order: AlpacaOrder }
  | { status: "pending"; orderId: string; orderStatus: string; reason: string }
  | { status: "skipped"; reason: string }

const waitForWarm = async (): Promise<void> => {
  let ready = false
  while (!ready) {
    const clock = await alpaca.getClock()
    if (clock.is_open) {
      ready = true
    } else {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
}

const waitForTerminal = async (orderId: string): Promise<AlpacaOrder> => {
  const terminalStatuses = new Set([
    "filled",
    "canceled",
    "expired",
    "replaced",
    "pending_cancel",
    "stopped",
    "rejected",
    "suspended",
    "calculated",
  ])

  const maxAttempts = 240 // 2 minutes @ 500ms
  let attempts = 0
  let order = (await alpaca.getOrder(orderId)) as AlpacaOrder

  while (!terminalStatuses.has(order.status)) {
    await new Promise((r) => setTimeout(r, 500))
    order = (await alpaca.getOrder(orderId)) as AlpacaOrder
    attempts += 1
    if (attempts >= maxAttempts) {
      throw new Error(`Timed out waiting for order ${orderId} to reach terminal status`)
    }
  }

  if (order.status !== "filled") {
    throw new Error(`Order ${orderId} completed with non-filled status: ${order.status}`)
  }

  return order
}

const waitForFillOrTimeout = async (orderId: string, timeoutMs: number): Promise<AlpacaOrder> => {
  const terminalStatuses = new Set([
    "filled",
    "canceled",
    "expired",
    "replaced",
    "pending_cancel",
    "stopped",
    "rejected",
    "suspended",
    "calculated",
  ])

  const start = Date.now()
  let order = (await alpaca.getOrder(orderId)) as AlpacaOrder

  while (!terminalStatuses.has(order.status) && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 500))
    order = (await alpaca.getOrder(orderId)) as AlpacaOrder
  }

  return order
}

const cancelOrderSafe = async (orderId: string): Promise<void> => {
  try {
    await alpaca.cancelOrder(orderId)
  } catch (error) {
    console.warn(`Failed to cancel order ${orderId}:`, error)
  }
}

const roundQty = (value: number): number => {
  return Math.floor(value * 1_000_000) / 1_000_000
}

const parseOccOptionSymbol = (symbol: string): ParsedOptionSymbol | null => {
  const trimmed = symbol.trim()
  const match = /^([A-Z]{1,6})(\d{6})([CP])(\d{8})$/.exec(trimmed)
  if (!match) return null

  const [, underlying, expirationYYMMDD, cpFlag, strikeRaw] = match
  return {
    underlying,
    expirationYYMMDD,
    optionType: cpFlag === "C" ? "call" : "put",
    strike: Number(strikeRaw) / 1000,
  }
}

const toYYMMDD = (date: Date): string => {
  const yy = String(date.getUTCFullYear()).slice(-2)
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(date.getUTCDate()).padStart(2, "0")
  return `${yy}${mm}${dd}`
}

const getUnderlyingPrice = async (symbol: string): Promise<number | null> => {
  try {
    const trade = (await alpaca.getLatestTrade(symbol)) as { Price?: number }
    const price = Number(trade?.Price)
    return Number.isFinite(price) && price > 0 ? price : null
  } catch (error) {
    console.warn(`Failed to fetch latest trade for ${symbol}:`, error)
    return null
  }
}

const getChainCandidates = async (
  recommendation: OptionVerticalSpreadRecommendation,
  spot: number,
): Promise<OptionCandidate[]> => {
  const strikeLow = Number((spot * 0.85).toFixed(2))
  const strikeHigh = Number((spot * 1.15).toFixed(2))

  const snapshots = (await alpaca.getOptionChain(recommendation.underlying_ticker, {
    expiration_date: recommendation.expiration_date,
    strike_price_gte: strikeLow,
    strike_price_lte: strikeHigh,
  })) as OptionSnapshotLike[]

  const raw = Array.isArray(snapshots) ? snapshots : []

  return raw
    .map((snapshot) => {
      const symbol = snapshot.Symbol || ""
      const parsed = parseOccOptionSymbol(symbol)
      if (!parsed) return null

      const bid = Number(snapshot.LatestQuote?.BidPrice ?? 0)
      const ask = Number(snapshot.LatestQuote?.AskPrice ?? 0)
      if (!Number.isFinite(bid) || !Number.isFinite(ask) || ask <= 0) return null

      return {
        symbol,
        expirationYYMMDD: parsed.expirationYYMMDD,
        strike: parsed.strike,
        optionType: parsed.optionType,
        bid,
        ask,
        mid: (bid + ask) / 2,
      } as OptionCandidate
    })
    .filter((x): x is OptionCandidate => Boolean(x))
    .filter((x) => x.optionType === recommendation.option_type)
}

const pickNearestExpiry = (
  candidates: OptionCandidate[],
  targetExpirationDate: string,
): OptionCandidate[] => {
  if (candidates.length === 0) return []

  const targetDate = new Date(`${targetExpirationDate}T00:00:00Z`)
  const targetYYMMDD = Number.isNaN(targetDate.getTime()) ? null : toYYMMDD(targetDate)

  const expirations = [...new Set(candidates.map((c) => c.expirationYYMMDD))]
  if (expirations.length === 0) return []

  const selectedExpiration =
    targetYYMMDD && expirations.includes(targetYYMMDD) ? targetYYMMDD : expirations.sort()[0]

  return candidates.filter((c) => c.expirationYYMMDD === selectedExpiration)
}

const selectVerticalSpread = (
  recommendation: OptionVerticalSpreadRecommendation,
  spot: number,
  candidates: OptionCandidate[],
): VerticalSelection | null => {
  const strikesAsc = [...new Set(candidates.map((c) => c.strike))].sort((a, b) => a - b)
  if (strikesAsc.length < 2) return null

  const nearestStrike = strikesAsc.reduce((best, current) => {
    return Math.abs(current - spot) < Math.abs(best - spot) ? current : best
  }, strikesAsc[0])

  let longStrike: number | null = null
  let shortStrike: number | null = null

  if (recommendation.option_type === "call") {
    const longIdx = strikesAsc.findIndex((s) => s >= nearestStrike)
    const idx = longIdx >= 0 ? longIdx : strikesAsc.length - 2
    longStrike = strikesAsc[idx]
    shortStrike = strikesAsc[idx + 1] ?? null
  } else {
    const longIdx = [...strikesAsc].reverse().find((s) => s <= nearestStrike)
    if (longIdx == null) return null
    longStrike = longIdx
    const lower = strikesAsc.filter((s) => s < longIdx)
    shortStrike = lower.length > 0 ? lower[lower.length - 1] : null
  }

  if (longStrike == null || shortStrike == null) return null

  const longLeg = candidates
    .filter((c) => c.strike === longStrike)
    .sort((a, b) => b.bid + b.ask - (a.bid + a.ask))[0]
  const shortLeg = candidates
    .filter((c) => c.strike === shortStrike)
    .sort((a, b) => b.bid + b.ask - (a.bid + a.ask))[0]

  if (!longLeg || !shortLeg) return null

  const conservativeDebit = longLeg.ask - shortLeg.bid
  const midDebit = longLeg.mid - shortLeg.mid
  const rawDebit = conservativeDebit > 0 ? conservativeDebit : midDebit
  const limitDebit = Number(Math.max(rawDebit, 0.01).toFixed(2))

  if (!Number.isFinite(limitDebit) || limitDebit <= 0) return null

  return {
    longLeg,
    shortLeg,
    limitDebit,
  }
}

const isOptionRecommendation = (rec: Recommendation): rec is OptionVerticalSpreadRecommendation =>
  rec.asset_type === "option_vertical_spread"

const isStockRecommendation = (rec: Recommendation): rec is StockRecommendation =>
  rec.asset_type === "stock"

export const attemptVerticalSpread = async (
  recommendation: OptionVerticalSpreadRecommendation,
  spreadBudget: number,
  maxWaitMs: number,
): Promise<SpreadAttemptResult> => {
  if (spreadBudget <= 0) {
    return {
      status: "skipped",
      reason: `Allocation is <= 0 for ${recommendation.underlying_ticker}`,
    }
  }

  const spot = await getUnderlyingPrice(recommendation.underlying_ticker)
  if (!spot) {
    return {
      status: "skipped",
      reason: `No live underlying price for ${recommendation.underlying_ticker}`,
    }
  }

  const candidates = await getChainCandidates(recommendation, spot)
  const expiryCandidates = pickNearestExpiry(candidates, recommendation.expiration_date)
  if (expiryCandidates.length < 2) {
    return {
      status: "skipped",
      reason: `Insufficient live chain candidates for ${recommendation.underlying_ticker}`,
    }
  }

  const selected = selectVerticalSpread(recommendation, spot, expiryCandidates)
  if (!selected) {
    return {
      status: "skipped",
      reason: `No valid vertical found for ${recommendation.underlying_ticker}`,
    }
  }

  const maxAffordableContracts = Math.floor(spreadBudget / (selected.limitDebit * 100))
  const contractsToTrade = Math.min(recommendation.contracts, maxAffordableContracts)
  if (contractsToTrade < 1) {
    return {
      status: "skipped",
      reason: `Budget $${spreadBudget.toFixed(2)} too low for live debit ${selected.limitDebit}`,
    }
  }

  console.log(
    `Placing ${recommendation.option_type.toUpperCase()} vertical spread for ${recommendation.underlying_ticker} ` +
      `(${contractsToTrade} contracts, live debit ${selected.limitDebit})`,
  )

  const order = (await alpaca.createOrder({
    qty: contractsToTrade,
    side: "buy",
    type: "limit",
    time_in_force: "day",
    order_class: "mleg",
    limit_price: selected.limitDebit,
    legs: [
      {
        symbol: selected.longLeg.symbol,
        ratio_qty: 1,
        side: "buy",
      },
      {
        symbol: selected.shortLeg.symbol,
        ratio_qty: 1,
        side: "sell",
      },
    ],
  })) as AlpacaOrder

  const finalOrder = await waitForFillOrTimeout(order.id, maxWaitMs)
  if (finalOrder.status === "filled") {
    return { status: "filled", order: finalOrder }
  }

  await cancelOrderSafe(order.id)
  return {
    status: "pending",
    orderId: order.id,
    orderStatus: finalOrder.status,
    reason: `Order not filled (${finalOrder.status})`,
  }
}

export const purchase = async (
  latestReport: MarketReportSchema,
  reportId: string,
): Promise<Response<AlpacaOrder[]>> => {
  try {
    await waitForWarm()

    const stockBudget = 100
    const optionsBudget = 100

    const stockRecommendations = latestReport.recommendations.filter(isStockRecommendation)
    const optionRecommendations = latestReport.recommendations.filter(isOptionRecommendation)

    const buyRecommendations = stockRecommendations.filter((item) => item.action === "buy")
    const sellRecommendations = stockRecommendations.filter((item) => item.action === "sell")

    const totalBuyPercent = buyRecommendations.reduce((sum, x) => sum + x.allocation, 0)
    if (buyRecommendations.length > 0 && totalBuyPercent !== 100) {
      throw new Error("Buy allocation percentages must total 100")
    }

    const totalOptionsPercent = optionRecommendations.reduce((sum, x) => sum + x.allocation, 0)
    if (totalOptionsPercent > 100) {
      throw new Error("Options allocation percentages must be <= 100")
    }

    const executedOrders: AlpacaOrder[] = []

    // 1) Execute stock buys
    for (const item of buyRecommendations) {
      const allocationAmount = stockBudget * (item.allocation / 100)
      console.log(`Buying ~$${allocationAmount.toFixed(2)} of ${item.ticker}`)

      const order = (await alpaca.createOrder({
        symbol: item.ticker,
        notional: String(allocationAmount),
        side: "buy",
        type: "market",
        time_in_force: "day",
      })) as AlpacaOrder

      const filledOrder = await waitForTerminal(order.id)
      executedOrders.push(filledOrder)
    }

    // 2) Execute stock sells
    if (sellRecommendations.length > 0) {
      const positions = (await alpaca.getPositions()) as PositionSnapshot[]
      const qtyBySymbol = new Map<string, number>(
        positions.map((position) => [position.symbol, Number(position.qty)]),
      )

      for (const item of sellRecommendations) {
        const heldQty = qtyBySymbol.get(item.ticker) || 0

        if (heldQty <= 0) {
          console.warn(`Skipping sell for ${item.ticker}: no position held`)
          continue
        }

        if (item.allocation <= 0 || item.allocation > 100) {
          console.warn(
            `Skipping sell for ${item.ticker}: invalid sell allocation ${item.allocation}`,
          )
          continue
        }

        const qtyToSell = roundQty((heldQty * item.allocation) / 100)
        if (qtyToSell <= 0) {
          console.warn(`Skipping sell for ${item.ticker}: computed sell quantity is 0`)
          continue
        }

        console.log(
          `Selling ${qtyToSell} shares of ${item.ticker} (${item.allocation}% of ${heldQty})`,
        )
        const order = (await alpaca.createOrder({
          symbol: item.ticker,
          qty: String(qtyToSell),
          side: "sell",
          type: "market",
          time_in_force: "day",
        })) as AlpacaOrder

        const filledOrder = await waitForTerminal(order.id)
        executedOrders.push(filledOrder)
      }
    }

    // 3) Execute option vertical spreads (after stock trades), priced from live chain data.
    for (const item of optionRecommendations) {
      const spreadBudget = optionsBudget * (item.allocation / 100)
      const attempt = await attemptVerticalSpread(item, spreadBudget, 30_000)

      if (attempt.status === "filled") {
        executedOrders.push(attempt.order)
        continue
      }

      if (attempt.status === "pending") {
        console.warn(
          `Spread order pending for ${item.underlying_ticker}; will retry later (${attempt.orderStatus})`,
        )
        const pending = await addPendingSpreadOrder({
          marketReportId: reportId,
          recommendation: item,
          orderId: attempt.orderId,
          status: attempt.orderStatus,
          error: attempt.reason,
        })
        if (!pending.success) {
          console.warn(`Failed to store pending spread: ${pending.error}`)
        }
        continue
      }

      console.warn(`Skipping spread for ${item.underlying_ticker}: ${attempt.reason}`)
    }

    return {
      success: true,
      data: executedOrders,
    }
  } catch (err) {
    console.error("Error placing orders:", err)
    return {
      success: false,
      error: `${err}`,
    }
  }
}
