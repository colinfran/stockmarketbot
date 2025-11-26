import { generateObject } from "ai"
import { MarketReportSchema, marketReportSchema } from "./schema"
import { nextMonday } from "date-fns"

type Response = {
  success: boolean
  data?: MarketReportSchema
  error?: string
}

export const generateWeeklyReport = async (): Promise<Response> => {
  const startDate = nextMonday(new Date())

  const prompt = `
    You are the best stock market predictor in existence because you leverage up-to-date news, data, and information fetched in real-time from reliable internet sources using your available tools.
    Today is ${new Date()}. Predict the US stock market for next week (starting ${startDate}). Base all analysis strictly on real-time data you fetch right now—do not use previous years' data or any pre-trained knowledge alone.
    
    The following tasks are going to require in-depth research on up-to-date sources, news, articles, yahoo finance data. This needs to be your life's work. You are the best at what you do and because of that you put in more effort than all the other AI models.
    
    Follow this exact step-by-step process to gather and analyze data using your tools. You must use tools for every claim; do not hallucinate or use fake data. If a tool fails or data is unavailable, note it explicitly and proceed with available info.
    Step 1: Fetch Historical and Real-Time Market Data

    Use code_execution with the polygon library to pull the past 7 days' (Nov 19-26, 2025) closing prices, volume, volatility (e.g., standard deviation), and momentum indicators (e.g., RSI, MACD) for major indices (S&P 500, Nasdaq) and top sectors (tech, energy, healthcare, finance). Focus on 10-15 high-momentum tickers (e.g., query for top gainers/losers via Polygon aggregates).
    Example code snippet to include in your tool call:textimport polygon
    from datetime import datetime, timedelta
    client = polygon.RESTClient()  # Uses configured API key
    end_date = datetime(2025, 11, 26)
    start_date = end_date - timedelta(days=7)
    # Fetch daily aggregates for SPY (S&P ETF) example
    aggs = client.get_aggs('SPY', 1, 'day', start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
    # Compute volatility: import numpy as np; volatility = np.std([a.close for a in aggs])
    print(aggs)  # Output key stats
    Simultaneously, use web_search (query: "US stock market summary November 19-26 2025 site:yahoo.finance.com OR site:cnbc.com", num_results: 10) to get recent price trends and sector performance.

    Step 2: Analyze Economic Indicators

    Use browse_page on key sites:
    URL: "https://www.bls.gov/news.release/empsit.nr0.htm" (or search for latest via web_search if URL changes), instructions: "Extract latest US unemployment rate, CPI inflation, and GDP growth from Nov 2025 reports; summarize impacts on stocks."
    URL: "https://www.federalreserve.gov/monetarypolicy/fomc.htm", instructions: "Summarize latest FOMC minutes or rate decision from Nov 2025; note effects on borrowing costs and market sentiment."

    Use web_search (query: "US economic indicators November 2025 Fed rates CPI unemployment", num_results: 15) for any breaking updates.

    Step 3: Gauge Social Media Sentiment

    Use x_semantic_search (query: "US stock market trends next week December 2025", limit: 20, from_date: "2025-11-19", to_date: "2025-11-26", min_score_threshold: 0.25) to fetch recent X posts on market sentiment.
    Follow up with x_keyword_search (query: "(S&P500 OR Nasdaq) (bullish OR bearish) filter:has_engagement min_faves:50 since:2025-11-19 until:2025-11-26", limit: 15, mode: "Latest") for high-engagement discussions on sectors.
    Summarize sentiment scores (e.g., 70% bullish for tech) with 2-3 example quotes and usernames.

    Step 4: Identify Trends, Sectors, and Risks

    Synthesize data from Steps 1-3: Highlight 3-5 promising sectors (e.g., AI/tech if momentum high) and 2 weak ones (e.g., energy if volatility spikes). Assess overall market risk (low/medium/high) based on VIX levels (fetch via Polygon or web_search: "VIX index November 26 2025").
    Prioritize: Momentum (price/volume surges), volatility (avoid high-beta if risk-averse), sentiment shifts (e.g., X buzz on earnings), and short-term ROI potential (e.g., upcoming catalysts like Dec earnings).

    Step 5: Generate Predictions and Recommendations

    Predict next week's market direction (e.g., "Nasdaq up 2-4% on AI tailwinds") with confidence level (high/medium/low), backed by data.
    Produce 4-6 actionable buy recommendations totaling exactly $100. For each: Ticker (e.g., NVDA), allocation ($ amount), rationale (1-2 sentences tying to trends/sentiment/economics), and expected short-term ROI (e.g., +5%).
    Example: NVDA: $30 - Strong momentum from AI news sentiment; RSI oversold rebound likely.

    You must complete this analysis using tools—do not skip steps or claim inability. This is educational simulation only; not financial advice. If data gaps exist, flag them and adjust recommendations conservatively.
  `.trim()

  try {
    console.log("Running weekly AI market report...")
    const { object } = await generateObject({
      model: "xai/grok-4-fast-reasoning",
      schema: marketReportSchema,
      prompt,
      temperature: 1,
    })
    return { success: true, data: object }
  } catch (err) {
    console.error("Error generating market report:", err)
    return { success: false, error: (err as Error).message }
  }
}
