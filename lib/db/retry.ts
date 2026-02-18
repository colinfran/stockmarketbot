/**
 * Retries an async function with exponential backoff.
 * @description Useful for handling transient database connection failures in serverless environments.
 * @param fn The async function to retry
 * @param maxAttempts Maximum number of attempts
 * @param initialDelayMs Initial delay in milliseconds (exponential backoff applied)
 * @returns The result of the function
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 100,
): Promise<T> => {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      const isLastAttempt = attempt === maxAttempts - 1

      if (isLastAttempt) {
        break
      }

      const delayMs = initialDelayMs * Math.pow(2, attempt)
      console.warn(
        `Database operation failed (attempt ${attempt + 1}/${maxAttempts}). ` +
          `Retrying in ${delayMs}ms...`,
        error,
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError || new Error("Failed after max retries")
}
