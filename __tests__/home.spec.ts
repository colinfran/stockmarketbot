import { test, expect } from "@playwright/test"

test.describe("Dashboard Page", () => {
  test("should display countdown timers", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Next Market Analysis")).toBeVisible()
    await expect(page.getByText("Next Stock Purchase")).toBeVisible()
  })

  test("should display market report", async ({ page }) => {
    await page.goto("/")
    await page.waitForSelector("text=Executive Summary", { timeout: 10000 })
    await expect(page.getByText("Executive Summary")).toBeVisible()
    await expect(page.getByText("Market Overview")).toBeVisible()
    await expect(page.getByText("Risk Assessment")).toBeVisible()
  })
})
