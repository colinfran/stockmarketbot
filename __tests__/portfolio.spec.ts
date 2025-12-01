import { test, expect } from "@playwright/test"

test.describe("Portfolio Page", () => {
  test("should display portfolio summary", async ({ page }) => {
    await page.goto("/portfolio")
    await expect(page.getByText("Portfolio")).toBeVisible()
    await expect(page.getByText("Current stock holdings and performance")).toBeVisible()
    await expect(page.getByText("Total Value")).toHaveCount(2);
    await expect(page.getByText("Total P/L")).toBeVisible()
  })

  test("should display holdings table", async ({ page }) => {
    await page.goto("/portfolio")
    await expect(page.getByRole("columnheader", { name: "Symbol" })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "Shares" })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: "Avg Cost" })).toBeVisible()
  })

  test("should open stock detail dialog on row click and close when clicking outside", async ({ page }) => {
    await page.goto("/portfolio")
    // Wait for table to load
    await page.waitForSelector("table tbody", { timeout: 30000 });
    await expect(page.getByText("NVDA")).toBeVisible()
    await page.getByText("NVDA").click()
    // Check dialog opened
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByText("Current Stock Price")).toBeVisible()
    await expect(page.getByText("Purchase History")).toBeVisible()
    await page.getByRole("dialog").getByRole("button").click()
    await expect(page.getByRole("dialog")).not.toBeVisible()

  })
})
