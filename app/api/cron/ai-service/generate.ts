import { generateObject } from "ai"
import { MarketReportSchema, marketReportSchema } from "./schema"
import { format, nextMonday, subDays } from "date-fns"
import { Response } from "../../types"
import { alpaca, currentModel } from "../../index"

type PositionSnapshot = {
  symbol: string
  qty: string
  avg_entry_price: string
  market_value: string
  unrealized_plpc: string
}

type Recommendation = MarketReportSchema["recommendations"][number]
const MAX_SELL_ALLOCATION_PERCENT = 50

const roundTo2 = (value: number): number => Number(value.toFixed(2))

const normalizeToTarget = (values: number[], target: number): number[] => {
  if (values.length === 0) return []

  const positiveValues = values.map((v) => Math.max(v, 0))
  const currentTotal = positiveValues.reduce((sum, v) => sum + v, 0)

  const scaled =
    currentTotal > 0
      ? positiveValues.map((v) => (v / currentTotal) * target)
      : positiveValues.map(() => target / positiveValues.length)

  const rounded = scaled.map((v) => roundTo2(v))
  const roundedTotal = rounded.reduce((sum, v) => sum + v, 0)
  const delta = roundTo2(target - roundedTotal)

  if (Math.abs(delta) > 0.0001) {
    const idx = rounded.findIndex((v) => v === Math.max(...rounded))
    if (idx >= 0) {
      rounded[idx] = roundTo2(rounded[idx] + delta)
    }
  }

  return rounded
}

const normalizeRecommendations = (recommendations: Recommendation[]): Recommendation[] => {
  const normalized = recommendations.map((rec) => ({ ...rec }))

  const stockBuyIndices: number[] = []
  const stockBuyAllocations: number[] = []

  normalized.forEach((rec, idx) => {
    if (rec.asset_type === "stock" && rec.action === "buy") {
      stockBuyIndices.push(idx)
      stockBuyAllocations.push(Number(rec.allocation) || 0)
    }
  })

  if (stockBuyIndices.length > 0) {
    const fixedStockBuyAllocations = normalizeToTarget(stockBuyAllocations, 100)
    stockBuyIndices.forEach((idx, i) => {
      normalized[idx].allocation = fixedStockBuyAllocations[i]
    })
  }

  normalized.forEach((rec) => {
    if (rec.asset_type === "stock" && rec.action === "sell") {
      rec.allocation = Math.min(
        Math.max(roundTo2(Number(rec.allocation) || 0), 1),
        MAX_SELL_ALLOCATION_PERCENT,
      )
    }
  })

  return normalized
}

const getPositionSnapshot = async (): Promise<PositionSnapshot[]> => {
  try {
    const positions = (await alpaca.getPositions()) as PositionSnapshot[]
    return positions.map((position) => ({
      symbol: position.symbol,
      qty: position.qty,
      avg_entry_price: position.avg_entry_price,
      market_value: position.market_value,
      unrealized_plpc: position.unrealized_plpc,
    }))
  } catch (error) {
    console.error("Failed to fetch current positions from Alpaca:", error)
    return []
  }
}

/**
 * Generates a weekly US stock market report using AI analysis.
 * @description Uses AI to analyze historical and real-time market data, economic indicators, and social media sentiment.
 * The function predicts the stock market direction for the upcoming week, identifies promising and weak sectors,
 * and provides actionable recommendations with suggested allocations. All predictions are generated using real-time data
 * and tools, following a structured multi-step process.
 *
 * Steps performed:
 * 1. Fetch Historical and Real-Time Market Data for major indices and top tickers.
 * 2. Analyze Economic Indicators including CPI, unemployment, GDP, and Fed rate decisions.
 * 3. Gauge Social Media Sentiment from X (Twitter) and other sources for market trends.
 * 4. Identify Trends, Sectors, and Risks using momentum, volatility, sentiment, and short-term catalysts.
 * 5. Generate Predictions and Recommendations for next week’s market.
 *
 * Note: This is an educational simulation only and does not constitute financial advice.
 * @function generateWeeklyReport
 * @returns {Promise<Response<MarketReportSchema>>} A promise resolving to a Response object.
 * If successful, `success` is true and `data` contains the generated MarketReportSchema object.
 * If there is an error, `success` is false and `error` contains the error message.
 */

export const generateWeeklyReport = async (): Promise<Response<MarketReportSchema>> => {
  const today = new Date()
  const startDate = nextMonday(today)
  const sevenDaysAgo = subDays(today, 7)

  const todayStr = format(today, "yyyy-MM-dd")
  const startDateStr = format(startDate, "yyyy-MM-dd")
  const sevenDaysAgoStr = format(sevenDaysAgo, "yyyy-MM-dd")

  const month = format(today, "MMMM") // November
  const monthNum = format(today, "M") // 11
  const year = format(today, "yyyy") // 2025
  const day = format(today, "d") // 10
  const positions = await getPositionSnapshot()
  const positionsSummary =
    positions.length > 0
      ? positions
          .map(
            (position) =>
              `${position.symbol}: qty=${position.qty}, avg=${position.avg_entry_price}, market_value=${position.market_value}, unrealized_plpc=${position.unrealized_plpc}`,
          )
          .join("\n")
      : "No current holdings."

  const basePrompt = `
    You are an elite quantitative market analyst managing a live paper-trading portfolio. Your job is to produce a rigorous, data-backed weekly US stock market forecast with actionable trade recommendations.

    Today is ${todayStr}. Forecast the week starting ${startDateStr}.

    CURRENT PORTFOLIO (live from Alpaca):
    ${positionsSummary}

    ═══════════════════════════════════════════════════════════
    PHASE 1 — QUANTITATIVE DATA COLLECTION
    ═══════════════════════════════════════════════════════════

    1A. Price & Momentum (use code_execution + web_search in parallel)
    • Pull last 10 trading days OHLCV for SPY, QQQ, IWM, DIA, and sector ETFs
      (XLK, XLF, XLE, XLV, XLC, XLI, XLY, XLP, XLU, XLRE) via Polygon or
      yfinance. Compute for each: 5-day return, 10-day return, RSI-14,
      MACD signal cross, 20-day vs 50-day SMA relationship.
    • Identify the top 10 momentum gainers and top 5 losers over the past week
      from Polygon daily gainers/losers endpoint (or screener fallback).
    • web_search: "US stock market weekly performance sector rotation
      ${month} ${year} site:finance.yahoo.com OR site:marketwatch.com
      OR site:barrons.com" (num_results: 20)

    1B. Volatility & Options Flow
    • browse_page: https://finance.yahoo.com/quote/%5EVIX/ — extract VIX close,
      5-day trend, intraday range, and historical percentile context.
    • web_search: "options flow unusual activity put call ratio ${month} ${year}
      site:barchart.com OR site:unusualwhales.com" (num_results: 15)
    • Note: elevated VIX (>20) or spiking put/call ratio = raise risk score.

    1C. Earnings Calendar & Surprises
    • browse_page: https://finance.yahoo.com/calendar/earnings/ — extract
      earnings for top 15 S&P 500 companies reporting next week (${startDateStr}
      onward). List tickers, dates, consensus EPS, and revenue estimates.
    • web_search: "earnings surprises this week beat miss ${month} ${year}
      site:seekingalpha.com OR site:earningswhispers.com" (num_results: 15)

    ═══════════════════════════════════════════════════════════
    PHASE 2 — MACRO & ECONOMIC CATALYSTS
    ═══════════════════════════════════════════════════════════

    2A. Federal Reserve & Interest Rates
    • browse_page: https://www.cmegroup.com/trading/interest-rates/countdown-to-fomc.html
      — extract current Fed funds probabilities and market-implied rate path.
    • browse_page: https://www.federalreserve.gov/monetarypolicy/fomc.htm
      — summarise latest FOMC statement or minutes; note hawkish/dovish shift.
    • web_search: "Federal Reserve rate decision outlook ${month} ${year}
      site:reuters.com OR site:cnbc.com" (num_results: 10)

    2B. Economic Releases
    • browse_page: https://www.investing.com/economic-calendar/ — extract
      HIGH-impact events for the coming week; list date, indicator, forecast,
      previous, and potential market impact.
    • browse_page: https://www.bls.gov/news.release/empsit.nr0.htm — latest
      nonfarm payrolls, unemployment rate, CPI if available.
    • web_search: "US economic data releases next week GDP CPI jobs
      ${month} ${year}" (num_results: 10)

    2C. Geopolitical & Macro Risks
    • web_search: "geopolitical risk market impact tariffs trade war sanctions
      ${month} ${year} site:reuters.com OR site:bloomberg.com" (num_results: 10)
    • Assess: supply-chain disruptions, oil price shocks, currency moves (DXY).

    ═══════════════════════════════════════════════════════════
    PHASE 3 — SENTIMENT & FLOW ANALYSIS
    ═══════════════════════════════════════════════════════════

    3A. Institutional & Smart-Money Signals
    • web_search: "institutional buying selling 13F filings insider trades
      ${month} ${year} site:openinsider.com OR site:sec.gov OR
      site:finviz.com" (num_results: 15)
    • web_search: "dark pool activity block trades ${month} ${year}
      site:unusualwhales.com OR site:flowsalgo.com" (num_results: 10)

    3B. Retail & Social Sentiment
    • x_semantic_search: query "US stock market trends sentiment ${month} ${year}",
      limit 2000, from_date ${sevenDaysAgoStr}, to_date ${todayStr},
      min_score_threshold 0.12
    • x_keyword_search: "(S&P500 OR Nasdaq OR $SPY OR $QQQ OR $AAPL OR $NVDA)
      (bullish OR bearish OR rally OR correction) min_faves:50
      since:${sevenDaysAgoStr} until:${todayStr}", limit 2000, mode Latest
    • web_search: "stock market sentiment discussion site:reddit.com/r/wallstreetbets
      OR site:reddit.com/r/stocks ${month} ${year}" (num_results: 20)
    • browse_page: https://www.reddit.com/r/wallstreetbets/hot/ — extract top 5
      market-relevant posts (title, upvotes, bullish/bearish lean).

    3C. Technical Breadth
    • web_search: "market breadth advance decline new highs new lows McClellan
      ${month} ${year} site:stockcharts.com OR site:barchart.com" (num_results: 10)
    • Healthy breadth (>60% advancers, expanding new highs) supports bullish thesis;
      narrow leadership is a warning sign.

    ═══════════════════════════════════════════════════════════
    PHASE 4 — CROSS-VALIDATION & SYNTHESIS (internal only)
    ═══════════════════════════════════════════════════════════

    Before writing the final JSON, perform this internal checklist (do NOT include
    it in the output):

    ✓ Have at least 10 concrete, sourced data points from tools:
      — Exact VIX close and percentile
      — SPY and QQQ weekly % change
      — At least 2 technical indicators (RSI, MACD)
      — CME FedWatch probability for next meeting
      — Quantified sentiment split (e.g., "62% bullish on X, 58% on Reddit")
      — At least 2 specific headlines or quotes from the past 48 hours
      — Next week's key economic event + expected impact
      — At least 1 earnings date + consensus EPS for a mega-cap
      — Breadth metric (advance/decline ratio or new highs/lows)
      — One institutional or dark-pool data point

    ✓ Check for AGREEMENT vs DISAGREEMENT across signals:
      — If technicals + sentiment + macro all align → higher conviction
      — If signals conflict (e.g., bullish technicals but hawkish Fed) → lower
        conviction, note the divergence in rationale

    ✓ Compare against current portfolio: do NOT recommend buying a stock you
      already hold unless you have new conviction; consider trims on losers.

    If any tool returned empty or failed, note it explicitly, reduce confidence,
    and lean on remaining data. Never hallucinate data points.

    ═══════════════════════════════════════════════════════════
    PHASE 5 — GENERATE RECOMMENDATIONS
    ═══════════════════════════════════════════════════════════

    Produce 6-8 actionable stock-only recommendations:

    CONVICTION FRAMEWORK (guides allocation sizing):
    • High conviction (25-40% allocation) — 3+ confirming signals, strong
      catalyst within 5 days, favourable technicals + sentiment.
    • Medium conviction (15-25%) — 2 confirming signals, moderate catalyst.
    • Low conviction (10-15%) — speculative / single-signal thesis.

    RECOMMENDATION RULES:
    • asset_type = "stock" for every recommendation.
    • action = "buy" or "sell".
    • Buy allocations = % of a dedicated $100 stock budget; total must equal 100.
    • Sell allocations = % of currently-held shares to trim (1-50 range).
    • Sells are PARTIAL TRIMS only — never liquidate an entire position.
    • Only recommend selling tickers you currently hold (see portfolio above).
    • Each rationale must cite at least one specific data point from your research.

    IMPORTANT CONSTRAINTS:
    • If tools fail to return data, fall back to pre-trained knowledge as a
      hypothetical simulation. Flag assumptions and reduce confidence.
    • Do not default to fully neutral — provide your best educated estimates.
    • This is an educational simulation only; not financial advice.

    NOTIFICATION:
    When done, provide a short push-notification summary of your analysis.
    Max 178 characters. Do not show the character count in the summary.
  `.trim()

  const compactOutputGuardrails = `
    FINAL OUTPUT HARD LIMITS:
    - Return compact JSON only, with no markdown and no prose outside the JSON object.
    - Include at least one stock recommendation with action set to "buy" or "sell".
    - Never output a sell allocation above 50%.
    - Keep notification <= 178 characters.
    - Keep key_drivers between 3 and 5 items.
    - Keep risk_assessment.notes between 3 and 5 items.
    - Keep recommendations between 6 and 8 total items.
    - Keep assessment_sources between 4 and 8 items.
    - Keep each rationale concise (1 sentence).
  `.trim()

  const prompt = `${basePrompt}\n\n${compactOutputGuardrails}`

  const maxAttempts = 3
  const retryTemperatures = [0.8, 0.4, 0.2]

  try {
    console.log("Running weekly AI market report...")
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const isRetry = attempt > 0
        const retrySuffix = isRetry
          ? `\n\nRETRY ${attempt + 1}/${maxAttempts}: Your previous response could not be parsed as complete JSON. Keep the output shorter and strictly valid JSON.`
          : ""

        const { object } = await generateObject({
          model: currentModel,
          schema: marketReportSchema,
          prompt: `${prompt}${retrySuffix}`,
          temperature: retryTemperatures[attempt] ?? 0.2,
        })

        const normalizedReport: MarketReportSchema = {
          ...object,
          recommendations: normalizeRecommendations(object.recommendations),
        }
        return { success: true, data: normalizedReport }
      } catch (err) {
        lastError = err as Error
        console.warn(`AI market report attempt ${attempt + 1}/${maxAttempts} failed:`, err)
      }
    }

    throw lastError ?? new Error("Failed to generate market report after retries")
  } catch (err) {
    console.error("Error generating market report:", err)
    return { success: false, error: (err as Error).message }
  }
}
