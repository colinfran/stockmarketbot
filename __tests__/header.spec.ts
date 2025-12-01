import { test, expect } from "@playwright/test"

test.describe("Header component", () => {
  test("should navigate to home page", async ({ page }) => {
    await page.goto("/porfolio")
    await page.locator("header").getByRole("button").click()
    await page.getByRole("menuitem", { name: "Home" }).click()
    await expect(page).toHaveURL("/")
  })

  test("should navigate to portfolio page", async ({ page }) => {
    await page.goto("/")
    await page.locator("header").getByRole("button").click()
    await page.getByRole("menuitem", { name: "Portfolio" }).click()
    await expect(page).toHaveURL("/portfolio")
  })

  test("should navigate to about page", async ({ page }) => {
    await page.goto("/")
    await page.locator("header").getByRole("button").click()
    await page.getByRole("menuitem", { name: "About" }).click()
    await expect(page).toHaveURL("/about")
  })

  test("changes theme", async ({ page }) => {
    await page.goto("/")
    const html = page.locator("html");
    await expect(html).toHaveClass(/light/);
    await page.locator("header").getByRole("button").click()
    await page.getByTestId("theme-button").click()
    await expect(html).toHaveClass(/dark/);
  })
})
