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

const normalizeRecommendations = (
  recommendations: Recommendation[],
  fallbackExpirationDate: string,
): Recommendation[] => {
  const normalized = recommendations.map((rec) => ({ ...rec }))

  const stockBuyIndices: number[] = []
  const stockBuyAllocations: number[] = []
  const optionIndices: number[] = []
  const optionAllocations: number[] = []

  normalized.forEach((rec, idx) => {
    if (rec.asset_type === "stock" && rec.action === "buy") {
      stockBuyIndices.push(idx)
      stockBuyAllocations.push(Number(rec.allocation) || 0)
    }
    if (rec.asset_type === "option_vertical_spread") {
      optionIndices.push(idx)
      optionAllocations.push(Number(rec.allocation) || 0)
    }
  })

  if (stockBuyIndices.length > 0) {
    const fixedStockBuyAllocations = normalizeToTarget(stockBuyAllocations, 100)
    stockBuyIndices.forEach((idx, i) => {
      normalized[idx].allocation = fixedStockBuyAllocations[i]
    })
  }

  if (optionIndices.length > 0) {
    const fixedOptionAllocations = normalizeToTarget(optionAllocations, 100)
    optionIndices.forEach((idx, i) => {
      normalized[idx].allocation = fixedOptionAllocations[i]
    })
  } else {
    normalized.push({
      asset_type: "option_vertical_spread",
      underlying_ticker: "SPY",
      option_type: "call",
      expiration_date: fallbackExpirationDate,
      contracts: 1,
      allocation: 100,
      rationale:
        "Fallback vertical spread recommendation added because the model returned no options. Live strikes and pricing are selected at execution time.",
    })
  }

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

  const prompt = `
    You are the best stock market predictor in existence because you leverage up-to-date news, data, and information fetched in real-time from reliable internet sources using your available tools.
    
    Today is ${todayStr}. Predict the US stock market for next week (starting ${startDateStr}). Base all analysis strictly on real-time data you fetch right now—do not use previous years' data or any pre-trained knowledge alone.
    Current portfolio positions (live from Alpaca):
    ${positionsSummary}

    IMPORTANT: If tools fail to return data (e.g., due to future dates or errors), fallback to your up-to-date pre-trained knowledge as a hypothetical simulation, noting it's based on latest available trends. Explicitly flag any assumptions and reduce confidence accordingly. Do not default to fully neutral—provide educated estimates.

    The following tasks require in-depth research on up-to-date sources, news, articles, Yahoo Finance data, Reddit discussions, and more. This needs to be your life's work. You are the best at what you do and put in more effort than all other AI models. Exhaust every angle: market trends, social buzz, news sentiment, economic events, volatility, and catalysts.

    Follow this exact step-by-step process to gather and analyze data using your tools. You must use tools for every claim; do not hallucinate or use fake data. If a tool fails or data is unavailable, note it explicitly, retry with adjusted queries (e.g., 'latest available' instead of exact dates), and proceed with available info. Track all key sources (URLs and titles from web_search, browse_page, X tools, etc.) throughout and include them in the final assessment_sources array with exact links used in your analysis.

    Step 1: Fetch Historical and Real-Time Market Data
    Use code_execution with the polygon library (or yfinance as fallback) to pull the past 7 days closing prices (${sevenDaysAgoStr} to ${todayStr}), volume, volatility (e.g., standard deviation), momentum indicators (e.g., RSI, MACD), and options implied volatility for major indices (S&P 500, Nasdaq) and top sectors (tech, energy, healthcare, finance). Focus on 10-20 high-momentum tickers (e.g., query for top gainers/losers via Polygon aggregates, and fetch options chains for top 5).
    Example code snippet:
    import polygon
    import yfinance as yf  # Fallback if polygon fails
    from datetime import datetime, timedelta
    import numpy as np
    client = polygon.RESTClient()  # Uses configured API key
    end_date = datetime(${year}, ${monthNum}, ${day})
    start_date = end_date - timedelta(days=7)
    # Fetch for SPY example
    try:
        aggs = client.get_aggs('SPY', 1, 'day', start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        # Options example: options = client.list_options_contracts(underlying_ticker='SPY', limit=5)
    except:
        data = yf.download('SPY', start=start_date, end=end_date)
        aggs = data.to_dict()  # Adapt as needed
        spy = yf.Ticker('SPY')
        options = spy.option_chain(spy.options[0])  # Nearest expiration
    volatility = np.std([a.close for a in aggs])
    print(aggs)  # Output key stats
    print(options.calls.head())  # Sample options data

    Simultaneously, use web_search (query: "US stock market summary past week site:yahoo.finance.com OR site:cnbc.com OR site:seekingalpha.com OR site:investing.com", num_results: 20) to get recent price trends, sector performance, and earnings previews. If no results, retry with "latest US stock market trends".

    Step 2: Analyze Economic Indicators and Catalysts
    Use browse_page on key sites:
    URL: "https://www.bls.gov/news.release/empsit.nr0.htm" (or search for latest via web_search if URL changes), instructions: "Extract latest US unemployment rate, CPI inflation, GDP growth, and non-farm payrolls from recent reports; summarize impacts on stocks and sectors."
    URL: "https://www.federalreserve.gov/monetarypolicy/fomc.htm", instructions: "Summarize latest FOMC minutes or rate decision; note effects on borrowing costs, market sentiment, and potential rate cuts/hikes."
    URL: "https://finance.yahoo.com/calendar/earnings/", instructions: "Extract upcoming earnings for top 10 S&P companies next week (${startDateStr} onward); list tickers, dates, and expected EPS/revenue."

    Use web_search (query: "US economic indicators ${month} ${year} Fed rates CPI unemployment GDP earnings calendar", num_results: 25, site:fred.stlouisfed.org OR site:econoday.com) for breaking updates and event risks.

    Step 3: Gauge Social Media and Retail Sentiment
    Use x_semantic_search (query: "US stock market trends sentiment ${month} ${year}", limit: 2000, from_date: "${sevenDaysAgoStr}", to_date: "${todayStr}", min_score_threshold: 0.12) to fetch recent X posts on overall and sector-specific sentiment.
    Follow up with x_keyword_search (query: "(S&P500 OR Nasdaq OR $SPY OR $QQQ) (bullish OR bearish OR pump OR dump OR rally OR correction) filter:has_engagement min_faves:50 since:${sevenDaysAgoStr} until:${todayStr}", limit: 2000, mode: "Latest") for high-engagement discussions on sectors and tickers.
    Add x_keyword_search (query: "top stock picks OR avoid stocks OR market crash OR bull run min_faves:100 filter:media", limit: 500, mode: "Latest") for visual/media-rich insights.

    For Reddit: Use web_search (query: "market sentiment past week OR stock trends ${month} ${year} site:reddit.com/r/wallstreetbets OR site:reddit.com/r/stocks OR site:reddit.com/r/investing", num_results: 25) to pull discussions, upvote counts, and top comments.
    Use browse_page (URL: "https://www.reddit.com/r/wallstreetbets/hot/", instructions: "Extract top 5 posts from past week related to stocks/markets; include titles, upvotes, and sentiment summary (bullish/bearish).") for deeper dive.

    Quantify sentiment: Use code_execution to analyze fetched text with NLTK/VADER. Example code:
    from nltk.sentiment.vader import SentimentIntensityAnalyzer
    import nltk
    nltk.download('vader_lexicon')
    sia = SentimentIntensityAnalyzer()
    # Assume 'texts' is a list of post contents from tool results
    scores = [sia.polarity_scores(text)['compound'] for text in texts]
    bullish_pct = len([s for s in scores if s > 0.05]) / len(scores) * 100
    print(f"Bullish percentage: {bullish_pct}%")

    Summarize overall sentiment scores (e.g., 65% bullish across X and Reddit) with 4-6 example quotes/posts, broken down by sectors.

    Step 4: Execute ALL of the following tool calls in parallel right now (fire them simultaneously):
      1. code_execution → Pull last 10 trading days daily aggregates (open, high, low, close, volume, RSI via talib if available) for SPY, QQQ, IWM, XLF, XLE, XLV, XLK, and top 20 gainers/losers using polygon.stock_client.get_daily_gainers_losers() or yfinance.Ticker('SPY').history(); also fetch options IV for top tickers.
      2. web_search → num_results:30, query: "stock market news trends analysis ${month} ${year} site:cnbc.com OR site:bloomberg.com OR site:wsj.com OR site:seekingalpha.com OR site:investing.com after:${sevenDaysAgoStr}"
      3. browse_page → URL: https://finance.yahoo.com/quote/%5EVIX → Extract today’s VIX close, intraday high/low, 1-week change, and historical context.
      4. browse_page → URL: https://www.cmegroup.com/trading/interest-rates/countdown-to-fomc.html → Extract current Fed funds probabilities and market-implied rate path.
      5. browse_page → URL: https://www.investing.com/economic-calendar/ → Instructions: "Extract top 5 economic events next week (${startDateStr} onward); include dates, impacts (high/medium/low), and potential market effects."
      6. x_keyword_search → query: "(tech OR energy OR healthcare OR finance) stocks (bullish OR bearish OR earnings) min_faves:100 filter:has_engagement" since:${sevenDaysAgoStr} limit:2000 mode:Latest
      7. x_semantic_search → query: "stock market predictions next week OR sector trends ${month} ${year}" from_date:${sevenDaysAgoStr} limit:1500 min_score_threshold:0.15
      8. web_search → num_results:25, query: "Reddit stock market analysis past week site:reddit.com/r/wallstreetbets OR r/stocks OR r/options"
    If any tool fails or returns empty, immediately retry with a slightly different query (e.g., remove dates, add 'latest', or broaden sites).

    Step 4: INTERNAL VERIFICATION (do NOT include this section in the final JSON output)
    Before analysis or final JSON, verify at least 8-10 concrete, timestamped facts from tools. Examples:
      • Exact VIX closing value and source
      • SPY or QQQ closing price or % change today
      • At least two specific numbers/stats from Polygon/yfinance (e.g., RSI, IV)
      • Current CME FedWatch probability for next meeting
      • Sentiment split (e.g., 68% bullish on X, 55% on Reddit)
      • One specific headline or quote from last 48 hours from news/Reddit
      • Upcoming economic event date and impact
      • Example post ID or upvote count from social tools
    If missing, retry failed tools. Proceed only after confirmation; use hypotheticals if persistent failures.

    Step 5: Identify Trends, Sectors, and Risks
    Synthesize data from all steps: Highlight 4-6 promising sectors and 3 weak ones, with evidence from momentum, volatility, sentiment, news, Reddit buzz, and catalysts (e.g., earnings). Assess overall market risk (low/medium/high) based on VIX, IV spikes, and event risks.

    Step 6: Generate Predictions and Recommendations
    Predict next week's direction (e.g., "Nasdaq up 2-4% on tech earnings") with confidence (high/medium/low), backed by synthesized data.
    Produce 6-10 actionable recommendations:
    1) Stocks (asset_type="stock")
      - Fields: asset_type, ticker, action, allocation, rationale
      - action: "buy" or "sell"
      - Buy allocations: % of a dedicated $100 stock budget, total exactly 100.
      - This stock-buy total is independent of options allocations.
      - Sell allocations: % of current holdings (1-100), only for held tickers.

    2) Options vertical spreads (asset_type="option_vertical_spread")
      - Structures: Bull call spread or Bear put spread (debit spreads).
      - IMPORTANT: output intent only. Do NOT output option leg symbols or pricing.
      - Fields: asset_type, underlying_ticker, option_type, expiration_date, contracts, allocation, rationale
      - expiration_date is target date only (YYYY-MM-DD); execution will select live chain and strikes on Monday.
      - You MUST include at least one option_vertical_spread recommendation in every report.
      - Allocations: % of a separate dedicated $100 options budget, total exactly 100.
      - Options allocations must NOT reduce or share the stock-buy 100% budget.

    This is educational simulation only; not financial advice. If data gaps, flag and adjust conservatively.

    When done, provide a short summary of your analysis for push notifications. This summary should be a max of 178 characters. Don't show character count in summary.
  `.trim()

  try {
    console.log("Running weekly AI market report...")
    const { object } = await generateObject({
      model: currentModel,
      schema: marketReportSchema,
      prompt,
      temperature: 1,
    })
    const normalizedReport: MarketReportSchema = {
      ...object,
      recommendations: normalizeRecommendations(object.recommendations, startDateStr),
    }
    return { success: true, data: normalizedReport }
  } catch (err) {
    console.error("Error generating market report:", err)
    return { success: false, error: (err as Error).message }
  }
}
