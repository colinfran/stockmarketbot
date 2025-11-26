import { generateObject } from "ai"
import { MarketReportSchema, marketReportSchema } from "./schema"
import { format, nextMonday } from "date-fns"

type Response = {
  success: boolean
  data?: MarketReportSchema
  error?: string
}

export const generateWeeklyReport = async (): Promise<Response> => {
  const startDate = nextMonday(new Date())

  const prompt = `
    Predict the US stock market for next week (starting ${format(startDate, "d MMM yyyy")}).
    
    Analyze social media sentiment, historical data, and economic indicators to maximize short-term ROI.
    
    Produce actionable buy recommendations totaling $100, specifying ticker, rationale, and allocation.
    
    Highlight promising and weak sectors, assess overall risk with notes, and cite sources for claims (but do not use unreliable sources).
    
    Prioritize trends, momentum, volatility, and sentiment shifts.

    Do not provide any fake data, it must be true to the best of your knowledge. It is your duty to make sure anthing you state is true and you must cite sources for any claims you make.

    You cannot say that you cannot do it because its a prediction task. You must do it.
  `.trim()

  try {
    console.log("Running weekly AI market report...")
    const { object } = await generateObject({
      model: "openai/gpt-5.1-thinking", // or any model you prefer
      schema: marketReportSchema,
      prompt,
      temperature: 0.7,
    })
    return { success: true, data: object }
  } catch (err) {
    console.error("Error generating market report:", err)
    return { success: false, error: (err as Error).message }
  }
}
